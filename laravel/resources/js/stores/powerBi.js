import { defineStore } from "pinia";
import api from "@/plugins/axios";
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";

export const usePowerBiStore = defineStore("powerbi", () => {
    const auth = useAuthStore();
    const powerBiEmbedUrl = ref(null);
    const lastRefresh = ref(Date.now());
    const isLeader = ref(false);

    let leaderResponseReceived = false;
    let refreshTimer = null;

    const refreshInterval = 2700; // For testing 15 seconds; change to 2700 (45 mins)

    const channel = new BroadcastChannel("pbi_refresh");
    let lastActiveTime = Date.now();

    let initialized = false;

    // ---------------------------------------------------
    // BroadcastChannel Communication
    // ---------------------------------------------------

    function requestLeader() {
        channel.postMessage({ type: "leader_request" });
    }

    async function becomeLeader() {
        isLeader.value = true;

        console.log("BECOMING LEADER: Fetching initial token...");

        // 1. Fetch and set the URL FIRST
        await fetchSignedUrl();

        // 2. Broadcast leadership + the NEWLY FETCHED URL
        channel.postMessage({
            type: "leader",
            url: powerBiEmbedUrl.value, // Guaranteed to be non-null after fetch
        });

        // 3. Start the recurring timer
        startAutoRefresh();
    }

    channel.onmessage = async (event) => {
        const msg = event.data;
        if (!msg || !msg.type) return;

        console.log("Received BC message:", msg);

        // Another tab declares leadership
        if (msg.type === "leader") {
            console.log("Leader detected.");

            leaderResponseReceived = true;

            // IMPORTANT — followers must never refresh or run timers
            isLeader.value = false;
            clearInterval(refreshTimer);
            refreshTimer = null;

            // Leader may include the newest URL
            if (msg.url) {
                powerBiEmbedUrl.value = msg.url;
                lastRefresh.value = Date.now();
            }

            return;
        }

        // Another tab requests leader
        if (msg.type === "leader_request") {
            // FIX 1: Leader always responds if it exists, letting the receiver handle null URL.
            if (isLeader.value) {
                channel.postMessage({
                    type: "leader",
                    url: powerBiEmbedUrl.value ?? null,
                });
            }
            return;
        }

        // Leader broadcasts new token URL
        if (msg.type === "refresh") {
            if (isLeader.value) return; // Leaders ignore refresh messages

            console.log("Follower received refresh URL.");

            leaderResponseReceived = true;
            if (msg.url) {
                powerBiEmbedUrl.value = msg.url;
                lastRefresh.value = Date.now();
            }

            return;
        }

        if (msg.type === "logout") {
            console.log("Received logout broadcast.");
            logoutHandler();
            return;
        }
    };

    // ---------------------------------------------------
    // Token Refresh Logic (LEADER ONLY)
    // ---------------------------------------------------

    async function fetchSignedUrl() {
        try {
            const response = await api.get("/pbi", {
                headers: { Authorization: `Bearer ${auth.token}` },
            });

            const { signedUrl, message } = response.data;

            if (signedUrl) {
                console.log(message);
                powerBiEmbedUrl.value = signedUrl;
                lastRefresh.value = Date.now();
                return signedUrl;
            }
        } catch (error) {
            console.error("Failed to load Power BI URL:", error);
        }
    }

    async function refresh() {
        if (!isLeader.value) return;

        const url = await fetchSignedUrl();
        if (url) {
            console.log("Leader refreshed and broadcasting new URL.");
            channel.postMessage({ type: "refresh", url });
        }
    }

    function startAutoRefresh() {
        clearInterval(refreshTimer);

        refreshTimer = setInterval(async () => {
            if (isLeader.value) {
                await refresh();
            }
        }, refreshInterval * 1000);
    }

    // ---------------------------------------------------
    // Visibility + Inactivity Logic
    // ---------------------------------------------------

    const handleVisibility = async () => {
        if (document.hidden) {
            console.log("Tab hidden — pausing refresh timer.");
            lastActiveTime = Date.now();
            clearInterval(refreshTimer);
            return;
        }

        console.log("Tab visible — evaluating inactivity.");
        const inactiveTime = (Date.now() - lastActiveTime) / 1000;
        const threshold = refreshInterval + 10; // buffer of 10 seconds

        if (inactiveTime >= threshold) {
            console.log("Inactive too long. Checking leader again.");

            leaderResponseReceived = false;
            requestLeader();

            await new Promise((resolve) => setTimeout(resolve, 800));

            // Only take leadership if NO leader responds
            if (!leaderResponseReceived) {
                console.log("No leader active — taking leadership.");
                await becomeLeader();
            } else {
                console.log("Leader still active — will not take over.");
            }

            return;
        }

        // Resume only if leader
        if (isLeader.value) {
            startAutoRefresh();
        }
    };

    function setupVisibilityHandler() {
        document.addEventListener("visibilitychange", handleVisibility);
    }

    // ---------------------------------------------------
    // Logout Handling
    // ---------------------------------------------------
    function broadcastLogout() {
        channel.postMessage({ type: "logout" });
        // Immediately do local cleanup so current tab is consistent
        logoutHandler();
    }

    function logoutHandler() {
        clearInterval(refreshTimer);
        refreshTimer = null;
        powerBiEmbedUrl.value = null;
        isLeader.value = false;
        leaderResponseReceived = false;
        document.removeEventListener("visibilitychange", handleVisibility);
        console.log("PowerBI store logged out and cleaned up.");
    }

    // ---------------------------------------------------
    // INIT — Called from component onMounted()
    // ---------------------------------------------------

    async function init() {
        console.log("PowerBI store init — requesting leader.");
        if (initialized) return;
        initialized = true;

        requestLeader();
        await new Promise((resolve) => setTimeout(resolve, 800));

        if (!leaderResponseReceived) {
            console.log(
                "No leader found — becoming leader (and fetching token)."
            );
            await becomeLeader(); // Wait for the async function to complete
        } else {
            // Follower does NOTHING but wait for the 'leader' message handler
            // to receive the URL from the leader and set powerBiEmbedUrl.value.
            console.log(
                "Leader exists — waiting for leader's initial URL broadcast."
            );
        }

        setupVisibilityHandler();
    }

    function cleanup() {
        initialized = false;
        clearInterval(refreshTimer);
        channel.close();
        document.removeEventListener("visibilitychange", handleVisibility);
    }

    return {
        powerBiEmbedUrl,
        isLeader,
        init,
        cleanup,
        broadcastLogout,
    };
});

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

    const refreshInterval = 15; // For testing; change to 2700 (45 mins)

    const channel = new BroadcastChannel("pbi_refresh");
    let lastActiveTime = Date.now();

    // ---------------------------------------------------
    // BroadcastChannel Communication
    // ---------------------------------------------------

    function requestLeader() {
        channel.postMessage({ type: "leader_request" });
    }

    function becomeLeader() {
        isLeader.value = true;
        leaderResponseReceived = true;

        console.log("BECOMING LEADER");

        // Broadcast leadership + currently known URL
        channel.postMessage({
            type: "leader",
            url: powerBiEmbedUrl.value ?? null,
        });

        leaderInit();
    }

    channel.onmessage = async (event) => {
        const msg = event.data;
        if (!msg || !msg.type) return;

        console.log("Received BC message:", msg);

        // -------------------------------
        // Another tab declares leadership
        // -------------------------------
        if (msg.type === "leader") {
            console.log("Leader detected. I am FOLLOWER.");

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

        // -------------------------------
        // Another tab requests leader
        // -------------------------------
        if (msg.type === "leader_request") {
            if (isLeader.value) {
                channel.postMessage({
                    type: "leader",
                    url: powerBiEmbedUrl.value ?? null,
                });
            }
            return;
        }

        // -------------------------------
        // Leader broadcasts new token URL
        // -------------------------------
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

    async function leaderInit() {
        await refresh();
        startAutoRefresh();
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
            console.log("Tab hidden — pausing my refresh timer.");
            lastActiveTime = Date.now();
            clearInterval(refreshTimer);
            return;
        }

        console.log("Tab visible — evaluating inactivity.");
        const inactiveTime = (Date.now() - lastActiveTime) / 1000;
        const threshold = refreshInterval * 2;

        if (inactiveTime >= threshold) {
            console.log("Inactive too long. Checking leader again.");

            leaderResponseReceived = false;
            requestLeader();

            await new Promise((resolve) => setTimeout(resolve, 300));

            // Only take leadership if NO leader responds
            if (!leaderResponseReceived) {
                console.log("No leader active — taking leadership.");
                becomeLeader();
            } else {
                console.log("Leader still active — will not take over.");
            }

            return;
        }

        // Resume only if I am leader
        if (isLeader.value) {
            startAutoRefresh();
        }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    const broadCastlogout = () => {
        channel.postMessage({ type: "logout" });
    };

    // ---------------------------------------------------
    // INIT — Called from component onMounted()
    // ---------------------------------------------------

    async function init() {
        console.log("PowerBI store init — requesting leader.");

        requestLeader();
        await new Promise((resolve) => setTimeout(resolve, 300));

        if (!leaderResponseReceived) {
            console.log("No leader found — becoming leader.");
            becomeLeader();
        } else {
            console.log("Leader exists — I am follower.");
        }
    }

    function cleanup() {
        clearInterval(refreshTimer);
        channel.close();
        document.removeEventListener("visibilitychange", handleVisibility);
    }

    return {
        powerBiEmbedUrl,
        isLeader,
        init,
        cleanup,
    };
});

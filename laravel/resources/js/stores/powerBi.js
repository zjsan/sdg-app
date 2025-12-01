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
    let refreshInProgress = false;

    const channel = new BroadcastChannel("pbi_refresh");
    let lastActiveTime = Date.now();

    let initialized = false;

    // ---------------------------------------------------
    // BroadcastChannel Communication
    // ---------------------------------------------------

    //geenrate unique tab ID
    function generateTabId() {
        return (
            "t_" + Math.random().toString(36).slice(2) + Date.now().toString(36)
        );
    }
    const TAB_ID = generateTabId();

    function requestLeader() {
        channel.postMessage({ type: "leader_request", tabId: TAB_ID });
    }

    async function becomeLeader() {
        isLeader.value = true;
        console.log("BECOMING LEADER: Fetching initial token...");

        // Try to fetch with a few rapid retries
        let signed = null;
        const maxAttempts = 3;
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            signed = await fetchSignedUrl();
            if (signed) break;
            console.warn(
                `fetchSignedUrl attempt ${attempt} failed, retrying...`
            );
            await new Promise((r) => setTimeout(r, 500 * attempt)); // small backoff
        }

        if (!signed) {
            console.error(
                "Unable to fetch signed URL — cannot become leader right now."
            );
            isLeader.value = false;
            // Optionally broadcast a 'leader_failed' message so other tabs can try
            channel.postMessage({ type: "leader_failed", tabId: TAB_ID });
            return;
        }

        // Broadcast leadership + the NEWLY FETCHED URL
        channel.postMessage({
            type: "leader",
            url: powerBiEmbedUrl.value,
            tabId: TAB_ID,
            ts: Date.now(),
        });

        startAutoRefresh();
    }

    //read messages from other tabs
    channel.onmessage = async (event) => {
        const msg = event.data;
        if (!msg || !msg.type) return;
        if (msg.tabId === TAB_ID) return;

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
                    tabId: TAB_ID,
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
            channel.postMessage({ type: "refresh", tabId: TAB_ID, url });
        }
    }

    function startAutoRefresh() {
        clearInterval(refreshTimer);
        refreshTimer = setInterval(async () => {
            if (!isLeader.value) return;
            if (refreshInProgress) return;
            refreshInProgress = true;
            try {
                await refresh();
            } catch (err) {
                console.error("Auto refresh error", err);
            } finally {
                refreshInProgress = false;
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

            // Leader MUST stop its timer when hidden.
            clearInterval(refreshTimer);
            refreshTimer = null;
            return;
        }

        console.log("Tab visible — evaluating inactivity.");
        const inactiveTime = (Date.now() - lastActiveTime) / 1000;
        const threshold = refreshInterval + 10; // buffer of 10 seconds

        if (inactiveTime >= threshold) {
            console.log("Inactive too long. Checking leader again.");

            //call helper function
            // shorter timeout here as the app is already running and active tabs should respond quickly.
            await tryClaimLeadershipWithLock(500);

            // After challengeLeader, if we became the leader, becomeLeader() already started the timer.
            return;
        }

        // If we are currently the leader, and we weren't inactive long enough,
        // wresume the timer that was paused when the tab was hidden.
        // Resume only if leader
        if (isLeader.value && !refreshTimer) {
            console.log("Active Leader detected. Resuming auto refresh.");
            startAutoRefresh();
        }
    };

    function setupVisibilityHandler() {
        document.addEventListener("visibilitychange", handleVisibility);
    }

    //listener for tab close/unload and broadcast to other tabs
    window.addEventListener("beforeunload", () => {
        try {
            if (isLeader.value) {
                channel.postMessage({
                    type: "leader_left",
                    tabId: TAB_ID,
                    ts: Date.now(),
                });
            }
        } catch (e) {}
    });

    //listener for localStorage changes (for leader claims)
    window.addEventListener("storage", (e) => {
        if (e.key === "pbi_leader_claim") {
            // parse and set leaderResponseReceived so waiting challenge functions see it
            try {
                const parsed = JSON.parse(e.newValue);
                if (parsed && parsed.tabId && parsed.tabId !== TAB_ID) {
                    leaderResponseReceived = true;
                }
            } catch (err) {}
        }
    });

    // ---------------------------------------------------
    // Logout Handling
    // ---------------------------------------------------
    function broadcastLogout() {
        channel.postMessage({ type: "logout", tabId: TAB_ID });
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

    // HELPER FUNCTION
    //centralizes the logic for requesting a leader, waiting for a response, and then taking leadership if no response is received.
    async function tryClaimLeadershipWithLock(timeoutMs = 800) {
        leaderResponseReceived = false;
        requestLeader();

        // small randomized delay so many tabs don't all act exactly at same time
        const randomizedDelay = 50 + Math.floor(Math.random() * 200);
        await new Promise((r) => setTimeout(r, randomizedDelay));

        // check localStorage for an existing fresh claim
        const claim = localStorage.getItem("pbi_leader_claim");
        if (claim) {
            try {
                const parsed = JSON.parse(claim);
                const age = Date.now() - (parsed.ts || 0);
                if (parsed.tabId && age < 5000) {
                    // 5s fresh claim
                    // someone else recently claimed leadership; we'll wait to follow
                    leaderResponseReceived = true;
                    return;
                }
            } catch (e) {
                // ignore parse error
            }
        }

        // Wait for the remainder of the timeout for other BC responses
        await new Promise((resolve) =>
            setTimeout(resolve, Math.max(0, timeoutMs - randomizedDelay))
        );

        if (!leaderResponseReceived) {
            // set a quick localStorage claim (so other tabs see it immediately)
            localStorage.setItem(
                "pbi_leader_claim",
                JSON.stringify({ tabId: TAB_ID, ts: Date.now() })
            );
            // small grace period to allow others to pick up the claim
            await new Promise((r) => setTimeout(r, 50));
            // double-check if someone else posted leader over BC
            if (!leaderResponseReceived) {
                console.log("Taking leadership (post-lock).");
                await becomeLeader();
            } else {
                console.log(
                    "Another leader appeared after claim; backing off."
                );
            }
        } else {
            console.log("Existing leader responded — will follow.");
        }
    }

    // ---------------------------------------------------
    // INIT — Called from component onMounted()
    // ---------------------------------------------------

    async function init() {
        console.log("PowerBI store init — requesting leader.");
        if (initialized) return;
        initialized = true;

        await tryClaimLeadershipWithLock(1000);
        setupVisibilityHandler();
    }

    function cleanup() {
        initialized = false;
        clearInterval(refreshTimer);
        refreshTimer = null;
        powerBiEmbedUrl.value = null;
        isLeader.value = false;
        leaderResponseReceived = false;
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

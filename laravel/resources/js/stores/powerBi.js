import { defineStore } from "pinia";
import api from "@/plugins/axios";
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { watch } from "vue";
import { v4 as uuidv4 } from 'uuid';

export const usePowerBiStore = defineStore("powerbi", () => {
    const auth = useAuthStore();
    const powerBiEmbedUrl = ref(null);
    const lastRefresh = ref(Date.now());
    const isLeader = ref(false);

    let leaderResponseReceived = false;
    let refreshTimer = null;

    const refreshInterval = 2700; // For testing or development 15 seconds; change to 2700 (45 mins) in production
    let refreshInProgress = false;

    const channel = new BroadcastChannel("pbi_refresh");
    let lastActiveTime = Date.now();
    let initialized = false;

    let stopAuthWatch = null; //wathcer stopper variable

    //heartbeat variables
    let heartbeatTimer = null;
    let lastHeartbeat = Date.now();

    const events = ["mousemove", "keydown", "scroll", "touchstart", "click"]; //activity events

    //geenrate unique tab ID
    const TAB_ID = uuidv4();

    // Auth token watcher
    stopAuthWatch = watch(
        () => auth.token,
        async (newToken, oldToken) => {
            if (!newToken) {
                // logged out
                cleanup();
                return;
            }
            if (isLeader.value) {
                await refresh();
            }
        }
    );

    //inactivity listeners
    function updateActive() {
        lastActiveTime = Date.now();
    }

    function setupVisibilityHandler() {
        document.addEventListener("visibilitychange", handleVisibility);
    }

    function setupActivityListeners() {
        events.forEach((evt) => {
            window.addEventListener(evt, updateActive, { passive: true });
        });
    }

    function removeActivityListeners() {
        events.forEach((evt) => {
            window.removeEventListener(evt, updateActive);
        });
    }

    // Heartbeat functions to detect system sleep/throttling
    function startHeartbeat() {
        lastHeartbeat = Date.now();
        heartbeatTimer = setInterval(() => {
            const now = Date.now();
            const delta = (now - lastHeartbeat) / 1000;
            // if gap is much larger than interval -> likely system sleep or heavy throttle
            if (delta > refreshInterval + 20) {
                console.log("Detected long suspension — re-evaluating leader.");
                lastActiveTime = now;
                tryClaimLeadershipWithLock(500);
            }
            lastHeartbeat = now;
        }, 5000); // every 5s
    }

    function stopHeartbeat() {
        clearInterval(heartbeatTimer);
        heartbeatTimer = null;
    }

    // ---------------------------------------------------
    // BroadcastChannel Communication
    // ---------------------------------------------------

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

        // Broadcast leadership
        channel.postMessage({
            type: "leader",
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

        // Leader declares leadership
        if (msg.type === "leader") {
            console.log("Leader detected.");

            leaderResponseReceived = true;

            isLeader.value = false;
            clearInterval(refreshTimer);
            refreshTimer = null;

            // Followers fetch their own signed URL
            try {
                const resp = await api.get("/pbi", {
                    headers: { Authorization: `Bearer ${auth.token}` },
                });

                if (resp?.data?.signedUrl) {
                    powerBiEmbedUrl.value = resp.data.signedUrl;
                    lastRefresh.value = Date.now();
                }
            } catch (err) {
                console.error(
                    "Follower failed to fetch signed URL after leader message",
                    err
                );
            }

            return;
        }

        // Another tab requests leader
        if (msg.type === "leader_request") {
            // Leader always responds if it exists, letting the receiver handle null URL.
            if (isLeader.value) {
                channel.postMessage({
                    type: "leader",
                    tabId: TAB_ID,
                    url: powerBiEmbedUrl.value ?? null,
                });
            }
            return;
        }

        if (msg.type === "leader_failed") {
            console.warn(
                `Tab ${msg.tabId} reported failure to fetch token and claim leadership. Initiating re-challenge.`
            );

            // A follower should not be running the timer, but we check to be safe.
            if (isLeader.value) return;

            // Immediately run the leader challenge.
            // This allows the current tab to skip waiting and attempt to acquire leadership
            // or receive the token from a different leader.
            // short timeout since the system is already active.
            tryClaimLeadershipWithLock(500);

            return;
        }

        if (msg.type === "leader_left") {
            console.log(
                `Leader tab ${msg.tabId} left. Initiating a new leader challenge.`
            );

            // Check if the current tab is also currently in a leadership state (which is unlikely
            // but possible if two tabs became leaders briefly).
            if (isLeader.value) return;

            // Force a re-challenge to speed up the election.
            tryClaimLeadershipWithLock(500); //shorter fast-response timeout
            return;
        }

        // Leader broadcasts new token URL
        if (msg.type === "refresh") {
            if (isLeader.value) return;

            console.log("Follower received refresh trigger.");

            leaderResponseReceived = true;

            // Followers fetch their own fresh signed URL
            try {
                const resp = await api.get("/pbi", {
                    headers: { Authorization: `Bearer ${auth.token}` },
                });

                if (resp?.data?.signedUrl) {
                    powerBiEmbedUrl.value = resp.data.signedUrl;
                    lastRefresh.value = Date.now();
                }
            } catch (err) {
                console.error(
                    "Follower failed to fetch signed URL on refresh",
                    err
                );
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
            // broadcast refresh trigger
            channel.postMessage({
                type: "refresh",
                tabId: TAB_ID,
                ts: Date.now(),
            });
        } else {
            console.warn(
                "Leader failed to refresh token. Relinquishing leadership."
            );
            isLeader.value = false;
            clearInterval(refreshTimer);
            refreshTimer = null;
            channel.postMessage({ type: "leader_failed", tabId: TAB_ID });
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

    //listener for tab close/unload and broadcast to other tabs
    function handleBeforeUnload() {
        try {
            if (isLeader.value) {
                channel.postMessage({
                    type: "leader_left",
                    tabId: TAB_ID,
                    ts: Date.now(),
                });
            }
        } catch (e) {}
    }

    //listener for localStorage changes (for leader claims)
    function handleStorageEvent(e) {
        if (e.key === "pbi_leader_claim") {
            try {
                const parsed = JSON.parse(e.newValue);
                if (parsed && parsed.tabId && parsed.tabId !== TAB_ID) {
                    leaderResponseReceived = true;
                }
            } catch (err) {}
        }
    }

    // ---------------------------------------------------
    // Logout Handling
    // ---------------------------------------------------
    function broadcastLogout() {
        channel.postMessage({ type: "logout", tabId: TAB_ID });
        // Immediately do local cleanup so current tab is consistent
        logoutHandler();
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

    function clearLeaderClaimIfMine() {
        try {
            const claim = localStorage.getItem("pbi_leader_claim");
            if (!claim) return;
            const parsed = JSON.parse(claim);
            if (parsed && parsed.tabId === TAB_ID) {
                localStorage.removeItem("pbi_leader_claim");
            }
        } catch (e) {}
    }

    function logoutHandler() {
        cleanup();
        console.log("PowerBI store logged out and cleaned up.");
    }

    // ---------------------------------------------------
    // INIT — Called from component onMounted()
    // ---------------------------------------------------

    async function init() {
        console.log("PowerBI store init — requesting leader.");
        if (initialized) return;
        initialized = true;

        console.log("PowerBI Store initialized in Tab:", TAB_ID);

        await tryClaimLeadershipWithLock(1000);
        setupVisibilityHandler();
        setupActivityListeners();
        window.addEventListener("beforeunload", handleBeforeUnload);
        window.addEventListener("storage", handleStorageEvent);
        startHeartbeat();
    }

    function cleanup() {
        initialized = false;

        // stop refresh timer
        clearInterval(refreshTimer);
        refreshTimer = null;

        // clear store state
        powerBiEmbedUrl.value = null;
        isLeader.value = false;
        leaderResponseReceived = false;

        // clear leader claim if this tab owns it
        clearLeaderClaimIfMine();

        // stop auth watcher
        if (typeof stopAuthWatch === "function") {
            stopAuthWatch();
            stopAuthWatch = null;
        }

        // remove visibility handler
        document.removeEventListener("visibilitychange", handleVisibility);

        // remove window listeners
        window.removeEventListener("beforeunload", handleBeforeUnload);
        window.removeEventListener("storage", handleStorageEvent);

        // remove activity listeners & heartbeat
        removeActivityListeners();
        stopHeartbeat();

        console.log(
            "PowerBI store fully cleaned up (listeners removed, timers stopped)."
        );
        channel.close();
    }

    return {
        powerBiEmbedUrl,
        isLeader,
        init,
        cleanup,
        broadcastLogout,
    };
});

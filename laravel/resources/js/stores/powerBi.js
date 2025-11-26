import { defineStore } from "pinia";
import { api } from "@/api";
import { ref } from "vue";

export const usePowerBiStore = defineStore("powerbi", () => {
    const powerBiEmbedUrl = ref(null);
    const lastRefresh = ref(Date.now());
    const isLeader = ref(false);
    const channel = new BroadcastChannel("pbi_refresh"); // for inter-tab communication
    let refreshTimer = null;

    const refreshInterval = 2700; // 45 min

    // ---- Leader Election ----
    function becomeLeader() {
        isLeader.value = true;
        channel.postMessage({ type: "leader" });
        startAutoRefresh();
    }

    // Request leadership from other tabs
    function requestLeader() {
        channel.postMessage({ type: "leader_request" });
    }

    // Listen for messages from other tabs
    channel.onmessage = async (event) => {
        const msg = event.data;

        if (msg.type === "leader") {
            isLeader.value = false; // Another tab owns leadership
        }

        if (msg.type === "leader_request" && isLeader.value) {
            // Tell the new tab that a leader exists
            channel.postMessage({ type: "leader" });
        }

        if (msg.type === "refresh" && !isLeader.value) {
            powerBiEmbedUrl.value = msg.url;
        }
    };

    // ---- Refresh Logic ----
    async function fetchSignedUrl() {
        const response = await api.get("/pbi");
        powerBiEmbedUrl.value = response.data.powerBiEmbedUrl;
        lastRefresh.value = Date.now();
        return powerBiEmbedUrl.value;
    }

    async function refresh() {
        const url = await fetchSignedUrl();
        channel.postMessage({ type: "refresh", url });
    }

    function startAutoRefresh() {
        clearInterval(refreshTimer);

        refreshTimer = setInterval(async () => {
            if (isLeader.value) {
                await refresh();
            }
        }, refreshInterval * 1000);
    }

    // ---- Tab Init ----
    async function init() {
        // 1. Fetch the URL immediately (every tab does this once)
        // This loads the dashboard instantly while election happens in background.
        await fetchSignedUrl();

        // 2. Start the Leader Election process
        requestLeader();

        // 3. Wait for leadership decision (300ms)
        setTimeout(async () => {
            if (!isLeader.value) {
                // No leader responded -> become leader and start the auto-refresh loop.
                becomeLeader();
            }
            // If it's a follower, it doesn't start the timer; it waits for the leader's broadcast.
        }, 300);
    }

    // ---- Cleanup ----
    function cleanup() {
        clearInterval(refreshTimer);
        channel.close();
    }

    return {
        powerBiEmbedUrl,
        isLeader,
        init,
        cleanup,
    };
});

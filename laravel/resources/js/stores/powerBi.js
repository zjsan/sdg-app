import { defineStore } from "pinia";
import { api } from "@/api";
import { ref } from "vue";

export const usePowerBiStore = defineStore("powerbi", () => {
    const powerBiEmbedUrl = ref(null);
    const lastRefresh = ref(Date.now());
    const isLeader = ref(false);

    let refreshTimer = null;
    const refreshInterval = 2700; // 45 min

    const channel = new BroadcastChannel("pbi_refresh"); // broadcast channel setup

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
        // 1. Ask for existing leader
        requestLeader();

        // 2. Wait briefly to see if a leader answers
        setTimeout(async () => {
            if (isLeader.value) {
                // We are leader -> fetch once
                await refresh(); // fetch + broadcast
                startAutoRefresh();
            }

            // If follower: wait for broadcast
            // no backend calls
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

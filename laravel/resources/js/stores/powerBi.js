import { defineStore } from "pinia";
import { api } from "@/api";
import { ref } from "vue";

export const usePowerBiStore = defineStore("powerbi", () => {
    const powerBiEmbedUrl = ref(null);
    const lastRefresh = ref(Date.now());
    const isLeader = ref(false);
    let leaderResponseReceived = false; // flag to track if a leader response was received

    let refreshTimer = null;
    const refreshInterval = 2700; // 45 min

    const channel = new BroadcastChannel("pbi_refresh"); // broadcast channel setup

    // Request leadership from other tabs

    //  Leader Election Messaging
    function requestLeader() {
        channel.postMessage({ type: "leader_request" });
    }

    function becomeLeader() {
        isLeader.value = true;
        channel.postMessage({ type: "leader" });
        startAutoRefresh();
    }

    // Broacast channel message handling
    channel.onmessage = async (event) => {
        const msg = event.data; //receive data

        if (msg.type === "leader") {
            leaderResponseReceived = true;
            isLeader.value = false; // Another tab owns leadership
        }

        //check if leader exists
        if (msg.type === "leader_request" && isLeader.value) {
            // Tell the new tab that a leader exists
            channel.postMessage({ type: "leader" });
        }

        // leader sends new url to followers
        if (msg.type === "refresh" && !isLeader.value) {
            powerBiEmbedUrl.value = msg.url;
        }
    };

    // ---- Refresh Logic ----
    // only leader tab fetches new signed url from backend
    async function fetchSignedUrl() {
         const response = await api.get("/pbi", {
            headers: { Authorization: `Bearer ${auth.token}` },
        });
        powerBiEmbedUrl.value = response.data.powerBiEmbedUrl;
        lastRefresh.value = Date.now();
        return powerBiEmbedUrl.value;
    }

    // 1. Initial Auth Check and Data Fetch
    try {
        const response = await api.get("/pbi", {
            headers: { Authorization: `Bearer ${auth.token}` },
        });

        console.log("Power BI API Response:", response.data);

        const { signedUrl, message } = response.data;

        if (signedUrl) {
            // Construct the final, full URL on the client side
            powerBiEmbedUrl.value = signedUrl;
            console.log(message);
        } else {
            console.error("Missing Power BI IDs in response.");
        }
    } catch (error) {
        console.error("Failed to load Power BI URL:", error);
    }

    async function refresh() {
        const url = await fetchSignedUrl();

        //broadcast new url to followers
        channel.postMessage({ type: "refresh", url });
    }

    function startAutoRefresh() {
        clearInterval(refreshTimer);

        //refresh every refreshInterval seconds => 45 minutes
        refreshTimer = setInterval(async () => {
            if (isLeader.value) {
                await refresh();
            }
        }, refreshInterval * 1000);
    }

    // Store initialization runs when dashboard is loaded
    async function init() {
        // 1. Ask for existing leader
        requestLeader();

        // 2. Wait briefly to see if a leader answers
        setTimeout(async () => {
            if (!leaderResponseReceived) {
                becomeLeader();
                await refresh();
            }

            // If follower: wait for broadcast
            // no backend calls
        }, 300);
    }

    // ---- Cleanup ----
    //tab closing or navigating away
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

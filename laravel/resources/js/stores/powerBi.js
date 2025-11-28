import { defineStore } from "pinia";
import api from "@/plugins/axios";
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";

export const usePowerBiStore = defineStore("powerbi", () => {
    const auth = useAuthStore();
    const powerBiEmbedUrl = ref(null);
    const lastRefresh = ref(Date.now());
    const isLeader = ref(false);
    let leaderResponseReceived = false; // flag to track if a leader response was received

    let refreshTimer = null;
    const refreshInterval = 15; // 45 min in seconds

    const channel = new BroadcastChannel("pbi_refresh"); // broadcast channel setup

    let lastActiveTime = Date.now();

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
        if (msg.type === "refresh") {
            // Leaders NEVER apply refresh from others
            if (isLeader.value) return;

            // Ignore refresh messages until election is settled
            if (!leaderResponseReceived) {
                console.log("Ignoring refresh during election");
                return;
            }

            powerBiEmbedUrl.value = msg.url;
        }
    };

    // ---- Refresh Logic ----
    // only leader tab fetches new signed url from backend
    async function fetchSignedUrl() {
        try {
            const response = await api.get("/pbi", {
                headers: { Authorization: `Bearer ${auth.token}` },
            });

            console.log("Power BI API Response:", response.data);
            const { signedUrl, message } = response.data;

            if (signedUrl) {
                console.log(message);
                powerBiEmbedUrl.value = signedUrl;
                lastRefresh.value = Date.now();
                return powerBiEmbedUrl.value;
            } else {
                console.error("Missing Power BI IDs in response.");
            }
        } catch (error) {
            console.error("Failed to load Power BI URL:", error);
        }
    }

    async function refresh() {
        const url = await fetchSignedUrl();

        //broadcast new url to followers'
        if (url) {
            channel.postMessage({ type: "refresh", url });
            console.log("Broadcasted new Power BI URL to followers.");
        }
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
        // 1. All tabs MUST perform an initial fetch to load the dashboard immediately.
        await fetchSignedUrl();

        // 2. Ask for existing leader
        requestLeader();

        // 3. Wait for election
        await new Promise((resolve) => setTimeout(resolve, 300));

        if (!leaderResponseReceived) {
            becomeLeader(); // Claims leadership and STARTS THE RECURRING TIMER

            // REMOVE INITIAL BROADCAST HERE
            // The first true broadcast will happen when the timer fires
        } else {
            // I AM A FOLLOWER
            console.log(
                "Follower: Leader found, waiting for renewal broadcasts."
            );
        }
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

import axios from "axios";
import router from "@/router";
import { useAuthStore } from "@/stores/auth";

// Create a reusable axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL + "/api", // Laravel API base
    headers: {
        "X-Requested-With": "XMLHttpRequest",
    },
});

// intercepts every outgoing request and grabs the freshest token available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

//global interceptor for handling expired/unauthorized tokens
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const auth = useAuthStore();

        // Ignore errors with no response
        if (!error.response) return Promise.reject(error);

        const status = error.response.status;
        const requestUrl = error.config?.url;

        // Do NOT trigger global 401 handler for the logout request.
        if (requestUrl === "/logout") {
            return Promise.reject(error);
        }

        //Handle Unauthenticated (Stale/Expired Session)
        if (error.response && error.response.status === 401) {
            auth.clearSession();
            router.push({
                name: "Login",
                query: { sessionExpired: "true" },
            });
            return Promise.reject(error);
        }

        //HANDLE PRIVILEGE CHANGES (Just-In-Time 403 Check)
        if (error.response && error.response.status === 403) {
            // Check if they are currently logged in before showing the countdown
            if (auth.isAuthenticated) {
                // Trigger a global UI event, custom ref, or notification framework banner
                auth.triggerSecurityCountdown(
                    "Security Notice: Your administrative access privileges have changed. Re-authenticating in 10 seconds...",
                );

                // Start the 10-second grace period completely on the client side
                setTimeout(() => {
                    auth.clearSession();
                    window.location.href = "/login";
                }, 10000); // 10 seconds

                // Block the default error handling so the user only sees your countdown banner
                return new Promise(() => {});
            }
        }

        //normal expiration of the cache token
        if (status === 401) {
            console.warn("Session expired or unauthorized access detected.");

            // Prevent repeating logout multiple times
            if (auth.token) {
                await auth.logout();
            }

            if (router.currentRoute.value.name !== "Login") {
                router.push({
                    name: "Login",
                    query: { sessionExpired: "true" },
                });
            }
        }

        return Promise.reject(error);
    },
);

export default api;

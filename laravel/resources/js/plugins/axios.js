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

        // Ignore errors with no server response (e.g., network down)
        if (!error.response) return Promise.reject(error);

        const status = error.response.status;
        const requestUrl = error.config?.url;

        // Do NOT trigger global error redirect behaviors for explicit logout attempts.
        if (requestUrl === "/logout") {
            return Promise.reject(error);
        }

        // HANDLE PRIVILEGE CHANGES (Just-In-Time 403 Check)
        if (status === 403) {
            if (auth.isAuthenticated) {
                auth.triggerSecurityCountdown(
                    "Security Notice: Your administrative access privileges have changed. Re-authenticating in 10 seconds...",
                );

                // Start the 10-second grace period completely on the client side
                setTimeout(() => {
                    auth.clearSession();
                    window.location.href = "/login";
                }, 10000);

                // Block the default UI error rendering
                return new Promise(() => {});
            }
        }

        //HANDLE UNAUTHENTICATED / EXPIRED SESSIONS (401 Check)
        if (status === 401) {
            console.warn("Session expired or unauthorized access detected.");

            // If a token exists locally, try to cleanly notify backend of termination
            if (auth.token) {
                try {
                    await auth.logout();
                } catch (logoutError) {
                    console.error(
                        "Silent background logout failed:",
                        logoutError,
                    );
                }
            }

            // Wipe local cache state if logout didn't fully catch it
            auth.clearSession();

            // Redirect to Login if they aren't already there
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

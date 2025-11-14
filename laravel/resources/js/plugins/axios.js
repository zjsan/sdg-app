import axios from "axios";
import router from "@/router";
import { useAuthStore } from "@/stores/auth";

// Create a reusable axios instance
const api = axios.create({
    baseURL: "http://localhost:8080/api", // Laravel API base
    headers: {
        "X-Requested-With": "XMLHttpRequest",
    },
});

// Automatically attach token if present
const token = localStorage.getItem("token");
if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

//Add global interceptor for handling expired/unauthorized tokens
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const auth = useAuthStore();

        // Ignore errors with no response
        if (!error.response) return Promise.reject(error);

        const status = error.response.status;
        const requestUrl = error.config?.url;

        // IMPORTANT:
        // Do NOT trigger global 401 handler for the logout request.
        if (requestUrl === "/logout") {
            return Promise.reject(error);
        }

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
    }
);

export default api;

import { defineStore } from "pinia";
import api from "@/plugins/axios";
import router from "@/router";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        user: JSON.parse(localStorage.getItem("user")) || null, // stores logged-in user object
        loading: false, // tracks async requests
        token: localStorage.getItem("token") || null, // persist token
        error: null, // for error handling
        initialized: false, // to track if restoreSession has been attempted
        securityWarningMessage: null,
        isSecurityRedirecting: false,
    }),

    /**
     * 
     * If auth.user is null → not authenticated.
       If auth.user has data → authenticated.
     */
    getters: {
        isAuthenticated: (state) => !!state.user,

        //checking user roles for role-based access control
        isDeveloper: (state) => {
            //console.log("Full User Object in Store:", state.user); //debugging log to check user data structure
            const slug = state.user?.role?.slug || null;
            console.log("Checking role:", slug);
            return slug.trim().toLowerCase() === "developer";
        },
        isAdmin: (state) => {
            const slug = state.user?.role?.slug || null;
            console.log("Checking role:", slug);
            return ["admin", "developer"].includes(slug?.trim().toLowerCase());
        },
    },

    actions: {
        // Save both token and user in localStorage
        saveUserToStorage() {
            if (this.user && this.token) {
                localStorage.setItem("user", JSON.stringify(this.user));
                localStorage.setItem("token", this.token);
            }
        },

        // Restore session if token exists
        async restoreSession() {
            //fetch token from localStorage in case of page refresh
            const storedToken = localStorage.getItem("token");
            if (!storedToken) {
                this.initialized = true; // Mark as initialized even if no token, to avoid repeated attempts
                return;
            }

            this.token = storedToken; //assign token to the state

            //console.log("Restore session triggered. Token found:", storedToken); //for debugging

            try {
                api.defaults.headers.common["Authorization"] =
                    `Bearer ${this.token}`;
                const { data } = await api.get("/user");
                this.user = data;
                this.saveUserToStorage();
                console.log("Session restored");
                //console.log("Restored user:", this.user);
                // console.log("Fetched user data:", data);
            } catch (error) {
                console.error("Session restore failed:", error);
                console.warn("Session restore failed:", error);
                this.logout(); // clear invalid session
            } finally {
                this.initialized = true; // Mark as initialized after attempt
            }
        },

        async getUser() {
            try {
                if (!this.token) {
                    console.warn("No token found — skipping getUser()");
                    this.initialized = true;
                    return;
                }
                api.defaults.headers.common["Authorization"] =
                    `Bearer ${this.token}`;
                const { data } = await api.get("/user");

                // console.log("Fetched user data:", data);
                this.user = data;
                this.saveUserToStorage();
                this.initialized = true;
            } catch (error) {
                this.initialized = false; // Reset initialization on failure
                console.error("Failed to fetch user:", error);
                this.logout(); // clear invalid session
            }
        },

        /**
         * Logout user.
         * Destroys Laravel session and clears Pinia state.
         */
        async logout() {
            try {
                const res = await api.post("/logout");

                if (res.data.status === "success") {
                    this.clearSession();
                    return { success: true, message: res.data.message };
                } else {
                    throw new Error(
                        res.data.message || "Logout failed backend validation",
                    );
                }
            } catch (error) {
                console.error("Logout failed:", error);
            } finally {
                this.clearSession();
            }
        },

        // Action to invoke the countdown state from the Interceptor
        triggerSecurityCountdown(message) {
            this.securityWarningMessage = message;
            this.isSecurityRedirecting = true;
        },

        clearSession() {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            delete api.defaults.headers.common["Authorization"];
            this.user = null;
            this.error = null;
            this.loading = false;
            this.token = null;

            // Reset security states on wipe
            this.securityWarningMessage = null;
            this.isSecurityRedirecting = false;
        },

        async loginWithGoogle() {
            try {
                this.loading = true;
                this.error = null;

                // Redirect the user to backend route
                const baseURL = import.meta.env.VITE_API_URL;
                window.location.href = `${baseURL}/auth/google/redirect`;
            } catch (error) {
                this.error = "Google login failed to start.";
            } finally {
                this.loading = false;
            }
        },

        handleGoogleCallback(token, user) {
            try {
                this.token = token;
                this.user = user;
                this.initialized = true;
                // Set token in axios for future requests
                api.defaults.headers.common["Authorization"] =
                    `Bearer ${this.token}`;

                this.saveUserToStorage();
                //Push to the intermediate page instead of the Dashboard
                //router.push({ name: "SafeRedirect" }); // adds history entry
            } catch (error) {
                this.error = "Failed to process Google login callback.";
                console.error(error);
            }
        },
    },
});

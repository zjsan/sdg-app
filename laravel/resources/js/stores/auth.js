import { defineStore } from "pinia";
import axios from "axios";
import api from "@/plugins/axios";
import router from "@/router";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        user: JSON.parse(localStorage.getItem("user")) || null, // stores logged-in user object
        loading: false, // tracks async requests
        token: localStorage.getItem("token") || null, // persist token
        error: null, // for error handling
        initalized: false, // to track if restoreSession has been attempted
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
            console.log("Checking role:", state.user?.role?.slug);
            return state.user?.role?.slug === "developer";
        },
        isAdmin: (state) =>
            ["admin", "developer"].includes(state.user?.role?.slug),
    },

    actions: {
        // Save both token and user in localStorage
        saveUserToStorage() {
            localStorage.setItem("user", JSON.stringify(this.user));
            localStorage.setItem("token", this.token);
        },

        // Restore session if token exists
        async restoreSession() {
            if (!this.token) return;

            try {
                api.defaults.headers.common["Authorization"] =
                    `Bearer ${this.token}`;
                const { data } = await api.get("/user");
                this.initalized = true; // Mark that we've attempted to fetch user
                this.user = data;
                this.saveUserToStorage();
                console.log("Session restored");
            } catch (error) {
                this.initalized = false; // Reset initialization on failure
                console.warn("Session restore failed:", error);
                this.logout(); // clear invalid session
            }
        },

        /**
         * Logout user.
         * Destroys Laravel session and clears Pinia state.
         */
        async logout() {
            try {
                await api.post("/logout");
            } catch (error) {
                console.error("Logout failed:", error);
            } finally {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                delete api.defaults.headers.common["Authorization"];
                this.user = null;
                this.error = null;
                this.loading = false;
                this.token = null;
                if (router.currentRoute.value.name !== "Login") {
                    router.push({ name: "Login" });
                }
            }
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

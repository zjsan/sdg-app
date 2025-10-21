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
    }),

    /**
     * 
     * If auth.user is null → not authenticated.
       If auth.user has data → authenticated.
     */
    getters: {
        isAuthenticated: (state) => !!state.user,
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
                api.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${this.token}`;
                const { data } = await api.get("/user");
                this.user = data;
                this.saveUserToStorage();
                console.log("Session restored");
            } catch (error) {
                console.warn("Session restore failed:", error);
                this.logout(); // clear invalid session
            }
        },
        /**
         * Login user with credentials.
         * On success, it fetches the user and redirects.
         */
        async login(credentials) {
            this.loading = true;
            this.error = null;

            try {
                // Step 1: Login and get token
                const { data } = await api.post("/login", credentials);

                // Step 2: store token
                this.token = data.token;

                // Step 3: set token for axios instance
                api.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${this.token}`;

                // Step 3: Get the user
                await this.getUser();
                this.saveUserToStorage(); //perssist user

                //redirect to /dashboard once authenticated
                //avoids manual refreshes or blank states after login.
                if (this.user) {
                    router.push({ name: "Dashboard" });
                }
            } catch (err) {
                this.error = err.response?.data?.message || "Login failed";
            } finally {
                this.loading = false;
            }
        },

        /**
         * Fetch the authenticated user.
         * Called after login or on app load (to restore session).
         */
        async getUser() {
            try {
                if (!this.token) {
                    console.warn("No token found — skipping getUser()");
                    return;
                }

                api.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${this.token}`;
                const { data } = await api.get("/user");
                this.user = data;
            } catch (error) {
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
    },
});

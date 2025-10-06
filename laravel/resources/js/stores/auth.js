import { defineStore } from "pinia";
import axios from "axios";
import api from "@/plugins/axios";
import router from "@/router";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        user: null, // stores logged-in user object
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
                localStorage.setItem("token", data.token);

                // Step 3: set token for axios instance
                api.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${data.token}`;

                // Step 3: Get the user
                await this.getUser();

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
                if (this.token) {
                    api.defaults.headers.common[
                        "Authorization"
                    ] = `Bearer ${this.token}`;
                }

                const { data } = await api.get("/user");
                this.user = data;
            } catch (error) {
                console.error("Failed to fetch user:", error);
                this.user = null; // not logged in
                this.token = null;
                localStorage.removeItem("token");
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

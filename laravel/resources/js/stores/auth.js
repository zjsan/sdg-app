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
                const { data } = await api.post("/api/login", credentials);

                // Step 2: store token
                this.token = data.token;
                localStorage.setItem("token", data.token);

                // Step 3: set token for axios instance
                api.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${data.token}`;

                // Step 3: Get the user
                await this.getUser();
                //removed rdirect to dashboard if logged in
                // will be handled in router index.js
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
                const { data } = await api.get("/api/user", {
                    withCredentials: true,
                });
                this.user = data;
            } catch {
                this.user = null; // not logged in
            }
        },

        /**
         * Logout user.
         * Destroys Laravel session and clears Pinia state.
         */
        async logout() {
            try {
                await api.post("/api/logout", {}, { withCredentials: true });
            } finally {
                this.user = null;
                this.error = null;
                this.loading = false;
                router.push({ name: "Login" });
            }
        },
    },
});

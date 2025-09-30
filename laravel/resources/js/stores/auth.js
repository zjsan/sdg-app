import { defineStore } from "pinia";
import axios from "axios";
import router from "@/router";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        user: null, // stores logged-in user object
        loading: false, // tracks async requests
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
         * Fetch CSRF cookie (required before login).
         * Laravel sets `XSRF-TOKEN` and session cookie here.
         */
        async getCsrfCookie() {
            try {
                await axios.get("/sanctum/csrf-cookie", {
                    withCredentials: true,
                });
                console.log("CSRF cookie set");
            } catch (error) {
                console.error("Error initializing CSRF cookie:", error);
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
                // Step 1: Ensure CSRF cookie is set
                await this.getCsrfCookie();

                // Step 2: Login attempt
                await axios.post("/login", credentials, {
                    withCredentials: true,
                });

                // Step 3: Get the user
                await this.getUser();

                // Redirect to dashboard
                if (this.user && this.isAuthenticated) {
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
                const { data } = await axios.get("/api/user", {
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
                await axios.post("/logout", {}, { withCredentials: true });
            } finally {
                this.user = null;
                this.error = null;
                this.loading = false;
                router.push({ name: "Login" });
            }
        },
    },
});

import { defineStore } from "pinia";
import api from "@/plugins/axios";

export const useLookupStore = defineStore("lookups", {
    state: () => ({
        organizations: [],
        roles: [],
        loading: false,
        hasLoaded: false, // Prevents over-fetching data if already loaded
    }),
    actions: {
        async fetchFormDependencies() {
            // Performance optimization: Only fetch if we haven't loaded them yet
            if (this.hasLoaded) return;

            this.loading = true;
            try {
                const res = await api.get("/lookups/form-dependencies");

                this.organizations = res.data.organizations || [];
                this.roles = res.data.roles || [];
                this.hasLoaded = true;
            } catch (error) {
                console.error(
                    "Failed to load relational form dependencies:",
                    error,
                );
                this.organizations = [];
                this.roles = [];
            } finally {
                this.loading = false;
            }
        },

        // Helper to reset cache if an admin creates a new organization on another page
        clearLookupCache() {
            this.hasLoaded = false;
        },
    },
});

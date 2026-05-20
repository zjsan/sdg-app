import { defineStore } from "pinia";
import api from "@/plugins/axios";

export const useAllowedEmailsStore = defineStore("allowedEmails", {
    state: () => ({
        emails: [],
        loading: false,
        errors: null,
    }),
    actions: {
        async fetchAllowedEmails() {
            this.loading = true;

            try {
                const res = await api.get("/allowed-emails");

                this.organizations = Array.isArray(res.data)
                    ? res.data
                    : res.data.data;
            } catch (error) {
                this.errors =
                    error.response?.data?.message ||
                    "Failed to load allowed emails.";
                console.error("Failed to fetch allowed emails:", error);
            } finally {
                this.loading = false;
            }
        },

        async addAllowedEmails(email) {
            this.loading = true;
            try {
                const response = await api.post("/allowed-emails", {
                    email,
                });
                this.emails.unshift(response.data); //update the local state with the new allowed email
                return response.message || "Allowed email added successfully.";
            } catch (error) {
                this.errors =
                    error.response?.data?.message ||
                    "Failed to add allowed email.";
                console.error("Failed to add allowed email:", error);
            } finally {
                this.loading = false;
            }
        },
    },
});

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
                const res = await api.post("/allowed-emails", {
                    email,
                });
                this.emails.unshift(res.data); //update the local state with the new allowed email
                return res.message || "Allowed email added successfully.";
            } catch (error) {
                this.errors =
                    error.response?.data?.message ||
                    "Failed to add allowed email.";
                console.error("Failed to add allowed email:", error);
            } finally {
                this.loading = false;
            }
        },

        async updateAllowedEmails(id, newEmail) {
            this.loading = true;

            try {
                const res = await api.put(`/allowed-emails/${id}`, newEmail);

                const index = this.emails.findIndex((email) => email.id === id);
                if (index !== -1) {
                    this.emails[index] = res.data; // Update the local state with the updated email
                }

                return res.message || "Allowed email updated successfully.";
            } catch (error) {
                this.errors =
                    error.response?.data?.message ||
                    "Failed to update allowed email.";
                console.error("Failed to update allowed email:", error);
            } finally {
                this.loading = false;
            }
        },
    },
});

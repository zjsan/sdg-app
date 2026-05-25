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

                this.emails = Array.isArray(res.data)
                    ? res.data
                    : res.data.data;
                console.log("Allowed Emails fetched:", this.emails); // Debugging log to check the fetched data
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
                console.log(res.message || "Allowed email added successfully.");
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

                console.log(
                    res.message || "Allowed email updated successfully.",
                );
            } catch (error) {
                this.errors =
                    error.response?.data?.message ||
                    "Failed to update allowed email.";
                console.error("Failed to update allowed email:", error);
            } finally {
                this.loading = false;
            }
        },

        async deleteAllowedEmails(id) {
            this.loading = true;

            if (!confirm("Are you sure?")) {
                return;
            }

            try {
                await api.delete(`/allowed-emails/${id}`);

                this.emails = this.emails.filter((email) => email.id !== id); // Update local state by removing the deleted email
                console.log(
                    res.message || "Allowed email deleted successfully.",
                );
            } catch (error) {
                this.errors =
                    error.response?.data?.message ||
                    "Failed to delete allowed email.";
                console.error("Failed to delete allowed email:", error);
            } finally {
                this.loading = false;
            }
        },
    },
});

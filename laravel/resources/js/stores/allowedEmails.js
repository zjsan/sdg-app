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
            this.errors = null;

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

        //send data object containing { email, organization_id, role_id, is_active }
        async addAllowedEmails(payload) {
            this.loading = true;
            this.errors = null;
            try {
                const res = await api.post("/allowed-emails", {
                    ...payload,
                });

                if (res.data && res.data.allowedEmail) {
                    this.emails.push(res.data.allowedEmail);
                } //update the local state with the new allowed email

                return res.data;
            } catch (error) {
                this.errors =
                    error.response?.data?.message ||
                    "Failed to add allowed email.";
                throw error; // Rethrow the error to be handled by the caller
            } finally {
                this.loading = false;
            }
        },

        async updateAllowedEmails(id, payload) {
            this.loading = true;
            this.errors = null;

            try {
                const res = await api.put(`/allowed-emails/${id}`, payload);

                const updatedRecord = res.data?.allowedEmail;
                if (updatedRecord) {
                    const index = this.emails.findIndex(
                        (item) => item.id === id,
                    );
                    if (index !== -1) {
                        this.emails[index] = updatedRecord;
                    }
                }

                return res.data;
            } catch (error) {
                this.errors =
                    error.response?.data?.message ||
                    "Failed to update allowed email.";
                console.error("Failed to update allowed email:", error);
            } finally {
                this.loading = false;
            }
        },

        //new UI Action tracking for the toggle status endpoint
        async toggleEmailStatus(id) {
            try {
                const res = await api.patch(`/allowed-emails/${id}/toggle`);
                const updatedRecord = res.data?.allowedEmail;
                if (updatedRecord) {
                    const index = this.emails.findIndex(
                        (item) => item.id === id,
                    );
                    if (index !== -1) {
                        this.emails[index] = updatedRecord;
                    }
                }
            } catch (error) {
                console.error("Failed to toggle status:", error);
            }
        },

        async deleteAllowedEmails(id) {
            this.loading = true;
            this.error = null;

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

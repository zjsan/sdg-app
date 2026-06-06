import { defineStore } from "pinia";
import api from "@/plugins/axios";
import { ref } from "vue";

export const useAllowedEmailsStore = defineStore("allowedEmails", {
    state: () => ({
        emails: [],
        currentPage: ref(1),
        itemsPerPage: ref(15),
        lastPage: ref(1), //for disabling next button when on the last page
        loading: false,
        errors: null,
    }),
    actions: {
        async fetchAllowedEmails(page = 1, perPage = 15) {
            this.loading = true;
            this.errors = null;

            try {
                const res = await axios.get("/api/allowed-emails", {
                    params: {
                        page: page,
                        per_page: perPage,
                    },
                });

                this.emails = Array.isArray(res.data)
                    ? res.data
                    : res.data.data;
            } catch (error) {
                const errMsg =
                    error.response?.data?.message ||
                    "Failed to load allowed emails.";
                this.errors = errMsg;
                throw errMsg;
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

                return res.data; // return raw data containing backend message
            } catch (error) {
                const errMsg =
                    error.response?.data?.message ||
                    "Failed to add allowed email.";
                this.errors = errMsg;
                throw error; // throwing the actual errror message from the backend to be handled in the component
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
                const errMsg =
                    error.response?.data?.message ||
                    "Failed to update allowed email.";
                this.errors = errMsg;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async deleteAllowedEmails(id) {
            this.loading = true;
            this.errors = null;

            try {
                const res = await api.delete(`/allowed-emails/${id}`);

                this.emails = this.emails.filter((email) => email.id !== id); // Update local state by removing the deleted email
                return res.data;
            } catch (error) {
                const errMsg =
                    error.response?.data?.message ||
                    "Failed to delete allowed email.";
                this.errors = errMsg;
                throw error;
            } finally {
                this.loading = false;
            }
        },
    },
});

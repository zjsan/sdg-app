import { defineStore } from "pinia";
import api from "@/plugins/axios";

export const useAllowedEmailsStore = defineStore("allowedEmails", {
    state: () => ({
        emails: [],
        currentPage: 1,
        itemsPerPage: 15,
        lastPage: 1, //for disabling next button when on the last page
        totalItems: 0,
        loading: false,
        errors: null,
        currentAbortController: null, // to manage request cancellation
    }),
    actions: {
        async fetchAllowedEmails(page = 1, perPage = 15, search = "") {
            this.loading = true;
            this.errors = null;

            //if there's an ongoing request, abort it before starting a new one
            if (this.currentAbortController) {
                this.currentAbortController.abort();
            }

            //create a new AbortController for the current request
            this.currentAbortController = new AbortController();

            try {
                const res = await api.get("/allowed-emails", {
                    params: {
                        page: page,
                        per_page: perPage,
                        search: search, // Optional search query parameter
                    },
                    signal: this.currentAbortController.signal, // attach the abort signal to the request
                });

                const payload = res.data; //extract response data from the controller
                console.log("API Response:", payload); // Debugging log

                // Update pagination state based on the response meta data
                this.emails = payload.data || [];
                this.currentPage = payload.meta?.current_page || 1;
                this.totalItems = payload.meta?.total || 0;
                this.itemsPerPage = payload.meta?.per_page || perPage;
                this.lastPage = payload.meta?.last_page || 1;
            } catch (error) {
                const errMsg =
                    error.response?.data?.message ||
                    "Failed to load allowed emails.";
                this.errors = errMsg;
                throw error;
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

import { defineStore } from "pinia";
import api from "@/plugins/axios";

export const useOrganizationStore = defineStore("organization", {
    // other options...
    state: () => ({
        organizations: [],
        currentPage: 1,
        itemsPerPage: 10,
        lastPage: 1, //for disabling next button when on the last page
        totalItems: 0,
        loading: false,
        errors: null,
        currentAbortController: null, // to manage request cancellation
    }),
    actions: {
        async fetchOrganizations(page = 1, perPage = 10, search = "") {
            this.errors = null;
            this.loading = true;

            if (this.currentAbortController) {
                this.currentAbortController.abort();
            }

            //intializing a new abort controller for new request and assigning it to the store's state to track it
            const controller = new AbortController();
            this.currentAbortController = controller;

            try {
                const response = await api.get("/organizations", {
                    params: {
                        page,
                        per_page: perPage,
                        search,
                    },
                    signal: controller.signal, //track the local reference of the abort controller for this specific request
                });

                const payload = response.data; //extract response data from the controller
                console.log("API Response:", payload); // Debugging log

                //update only the states if the request are not aborted
                if (!controller.signal.aborted) {
                    // If backend returns a Resource, it might be response.data.data
                    this.organizations = payload.data || [];

                    // Update pagination info
                    this.currentPage = page;
                    this.itemsPerPage = perPage;
                    this.lastPage = response.data.last_page || 1;
                    this.totalItems = response.data.total || 0;

                    //clean up the abort controller reference since the request has completed
                    if (this.currentAbortController === controller) {
                        this.currentAbortController = null;
                    }
                }
            } catch (error) {
                //handle request cancellation separately to avoid showing error messages for aborted requests
                if (
                    error.name === "AbortError" ||
                    error.name === "CanceledError" ||
                    api.isCancel(error)
                ) {
                    console.log("Request safely aborted.");
                    return; // Graceful exit
                }
                //handle backend/network errors
                const errMsg =
                    error.response?.data?.message ||
                    "Failed to load allowed emails.";
                this.errors = errMsg;
                throw error;
            } finally {
                //only set loading to false if the current request is the one that just finished
                if (
                    this.currentAbortController === controller ||
                    this.currentAbortController === null
                ) {
                    this.loading = false;
                }
            }
        },

        async createOrganization(name, pbi_embed_id) {
            this.loading = true;
            try {
                const response = await api.post("/organizations", {
                    name,
                    pbi_embed_id,
                });
                this.organizations.push(response.data); //update the local state with the new organization
                return response.message || "Organization created successfully.";
            } catch (error) {
                this.errors =
                    error.response?.data?.message ||
                    "Failed to create organization.";
                console.error("Failed to create organization:", error);
            } finally {
                this.loading = false;
            }
        },

        async UpdateOrganizations(id, newId) {
            this.loading = true;
            try {
                const response = await api.put(`/organizations/${id}`, {
                    pbi_embed_id: newId,
                });
                console.log(
                    response.message,
                    `Organization ${id} updated with new PBI Embed ID: ${newId}`,
                );
            } catch (error) {
                this.errors =
                    error.response?.data?.message ||
                    `Failed to update organization ${id}.`;
                console.error(error);
            } finally {
                this.loading = false;
            }
        },

        async deleteOrganization(id) {
            this.loading = true;

            if (!confirm("Are you sure?")) {
                return;
            }
            try {
                const response = await api.delete(`/organizations/${id}`);

                //remove user from local state
                this.organizations = this.organizations.filter(
                    (organization) => organization.id !== id,
                );
                console.log(
                    response.message ||
                        `Organization ${id} deleted successfully.`,
                );
            } catch (error) {
                this.errors =
                    error.response?.data?.message ||
                    `Failed to delete organization ${id}.`;
                console.error(error);
            } finally {
                this.loading = false;
            }
        },
    },
});

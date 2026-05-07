import { defineStore } from "pinia";
import api from "@/plugins/axios";

export const useOrganizationStore = defineStore("organization", {
    // other options...
    state: () => ({
        organizations: [],
        loading: false,
        errors: null,
    }),
    actions: {
        async fetchOrganizations() {
            this.loading = true;
            try {
                const response = await api.get("/organizations");
                // Debugging: Check console to see what the server actually sent
                console.log("Backend Response:", response.data);

                // If backend returns a Resource, it might be response.data.data
                this.organizations = Array.isArray(response.data)
                    ? response.data
                    : response.data.data;
            } catch (error) {
                this.errors =
                    error.response?.data?.message ||
                    "Failed to load organizations.";
                console.error("Failed to fetch organizations:", error);
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

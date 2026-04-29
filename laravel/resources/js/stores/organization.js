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
                organizations.value = Array.isArray(response.data)
                    ? response.data
                    : response.data.data;
            } catch (error) {
                this.errors =
                    error.response?.data?.message ||
                    "Failed to load organizations.";
                console.error("Failed to fetch organizations:", error);
            }
        },

        async UpdateOrganizations(id, newId) {
            try {
                await api.put(`/api/organizations/${id}`, {
                    pbi_embed_id: newId,
                });
                fetchOrgs(); // Refresh list
                await pbiStore.forceRefresh();
                alert("PBI Embed ID updated successfully!");
            } catch (error) {
                console.error(error);
                alert("Update failed.");
            }
        },
    },
});

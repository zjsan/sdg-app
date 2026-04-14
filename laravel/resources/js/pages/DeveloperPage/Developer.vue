<template>
    <Authenticated>
        <div class="p-8">
            <h1 class="text-2xl font-bold">Power Bi Link Management</h1>
            <div class="overflow-x-auto bg-white rounded-lg shadow">
                <table class="min-w-full table-auto">
                    <thead class="bg-gray-50">
                        <tr>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                            >
                                Organization
                            </th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                            >
                                Power BI Public Link
                            </th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                            >
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        <tr v-for="org in organizations" :key="org.id">
                            <td class="px-6 py-4 font-medium">
                                {{ org.name }}
                            </td>
                            <td class="px-6 py-4">
                                <input
                                    v-model="org.pbi_embed_link"
                                    class="w-full border rounded px-2 py-1 text-sm focus:ring-blue-500"
                                />
                            </td>
                            <td class="px-6 py-4">
                                <button
                                    @click="saveOrg(org)"
                                    class="bg-indigo-600 text-white px-4 py-1 rounded text-sm hover:bg-indigo-700"
                                >
                                    Update
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </Authenticated>
</template>
<script setup>
import Authenticated from "../Dashboard Template/Layout/Authenticated.vue";
import api from "../../plugins/axios.js";
import { ref, onMounted } from "vue";
import { usePowerBiStore } from "../../stores/powerBi.js";

const organizations = ref([]);
const pbiStore = usePowerBiStore();

const fetchOrgs = async () => {
    const { data } = await api.get("/api/organizations");
    organizations.value = data;
};

const testLink = (id) => {
    // POWER_BI_BASE_URL should ideally be an injected config or env variable
    const baseUrl = "https://app.powerbi.com/view?r=";
    window.open(`${baseUrl}${id}`, "_blank");
};

const saveOrg = async (id, newId) => {
    try {
        await api.put(`/api/organizations/${id}`, { pbi_embed_id: newId });
        fetchOrgs(); // Refresh list
        await pbiStore.forceRefresh();
        alert("PBI Embed ID updated successfully!");
    } catch (error) {
        console.error(error);
        alert("Update failed.");
    }
};

onMounted(fetchOrgs);
</script>

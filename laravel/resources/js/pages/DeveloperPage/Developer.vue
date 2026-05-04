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
                                Power BI Link
                            </th>
                            <th
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                            >
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        <tr
                            v-for="org in organizationStore.organizations"
                            :key="org.id"
                        >
                            <td class="px-6 py-4 font-medium">
                                {{ org.name }}
                            </td>
                            <td class="px-6 py-4">
                                {{ org.pbi_embed_id || "No link set" }}
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
import { ref, onMounted } from "vue";
import { usePowerBiStore } from "../../stores/powerBi.js";
import { useOrganizationStore } from "../../stores/organization.js";

const pbiStore = usePowerBiStore();
const organizationStore = useOrganizationStore();

const testLink = (id) => {
    // POWER_BI_BASE_URL should ideally be an injected config or env variable
    const baseUrl = "https://app.powerbi.com/view?r=";
    window.open(`${baseUrl}${id}`, "_blank");
};

const saveOrg = async () => {
    try {
        await organizationStore.UpdateOrganizations(id, newId); //update action
        await organizationStore.fetchOrganizations(); // Refresh list for the table

        await pbiStore.forceRefresh(); //force power bi link refresh
        alert("PBI Embed ID updated successfully!");
    } catch (error) {
        console.error(error);
        alert("Update failed.");
    }
};

onMounted(() => {
    organizationStore.fetchOrganizations();
});
</script>

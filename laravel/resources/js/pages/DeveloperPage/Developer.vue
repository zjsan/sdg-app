<template>
    <Authenticated>
        <div class="p-8 max-w-6xl mx-auto">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-2xl font-bold text-slate-800">
                    Power BI Link Management
                </h1>
                <span class="text-sm text-slate-500"
                    >{{
                        organizationStore.organizations.length
                    }}
                    Organizations</span
                >
            </div>

            <div
                class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
            >
                <table class="min-w-full divide-y divide-slate-200">
                    <thead class="bg-slate-50">
                        <tr>
                            <th
                                class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                            >
                                Organization
                            </th>
                            <th
                                class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                            >
                                Embed Configuration
                            </th>
                            <th
                                class="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider"
                            >
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-200">
                        <tr
                            v-for="org in organizationStore.organizations"
                            :key="org.id"
                            class="hover:bg-slate-50 transition-colors"
                        >
                            <td class="px-6 py-4">
                                <div class="font-semibold text-slate-900">
                                    {{ org.name }}
                                </div>
                                <div class="text-xs text-slate-400">
                                    ID: {{ org.id }}
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <div
                                    v-if="org.pbi_embed_id"
                                    class="flex items-center space-x-2"
                                >
                                    <span
                                        class="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-mono"
                                    >
                                        {{
                                            org.pbi_embed_id.substring(0, 15)
                                        }}...{{ org.pbi_embed_id.slice(-4) }}
                                    </span>
                                    <!-- A small "copy" button here would be a huge UX win -->
                                    <button
                                        @click="
                                            copyToClipboard(org.pbi_embed_id)
                                        "
                                        class="text-xs text-blue-600 hover:text-indigo-800 cursor-pointer transition-colors"
                                    >
                                        Copy
                                    </button>
                                </div>
                                <span
                                    v-else
                                    class="text-sm text-slate-400 italic"
                                    >No link configured</span
                                >
                            </td>
                            <td class="px-6 py-4 text-right">
                                <button
                                    @click="openEditModal(org)"
                                    class="inline-flex items-center px-3 py-1.5 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                                >
                                    Edit Link
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

const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        alert("Embed ID copied to clipboard!");
    } catch (err) {
        console.error("Failed to copy: ", err);
        alert("Failed to copy to clipboard.");
    }
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

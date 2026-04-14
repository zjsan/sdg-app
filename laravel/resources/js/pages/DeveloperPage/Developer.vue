<template>
    <Authenticated>
        <div class="p-8">
            <h1 class="text-2xl font-bold">Power Bi Link Management</h1>
            <div
                v-for="org in organizations"
                :key="org.id"
                class="border p-4 mb-4 rounded shadow-sm bg-white"
            >
                <div class="flex justify-between items-center">
                    <div>
                        <h2 class="text-xl font-bold">{{ org.name }}</h2>
                        <p class="text-gray-500 font-mono text-xs">
                            ID: {{ org.pbi_embed_id }}
                        </p>
                    </div>

                    <div class="space-x-2">
                        <button
                            @click="testLink(org.pbi_embed_id)"
                            class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm transition"
                        >
                            Test Link
                        </button>

                        <button
                            @click="saveOrg(org)"
                            class="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition"
                        >
                            Update Link
                        </button>
                    </div>
                </div>
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

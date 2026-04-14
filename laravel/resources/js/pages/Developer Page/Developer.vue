<template>
    <Authenticated>
        <div class="p-8">
            <h1 class="text-2xl font-bold">Power Bi Link Management</h1>

            <table class="min-w-full mt-4 bg-white border">
                <thead>
                    <tr>
                        <th class="border px-4 py-2">Organization</th>
                        <th class="border px-4 py-2">Current Embed ID</th>
                        <th class="border px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="org in organizations" :key="org.id">
                        <td class="border px-4 py-2">{{ org.name }}</td>
                        <td class="border px-4 py-2 font-mono text-sm">
                            {{ org.pbi_embed_id.substring(0, 20) }}...
                        </td>
                        <td class="border px-4 py-2">
                            <button
                                @click="saveOrg(org.id, org.pbi_embed_id)"
                                class="bg-blue-500 text-white px-3 py-1 rounded"
                            >
                                Edit PBI Link
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </Authenticated>
</template>
<script setup>
import Authenticated from "../Dashboard Template/Layout/Authenticated.vue";
import api from "@/plugins/axios";
import { ref, onMounted } from "vue";

const organizations = ref([]);

const fetchOrgs = async () => {
    const { data } = await api.get("/api/organizations");
    organizations.value = data;
};

const saveOrg = async (id, newId) => {
    try {
        await api.put(`/api/organizations/${id}`, { pbi_embed_id: newId });
        fetchOrgs(); // Refresh list
        alert("PBI Embed ID updated successfully!");
    } catch (error) {
        console.error(error);
        alert("Update failed.");
    }
};

onMounted(fetchOrgs);
</script>

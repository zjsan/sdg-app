<template>
    <Authenticated>
        <div class="p-8">
            <h1 class="text-2xl font-bold">Organization Management</h1>

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
                                @click="editOrg(org)"
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
import { useAuthStore } from "@/stores/auth";
import Authenticated from "../Dashboard Template/Layout/Authenticated.vue";

const auth = useAuthStore();

const logout = async () => {
    await auth.logout();
};
</script>

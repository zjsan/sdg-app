<template>
    <router-view />
</template>

<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRoute } from "vue-router";

const auth = useAuthStore();

onMounted(async () => {
    try {
        // Try restoring user session on app load
        await auth.restoreSession();
        auth.initialized = true; // Mark auth as initialized after attempting to restore session
    } catch (error) {
        console.error("Failed to restore session:", error);
        auth.initialized = false; // Mark auth as initialized even if session restoration fails
    }
});
</script>

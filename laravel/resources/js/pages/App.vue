<template>
    <router-view />
</template>

<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRoute } from "vue-router";

const auth = useAuthStore();

onMounted(async () => {
    if (!auth.initialized) {
        await auth.restoreSession();
    }
});
</script>

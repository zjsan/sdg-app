<template>
    <router-view />
</template>

<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRoute } from "vue-router";

const auth = useAuthStore();

onMounted(() => {
    // Try restoring user session on app load
    auth.restoreSession();
});
</script>

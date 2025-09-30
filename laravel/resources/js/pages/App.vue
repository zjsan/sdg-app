<template>
    <router-view />
</template>

<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();

onMounted(() => {
    // Try to restore session
    auth.getUser();
});
</script>

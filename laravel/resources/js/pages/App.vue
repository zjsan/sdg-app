<template>
    <router-view />
</template>

<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRoute } from "vue-router";

const auth = useAuthStore();
const route = useRoute();

onMounted(() => {
    // Only fetch user if a token exists AND the route requires authentication
    if (auth.token && route.meta.requiresAuth) {
        auth.getUser();
    }
});
</script>

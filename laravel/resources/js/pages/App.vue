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
        await auth.restoreSession();
    } finally {
        //trigger the initialized flag on app load
        auth.initialized = true;
    }
});
</script>

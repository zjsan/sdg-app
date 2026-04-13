<template>
    <h1>Developer Page</h1>
    <button @click="logout">Logout</button>
</template>
<script setup>
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();

const logout = async () => {
    await auth.logout();
};
</script>

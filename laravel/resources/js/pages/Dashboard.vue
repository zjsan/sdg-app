<template>
    <h1>Dashboard</h1>
    <p>Welcome to the dashboard!</p>

    <nav>
        <Button
            v-if="auth.isAuthenticated"
            @click="logout"
            type="submit"
            class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
        >
            Logout
        </Button>
        <router-link v-else to="/login">Login</router-link>
    </nav>
</template>
<script setup>
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth";
const auth = useAuthStore();

const logout = async () => {
    await auth.logout();
};
</script>

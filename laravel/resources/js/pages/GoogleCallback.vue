<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-50">
        <p class="text-gray-600 text-lg">Signing you in with Google...</p>
    </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

onMounted(async () => {
    try {
        const token = route.query.token;
        const userJson = route.query.user;

        if (!token || !userJson) {
            throw new Error("Missing authentication data");
        }

        const user = JSON.parse(decodeURIComponent(userJson));

        auth.token = token;
        auth.user = user;
        auth.saveUserToStorage();

        router.push({ name: "Dashboard" });
    } catch (error) {
        console.error("Google login failed:", error);
        router.push({ name: "Login", query: { error: "google_auth_failed" } });
    }
});
</script>

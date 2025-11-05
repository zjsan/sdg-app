<template>
    <div
        class="flex flex-col items-center justify-center min-h-screen text-gray-700"
    >
        <p v-if="loading">Signing you in securely with Google...</p>
        <p v-else-if="error" class="text-red-500">{{ error }}</p>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
    const sessionId = route.query.session_id;

    if (!sessionId) {
        error.value = "Missing session ID.";
        loading.value = false;
        return;
    }

    try {
        const { data } = await axios.get(
            `${import.meta.env.VITE_API_URL}/auth/session/${sessionId}`
        );

        auth.token = data.token;
        auth.user = data.user;
        auth.saveUserToStorage();
        await auth.getUser();

        router.push({ name: "Dashboard" });
    } catch (err) {
        error.value =
            err.response?.data?.error || "Session expired or invalid.";
    } finally {
        loading.value = false;
    }
});
</script>

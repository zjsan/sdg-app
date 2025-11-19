<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
        <div class="text-center space-y-4">
            <h2 class="text-xl font-semibold text-gray-700">
                Signing you in with Google...
            </h2>
            <p class="text-gray-500">
                Please wait while we complete your authentication.
            </p>

            <!-- Error message display -->
            <p v-if="auth.error" class="text-red-500 font-medium">
                {{ auth.error }}
            </p>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import api from "@/plugins/axios";

const auth = useAuthStore();
const route = useRoute();
const router = useRouter();

onMounted(async () => {
    //  Capture the session ID (the value is preserved here)
    const sessionId = route.query.session_id;

    // If the user is authenticated (e.g., iframe fallback), exit safely.
    if (auth.isAuthenticated) {
        router.replace({ name: "Dashboard" });
        return;
    }

    // MUST have a sessionId to proceed.
    if (!sessionId) {
        auth.error = "Missing session identifier. Please try logging in again.";
        return;
    }

    // api call - Proceed with the captured sessionId
    try {
        // Fetch token + user from backend
        const { data } = await api.get(`/auth/session/${sessionId}`);

        if (data?.token && data?.user) {
            // Pass data to the Pinia store handler
            auth.handleGoogleCallback(data.token, data.user);
            router.push({ name: "SafeRedirect" });

            return;
        } else {
            auth.error = "Invalid response from authentication server.";
        }
    } catch (error) {
        console.error("Google callback error:", error);

        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (status === 403) {
            router.push({ name: "NotAuthorized" });
            return;
        }

        if (status === 500) {
            router.push({ name: "AuthError" });
            return;
        }

        auth.error = message || "Failed to complete Google authentication.";
    }
});
</script>

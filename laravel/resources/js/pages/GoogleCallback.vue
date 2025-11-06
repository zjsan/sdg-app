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
    // Get the temporary "session_id" or "code" from the URL
    const sessionId = route.query.session_id;

    if (!sessionId) {
        auth.error = "Missing session identifier. Please try logging in again.";
        return;
    }

    try {
        // Fetch token + user from backend
        const { data } = await api.get(`/auth/session/${sessionId}`);

        if (data?.token && data?.user) {
            // Pass data to the Pinia store handler
            auth.handleGoogleCallback(data.token, data.user);
        } else {
            auth.error = "Invalid response from authentication server.";
        }
    } catch (error) {
        console.error("Google callback error:", error);

        //get header responsestatus and message
        const status = error.response?.status;
        const message = error.response?.data?.message;

        // If backend says 403 = Not Whitelisted
        // redirect to not authorized page
        if (status === 403) {
            router.push({ name: "NotAuthorized" });
            return;
        }

        // Otherwise, generic failure
        auth.error = message || "Failed to complete Google authentication.";
    }
});
</script>

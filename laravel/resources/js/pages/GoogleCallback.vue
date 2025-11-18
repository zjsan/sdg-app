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
    // 1. CRITICAL: Capture the session ID (the value is preserved here)
    const sessionId = route.query.session_id;

    // 2. IMMEDIATE HISTORY CLEANUP: Clean the history ONLY if a session ID was present
    if (sessionId) {
        // This replaces the URL in the browser history, removing the session_id
        // The component keeps executing this thread with the *captured* sessionId value.
        router.replace({ path: route.path });
    }

    // 3. SAFETY CHECK: If the user is authenticated (e.g., iframe fallback), exit safely.
    if (auth.isAuthenticated) {
        router.replace({ name: "Dashboard" });
        return;
    }

    // 4. AUTHENTICATION CHECK: If we are here, we MUST have a sessionId to proceed.
    if (!sessionId) {
        auth.error = "Missing session identifier. Please try logging in again.";
        return;
    }

    //clearing browser state to make the dashboard as the first entry point
    window.history.replaceState(null, "", "/dashboard"); // Replaces current entry
    window.history.pushState(null, "", "/dashboard"); // Adds another entry, essentially clearing back history

    // 5. API CALL: Proceed with the captured sessionId
    try {
        // Fetch token + user from backend
        const { data } = await api.get(`/auth/session/${sessionId}`);

        if (data?.token && data?.user) {
            // Pass data to the Pinia store handler
            auth.handleGoogleCallback(data.token, data.user);
            // NOTE: auth.handleGoogleCallback should use router.replace({name: 'Dashboard'})
        } else {
            auth.error = "Invalid response from authentication server.";
        }
    } catch (error) {
        // ... (Your existing robust error handling is good) ...
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

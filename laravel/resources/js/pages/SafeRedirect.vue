<template>
    <div class="min-h-screen flex items-center justify-center">
        Redirecting to Dashboard...
    </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const auth = useAuthStore();

onMounted(() => {
    // runs after the callback component completes its job.
    // It's the final, clean redirect.
    // ensure the user is logged in before redirecting
    if (auth.isAuthenticated) {
        //This replaces the /safe-redirect entry with the clean /dashboard entry.
        router.replace({ name: "Dashboard" });
    }
});
</script>

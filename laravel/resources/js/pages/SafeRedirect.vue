<template>
    <div class="min-h-screen flex items-center justify-center">
        Redirecting to Dashboard...
    </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(() => {
    // runs after the callback component completes its job.
    // It's the final, clean redirect.
    router.replace({ name: "Dashboard" });
});
</script>

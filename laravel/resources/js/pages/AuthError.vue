<template>
    <div
        class="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center space-y-6"
    >
        <h1 class="text-2xl font-bold text-red-600">Authentication Error</h1>
        <p class="text-gray-600 max-w-md">
            Something went wrong while signing you in with Google. Please try
            again later or contact support if the issue persists.
        </p>

        <button
            @click="goBack"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
        >
            Back to Login
        </button>
    </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

const goBack = () => {
    router.push({ name: "Login" });
};
</script>

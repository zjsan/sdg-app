<template>
    <div
        class="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4"
    >
        <div class="bg-white p-8 rounded-2xl shadow-md max-w-md w-full">
            <h1 class="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p class="text-gray-700 mb-6">
                Your Google account is not authorized to access this
                application!
            </p>
            <button
                @click="goToLogin"
                class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition cursor-pointer"
            >
                Back to Login
            </button>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

function goToLogin() {
    router.push({ name: "Login" });
}
</script>

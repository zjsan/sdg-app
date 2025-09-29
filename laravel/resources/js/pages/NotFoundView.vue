<template>
    <div
        class="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center"
    >
        <h1 class="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p class="text-lg text-gray-600 mb-6">
            Oops! The page you’re looking for doesn’t exist.
        </p>
        <router-link
            to="/login"
            class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
        >
            Go back to Login
        </router-link>
    </div>
</template>

<script setup>
console.log("⚠️ NotFoundView mounted");
</script>

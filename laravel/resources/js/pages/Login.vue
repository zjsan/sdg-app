<template>
    <div class="p-8 text-center bg-gray-50">
        <h1 class="text-3xl font-bold">Welcome to SDG App 🚀</h1>
        <router-link to="/login" class="text-blue-600 underline"
            >Login</router-link
        >
    </div>
</template>
<script setup>
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
</script>

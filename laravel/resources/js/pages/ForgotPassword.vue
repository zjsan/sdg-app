<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <Card class="w-full max-w-md shadow-xl rounded-2xl border-none">
            <CardHeader class="text-center pb-2">
                <CardTitle class="text-2xl font-bold text-blue-500">
                    Forgot Password
                </CardTitle>
                <CardDescription class="text-gray-500">
                    Enter your email to receive a reset link
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form @submit.prevent="submitForm" class="space-y-6">
                    <div class="space-y-2 text-left">
                        <Label for="email" class="text-gray-400">Email</Label>
                        <Input
                            id="email"
                            v-model="email"
                            type="email"
                            placeholder="Enter your email"
                            required
                            class="border-blue-300 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <Button
                        type="submit"
                        class="w-full py-2 text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition cursor-pointer"
                        :disabled="store.loading"
                    >
                        {{ store.loading ? "Sending..." : "Send Reset Link" }}
                    </Button>

                    <p
                        v-if="store.message"
                        class="text-green-600 text-center mt-2"
                    >
                        {{ store.message }}
                    </p>
                    <p v-if="store.error" class="text-red-600 text-center mt-2">
                        {{ store.error }}
                    </p>
                </form>
            </CardContent>
        </Card>
    </div>
</template>

<script setup>
import { ref } from "vue";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePasswordResetStore } from "@/stores/usePasswordResetStore";

const store = usePasswordResetStore();
const email = ref("");

const submitForm = () => {
    store.requestReset(email.value);
};
</script>

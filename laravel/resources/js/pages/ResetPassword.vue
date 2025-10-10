<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <Card class="w-full max-w-md shadow-xl rounded-2xl border-none">
            <CardHeader class="text-center pb-2">
                <CardTitle class="text-2xl font-bold text-blue-500">
                    Reset Password
                </CardTitle>
                <CardDescription class="text-gray-500">
                    Enter your new password below
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form @submit.prevent="submitForm" class="space-y-6">
                    <div class="space-y-2 text-left">
                        <Label for="password" class="text-gray-400"
                            >New Password</Label
                        >
                        <Input
                            id="password"
                            v-model="password"
                            type="password"
                            required
                            placeholder="••••••••"
                            class="border-blue-300 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div class="space-y-2 text-left">
                        <Label for="confirm" class="text-gray-400"
                            >Confirm Password</Label
                        >
                        <Input
                            id="confirm"
                            v-model="confirmPassword"
                            type="password"
                            required
                            placeholder="••••••••"
                            class="border-blue-300 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <Button
                        type="submit"
                        class="w-full py-2 text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition cursor-pointer"
                        :disabled="loading"
                    >
                        {{ loading ? "Resetting..." : "Reset Password" }}
                    </Button>

                    <p v-if="message" class="text-green-600 text-center mt-2">
                        {{ message }}
                    </p>
                    <p v-if="error" class="text-red-600 text-center mt-2">
                        {{ error }}
                    </p>
                </form>
            </CardContent>
        </Card>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/plugins/axios";
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
const route = useRoute();
const router = useRouter();

const password = ref("");
const confirm = ref("");

onMounted(() => {
    store.token.value = route.query.token || "";
    store.email.value = route.query.email || "";
});

const submitForm = async () => {
    if (password.value !== confirm.value) {
        store.error = "Passwords do not match.";
        return;
    }

    await store.resetPassword({
        email: store.email.value,
        token: store.token.value,
        password: password.value,
        password_confirmation: confirm.value,
    });

    if (!store.error) {
        setTimeout(() => router.push({ name: "Login" }), 1500);
    }
};
</script>

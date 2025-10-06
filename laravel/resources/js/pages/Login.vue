<template>
    <div
        class="min-h-screen flex items-center justify-center bg-white px-4 text-gray-900"
    >
        <div
            class="flex flex-col items-center justify-center gap-8 sm:flex-row w-full max-w-4xl"
        >
            <div class="max-w-sm sm:max-w-sm md:max-w-md">
                <img
                    src="/public/images/sdg logo.png"
                    alt="Sustainable Development Goals Logo"
                    class="w-full h-auto"
                />
            </div>

            <Card class="w-full max-w-sm shadow-xl rounded-2xl border-none">
                <CardHeader class="text-center pb-2">
                    <CardTitle class="text-2xl font-bold text-blue-500">
                        Welcome!
                    </CardTitle>
                    <CardDescription class="text-gray-500 dark:text-gray-400">
                        Please login to continue
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form class="space-y-6" @submit.prevent="handleLogin">
                        <div class="space-y-2 text-left">
                            <Label for="username" class="text-gray-400"
                                >Username</Label
                            >
                            <Input
                                id="username"
                                v-model="form.username"
                                name="username"
                                type="text"
                                placeholder="Enter your username"
                                required
                                class="border-blue-300 focus:border-blue-900 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            />
                        </div>

                        <div class="space-y-2 text-left">
                            <div class="flex items-center justify-between">
                                <Label for="password" class="text-gray-400"
                                    >Password</Label
                                >
                                <a
                                    href="#"
                                    class="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    Forgot password?
                                </a>
                            </div>
                            <Input
                                id="password"
                                v-model="form.password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                class="border-blue-300 focus:border-blue-900 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            />
                        </div>

                        <!-- Display error message if login fails -->
                        <p
                            v-if="auth.error"
                            class="text-red-500 text-sm text-center"
                        >
                            {{ auth.error }}
                        </p>

                        <Button
                            type="submit"
                            class="w-full py-2 text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition cursor-pointer"
                        >
                            Login

                            <!-- Show loading state if login is in progress -->
                            <span v-if="auth.loading">Logging in...</span>
                            <span v-else>Login</span>
                        </Button>
                    </form>
                </CardContent>

                <CardFooter class="text-center pt-2">
                    <!-- <p class="text-sm text-gray-600 dark:text-gray-400">
                        Don’t have an account?
                        <a
                            href="#"
                            class="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            Sign up
                        </a>
                    </p> -->
                </CardFooter>
            </Card>
        </div>
    </div>
</template>
<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const auth = useAuthStore();
const router = useRouter();

// Form state
const form = reactive({
    username: "",
    password: "",
});

// Handle login submission
const handleLogin = async () => {
    await auth.login(form);

    if (auth.isAuthenticated) {
        router.push({ name: "Dashboard" });
    }
};
</script>

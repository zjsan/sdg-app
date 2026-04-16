<template>
    <div
        class="min-h-screen flex items-center justify-center bg-gray-50 px-4 text-gray-900"
    >
        <div
            class="flex flex-col items-center justify-center gap-8 sm:flex-row w-full max-w-4xl"
        >
            <div class="max-w-sm sm:max-w-sm md:max-w-md">
                <img
                    src="/public/images/sdg_transparent_upscaled.png"
                    alt="Sustainable Development Goals Logo"
                    class="w-full h-auto"
                />
            </div>

            <Card
                class="w-full max-w-sm shadow-xl rounded-2xl border-none px-5"
            >
                <CardHeader class="text-center pb-2 pt-4">
                    <CardTitle class="text-2xl font-bold text-blue-500">
                        Welcome!
                    </CardTitle>
                    <CardDescription class="text-gray-500 dark:text-gray-400">
                        Please login to continue
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Button
                        @click="loginWithGoogle"
                        class="w-full flex items-center justify-center gap-3 py-6.5 px-3 bg-white border border-gray-300 rounded-lg text-gray-800 text-lg font-medium hover:bg-gray-50 transition cursor-pointer"
                    >
                        <!-- Google Logo SVG -->
                        <!-- From offical google icon guidelines-->
                        <svg class="size-7 shrink-0" viewBox="0 0 48 48">
                            <path
                                fill="#EA4335"
                                d="M24 9.5c3.54 0 6.73 1.22 9.24 3.6l6.9-6.9C35.64 2.38 30.2 0 24 0 14.64 0 6.48 5.48 2.52 13.44l8.04 6.24C12.36 13.2 17.7 9.5 24 9.5z"
                            />
                            <path
                                fill="#4285F4"
                                d="M46.5 24.5c0-1.6-.14-3.14-.4-4.62H24v9.24h12.74c-.55 2.96-2.2 5.46-4.68 7.14l7.2 5.6C43.92 37.3 46.5 31.4 46.5 24.5z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M10.56 28.68A14.48 14.48 0 0 1 9.5 24c0-1.62.28-3.2.76-4.68l-8.04-6.24A23.98 23.98 0 0 0 0 24c0 3.86.92 7.52 2.52 10.56l8.04-5.88z"
                            />
                            <path
                                fill="#34A853"
                                d="M24 48c6.2 0 11.4-2.04 15.2-5.52l-7.2-5.6c-2 1.34-4.56 2.14-8 2.14-6.3 0-11.64-3.7-13.44-9.18l-8.04 5.88C6.48 42.52 14.64 48 24 48z"
                            />
                        </svg>

                        <span>Sign in with Google</span>
                    </Button>

                    <!-- Optional error display -->
                    <p
                        v-if="auth.error"
                        class="text-red-500 text-sm text-center"
                    >
                        {{ auth.error }}
                    </p>

                    <p
                        v-if="sessionExpired"
                        class="text-yellow-600 font-medium mb-4"
                    >
                        Session expired or unauthorized access. Please log in
                        again.
                    </p>
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
import { Button } from "@/components/ui/button";
import { useRoute } from "vue-router";

const route = useRoute();
const sessionExpired = route.query.sessionExpired === "true";

const auth = useAuthStore();
const router = useRouter();

const loginWithGoogle = () => {
    // Redirect user to Laravel backend’s Google redirect route
    auth.loginWithGoogle();
};
</script>

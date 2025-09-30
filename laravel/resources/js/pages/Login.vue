<template>
    <div
        class="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 text-gray-900 gap-10 sm:flex-row"
    >
        <div class="max-w-xs sm:max-w-sm md:max-w-md">
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
                <form class="space-y-6">
                    <div class="space-y-2 text-left">
                        <Label for="username" class="text-gray-400"
                            >Username</Label
                        >
                        <Input
                            id="username"
                            type="text"
                            placeholder="Enter your username"
                            required
                            class="border-gray-300 focus:border-blue-500"
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
                            type="password"
                            placeholder="••••••••"
                            required
                            class="border-gray-300 focus:border-blue-500"
                        />
                    </div>

                    <Button
                        type="submit"
                        class="w-full py-2 text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition cursor-pointer"
                    >
                        Login
                    </Button>
                </form>
            </CardContent>

            <CardFooter class="text-center pt-2">
                <p class="text-sm text-gray-600 dark:text-gray-400">
                    Don’t have an account?
                    <a
                        href="#"
                        class="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        Sign up
                    </a>
                </p>
            </CardFooter>
        </Card>
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
</script>

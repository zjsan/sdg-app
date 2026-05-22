<template>
    <div
        class="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-6"
    >
        <div class="space-y-4 max-w-md">
            <h1 class="text-2xl font-bold" :class="titleClass">{{ title }}</h1>

            <p class="text-gray-600 leading-relaxed">
                {{ message }}
            </p>

            <button
                @click="onActionClick"
                class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
            >
                {{ actionText }}
            </button>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const props = defineProps({
    title: { type: String, required: true },
    message: { type: String, required: true },
    actionText: { type: String, default: "Back to Login" },
    actionRoute: { type: String, default: "Login" },
    titleClass: { type: String, default: "text-red-600" }, // allows color override
});

const router = useRouter();

const onActionClick = () => {
    router.push({ name: props.actionRoute });
};
</script>

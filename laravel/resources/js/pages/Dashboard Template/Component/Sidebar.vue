<template>
    <aside
        :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
        class="fixed inset-y-0 left-0 z-40 w-64 flex flex-col border-r border-gray-200 bg-white transform transition-transform duration-300 lg:relative lg:translate-x-0"
    >
        <div class="flex items-center justify-center h-20 border-b p-4">
            <span class="text-xl font-semibold text-gray-800"
                >SDG DASHBOARD</span
            >
        </div>

        <nav class="flex-grow p-4 space-y-2 overflow-y-auto">
            <router-link
                to="/dashboard"
                class="flex items-center p-3 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                @click="$emit('close')"
            >
                <i class="pi pi-home mr-3"></i> Dashboard
            </router-link>
        </nav>

        <UserSection />
    </aside>
</template>

<script setup>
import UserSection from "@/Components/UserSection.vue";

defineProps(["isOpen", "isMobile"]);
defineEmits(["close"]);
</script>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import Sidebar from "@/Components/Sidebar.vue";
import { Button } from "@/components/ui/button";

const isSidebarOpen = ref(false);
const screenWidth = ref(window.innerWidth);
const isMobile = computed(() => screenWidth.value < 1024);

const handleResize = () => {
    screenWidth.value = window.innerWidth;
    isSidebarOpen.value = window.innerWidth >= 1024;
};

onMounted(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
});

onUnmounted(() => window.removeEventListener("resize", handleResize));
</script>

<template>
    <div class="flex flex-col lg:flex-row h-screen bg-gray-50">
        <header
            class="h-14 lg:hidden border-b bg-white flex items-center justify-between p-4 shadow-sm flex-shrink-0"
        >
            <Button
                @click="isSidebarOpen = !isSidebarOpen"
                variant="ghost"
                size="icon"
            >
                <i
                    :class="isSidebarOpen ? 'pi pi-times' : 'pi pi-bars'"
                    class="text-xl"
                ></i>
            </Button>
            <span class="font-semibold">SDG DASHBOARD</span>
        </header>

        <Sidebar
            :is-open="isSidebarOpen"
            :is-mobile="isMobile"
            @close="isSidebarOpen = false"
        />

        <div
            v-if="isSidebarOpen && isMobile"
            @click="isSidebarOpen = false"
            class="fixed inset-0 z-30 bg-black/50 lg:hidden"
        ></div>

        <main class="flex-grow w-full flex flex-col overflow-hidden">
            <slot />
        </main>
    </div>
</template>

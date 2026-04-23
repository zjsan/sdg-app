<template>
    <div class="flex flex-col lg:flex-row min-h-screen bg-gray-50">
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

        <div class="flex flex-col flex-1 w-full">
            <main class="flex-1">
                <slot />
            </main>

            <Footer class="mt-auto" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import Sidebar from "../Component/Sidebar.vue";
import { Button } from "@/components/ui/button";
import Footer from "./Footer.vue";

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
<style scoped>
/* Ensures the main container takes the full viewport height */
.h-screen {
    height: 100vh;
}
</style>

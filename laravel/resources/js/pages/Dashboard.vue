<template>
    <Authenticated>
        <div class="h-full w-full flex flex-col">
            <div
                v-if="!powerBiStore.powerBiEmbedUrl"
                class="flex-1 flex items-center justify-center"
            >
                <i class="pi pi-spin pi-spinner text-3xl mr-2"></i> Loading
                Dashboard...
            </div>

            <!-- <iframe
                v-else
                :src="powerBiStore.powerBiEmbedUrl"
                class="w-full h-[calc(100vh-80px)] border-0"
                allowfullscreen
            ></iframe> -->
        </div>
    </Authenticated>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from "vue";
import Authenticated from "./Dashboard Template/Layout/Authenticated.vue";
import { usePowerBiStore } from "@/stores/powerBi";

const powerBiStore = usePowerBiStore();

// onMounted(async () => {
//     await powerBiStore.init();
// });

// onBeforeUnmount(() => {
//     powerBiStore.cleanup();
// });
</script>

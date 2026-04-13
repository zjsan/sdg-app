<template>
    <Authenticated>
        <div class="flex-grow flex flex-col">
            <div
                v-if="!powerBiStore.powerBiEmbedUrl"
                class="flex items-center justify-center flex-grow text-gray-500"
            >
                <i class="pi pi-spin pi-spinner text-3xl mr-2"></i> Loading
                Dashboard...
            </div>

            <iframe
                v-else
                :src="powerBiStore.powerBiEmbedUrl"
                class="flex-grow w-full h-full border-0"
                allowfullscreen
            ></iframe>
        </div>
    </Authenticated>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from "vue";
import Authenticated from "./Dashboard Template/Layout/Authenticated.vue";
import { usePowerBiStore } from "@/stores/powerBi";

const powerBiStore = usePowerBiStore();

onMounted(async () => {
    await powerBiStore.init();
});

onBeforeUnmount(() => {
    powerBiStore.cleanup();
});
</script>

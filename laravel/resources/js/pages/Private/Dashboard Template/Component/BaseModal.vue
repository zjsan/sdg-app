<template>
    <Teleport to="body">
        <div
            v-if="show"
            class="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
            <!-- Backdrop -->
            <div
                class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                @click="$emit('close')"
            ></div>

            <!-- Content Card -->
            <div
                class="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all"
            >
                <div class="p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold text-slate-800">
                            <slot name="title" />
                        </h3>
                        <button
                            @click="$emit('close')"
                            class="text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                            <!-- X Icon SVG here -->
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    <slot />
                    <!-- Body content goes here -->

                    <div class="flex justify-end gap-3 mt-6">
                        <slot name="actions" />
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
defineProps({ show: Boolean });
defineEmits(["close"]);
</script>

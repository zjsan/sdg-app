<template>
    <button
        :class="[
            'inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg transition-all active:scale-95 cursor-pointer',
            variant === 'primary'
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                : '',
            variant === 'secondary'
                ? 'border border-slate-300 text-slate-700 bg-white hover:bg-slate-50'
                : '',
            variant === 'danger'
                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                : '',
        ]"
    >
        <slot />
    </button>
</template>

<script setup>
defineProps({
    variant: { type: String, default: "primary" },
});
</script>

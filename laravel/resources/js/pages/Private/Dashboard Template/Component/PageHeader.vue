<!-- components/PageHeader.vue -->
<template>
    <div
        class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
    >
        <div>
            <h1 class="text-3xl font-bold text-slate-900 tracking-tight">
                <slot name="title" />
            </h1>
            <p class="mt-1 text-sm text-slate-500">
                <slot name="subtitle" />
            </p>
        </div>

        <div class="flex items-center gap-3">
            <slot name="actions" />
        </div>
    </div>
</template>

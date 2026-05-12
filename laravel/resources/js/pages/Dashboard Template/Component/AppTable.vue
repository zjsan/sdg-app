<!-- components/AppTable.vue -->
<template>
    <div
        class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
    >
        <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
                <tr>
                    <slot name="header" />
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
                <slot name="body" />
            </tbody>
        </table>
    </div>
</template>

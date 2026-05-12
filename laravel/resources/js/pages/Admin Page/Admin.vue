<template>
    <h1>Admin Page</h1>
    <div
        class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"
    >
        <div>
            <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">
                Allowed Emails Management
            </h1>
            <p class="mt-1 text-sm text-slate-500">
                <span class="font-medium text-slate-700">{{
                    organizationStore.organizations.length
                }}</span>
                active organizations.
            </p>
        </div>
    </div>
</template>
<script setup>
import Authenticated from "../Dashboard Template/Layout/Authenticated.vue";
</script>

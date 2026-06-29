<template>
    <router-view />

    <AlertDialog :open="authStore.isSecurityRedirecting">
        <AlertDialogContent
            class="sm:max-w-[425px] border-rose-500/20 bg-slate-900 text-white"
        >
            <AlertDialogHeader class="flex flex-col items-center text-center">
                <div
                    class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-500"
                >
                    <i class="pi pi-lock text-xl animate-pulse"></i>
                </div>

                <AlertDialogTitle
                    class="text-rose-400 text-xl font-semibold tracking-tight"
                >
                    Access Level Updated
                </AlertDialogTitle>

                <AlertDialogDescription
                    class="text-slate-400 mt-2 text-sm leading-relaxed"
                >
                    {{ authStore.securityWarningMessage }}
                </AlertDialogDescription>
            </AlertDialogHeader>

            <div class="flex flex-col items-center justify-center py-6 gap-3">
                <div
                    class="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-rose-500"
                ></div>
                <span
                    class="text-xs text-slate-500 uppercase tracking-widest font-mono"
                >
                    Securing Environment...
                </span>
            </div>
        </AlertDialogContent>
    </AlertDialog>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
} from "@/components/ui/alert-dialog";

const authStore = useAuthStore();
</script>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { usePowerBiStore } from "@/stores/powerBi";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const auth = useAuthStore();
const powerBiStore = usePowerBiStore();

const logout = async () => {
    powerBiStore.broadcastLogout();
    await auth.logout();
};
</script>

<template>
    <div class="p-4 border-t border-gray-200 flex-shrink-0">
        <div class="flex items-center p-2 mb-3">
            <div
                class="h-8 w-8 bg-blue-200 rounded-full mr-3 flex items-center justify-center text-sm font-bold text-blue-800"
            >
                {{ auth.user?.name ? auth.user.name.charAt(0) : "U" }}
            </div>
            <div class="overflow-hidden">
                <div class="text-sm font-semibold truncate">
                    {{ auth.user?.name || "Guest" }}
                </div>
                <div class="text-xs text-gray-500 truncate">
                    {{ auth.user?.email }}
                </div>
            </div>
        </div>

        <AlertDialog v-if="auth.isAuthenticated">
            <AlertDialogTrigger as-child>
                <Button
                    class="w-full justify-center bg-red-500 hover:bg-red-600 text-white"
                >
                    <i class="pi pi-sign-out mr-2"></i> Logout
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will end your session and you will need to log in
                        again.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction @click="logout" class="bg-red-600">
                        Yes, Log me out
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
</template>

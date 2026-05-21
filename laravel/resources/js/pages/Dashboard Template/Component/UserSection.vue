<template>
    <div class="p-[17.8px] border-t border-gray-200 flex-shrink-0">
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
                    class="w-full justify-center bg-blue-400 hover:bg-blue-600 text-white cursor-pointer"
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
                    <!-- Disable cancel button if backend processing is active -->
                    <AlertDialogCancel
                        :disabled="isLoggingOut"
                        class="cursor-pointer"
                        >Cancel</AlertDialogCancel
                    >
                    <AlertDialogAction
                        @click="handleLogout"
                        :disabled="isLoggingOut"
                        class="bg-blue-400 hover:bg-blue-600 cursor-pointer"
                    >
                        {{
                            isLoggingOut ? "Logging out..." : "Yes, Log me out"
                        }}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
</template>

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
import router from "@/router";

const auth = useAuthStore();
const powerBiStore = usePowerBiStore();
const isLoggingOut = ref(false); //track api call status

const handleLogout = async () => {
    if (isLoggingOut.value) return; //prevent multiple clicks

    isLoggingOut.value = true; //set flag to prevent multiple logout attempts

    try {
        powerBiStore.broadcastLogout();

        const result = await auth.logout();

        if (result.success) {
            // Optionally show a success message or redirect
            console.log(result.message);
        } else {
            // Handle unexpected response structure
            console.warn("Unexpected logout response:", result);
        }
    } finally {
        isLoggingOut.value = false;
        forceToLoginPage(); // Ensure user is redirected to login page
    }
};

const forceToLoginPage = () => {
    if (router.currentRoute.value.name !== "Login") {
        router.push({ name: "Login" });
    }
};
</script>

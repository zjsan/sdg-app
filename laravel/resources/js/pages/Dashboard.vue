<template>
    <div class="flex h-screen bg-gray-50">
        <aside class="w-64 flex flex-col border-r border-gray-200 bg-white">
            <div
                class="flex items-center justify-center h-16 border-b border-gray-200 p-4"
            >
                <span class="text-xl font-semibold text-gray-800"
                    >SDG Dashboard</span
                >
            </div>

            <nav class="flex-grow p-4 space-y-2">
                <router-link
                    to="/dashboard"
                    class="flex items-center p-3 text-gray-700 rounded-lg hover:bg-gray-100 transition duration-150"
                    active-class="bg-gray-100 font-semibold"
                >
                    <i class="pi pi-home text-xl mr-3"></i>
                    Dashboard
                </router-link>

                <!--
                 <router-link
                    to="/settings"
                    class="flex items-center p-3 text-gray-700 rounded-lg hover:bg-gray-100 transition duration-150"
                    active-class="bg-gray-100 font-semibold"
                >
                    <i class="pi pi-cog text-xl mr-3"></i>
                    Settings
                </router-link>
                -->
            </nav>

            <div class="p-4 border-t border-gray-200">
                <div class="flex items-center p-2 mb-3">
                    <div
                        class="h-8 w-8 bg-blue-200 rounded-full mr-3 flex items-center justify-center text-sm font-bold text-blue-800"
                    >
                        {{ auth.user?.name ? auth.user.name.charAt(0) : "IA" }}
                    </div>
                    <div>
                        <div class="text-sm font-semibold">
                            {{ auth.user?.name || "Loading User..." }}
                        </div>
                    </div>
                </div>

                <AlertDialog v-if="auth.isAuthenticated">
                    <AlertDialogTrigger as-child>
                        <Button
                            class="w-full justify-center px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600 transition"
                        >
                            <i class="pi pi-sign-out text-xl mr-2"></i>
                            Logout
                        </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle
                                >Are you sure you want to
                                logout?</AlertDialogTitle
                            >
                            <AlertDialogDescription>
                                This action will end your current session. You
                                will need to log in again to access the
                                dashboard.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>

                            <AlertDialogAction
                                @click="logout"
                                class="bg-red-600 hover:bg-red-700"
                            >
                                Yes, Log me out
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </aside>

        <main class="flex-grow overflow-y-auto p-0">
            <!--
             <header
                class="h-16 border-b border-gray-200 bg-white p-4 flex items-center"
            >
                <h1 class="text-lg font-medium text-gray-900">
                    Power BI Dashboard
                </h1>
            </header>
            -->
            <div class="p-2 h-full">
                <iframe
                    :src="powerBiEmbedUrl"
                    frameborder="0"
                    allowFullScreen="true"
                    class="w-full h-full border-2 border-gray-300 rounded-lg shadow-lg"
                    title="Embedded Power BI Report"
                ></iframe>
            </div>
        </main>
    </div>
</template>
<script setup>
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth";
import { ref, onMounted } from "vue";
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

const logout = async () => {
    await auth.logout();
};

const powerBiEmbedUrl = ref(
    "https://app.powerbi.com/view?r=eyJrIjoiZmRiODdmMzgtZTk2ZS00MTQ1LTgyY2YtZmEyYmU2N2RkYTA5IiwidCI6IjdjZmY5YzA2LThmNGQtNDAwNi1iOWQwLWU4MWRjYWJjZDU1NyIsImMiOjEwfQ%3D%3D"
);
</script>

<style scoped>
/* Ensures the main container takes the full viewport height */
.h-screen {
    height: 100vh;
}
/* Optional: Router link exact match styling */
.router-link-active {
    background-color: #f3f4f6; /* bg-gray-100 */
    font-weight: 600; /* font-semibold */
}
/* Adjusting icon size for consistency (PrimeIcons often require an explicit size class) */
.pi {
    font-size: 1.25rem; /* Equivalent to Tailwind's text-xl for icons */
}
</style>

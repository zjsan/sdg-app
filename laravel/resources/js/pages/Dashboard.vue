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

                <Button
                    v-if="auth.isAuthenticated"
                    @click="logout"
                    class="w-full justify-center px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600 transition"
                >
                    <i class="pi pi-sign-out text-xl mr-2"></i>
                    Logout
                </Button>
            </div>
        </aside>

        <main class="flex-grow overflow-y-auto p-0">
            <header
                class="h-16 border-b border-gray-200 bg-white p-4 flex items-center"
            >
                <h1 class="text-lg font-medium text-gray-900">
                    Power BI Dashboard
                </h1>
            </header>

            <div class="p-4 h-[calc(100vh-4rem)]">
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
const auth = useAuthStore();

const logout = async () => {
    await auth.logout();
};
</script>

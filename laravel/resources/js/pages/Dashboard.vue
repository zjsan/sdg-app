<template>
    <!-- Main container: Full height -->
    <!-- On desktop (lg:), it uses flex/row layout. On mobile (default), it stacks items. -->
    <div class="flex flex-col lg:flex-row h-screen bg-gray-50">
        <!-- 1. MOBILE HEADER (Only visible on small screens for app title and menu button) -->
        <header
            class="h-14 lg:hidden border-b border-gray-200 bg-white flex items-center justify-between p-4 shadow-sm flex-shrink-0"
        >
            <!-- Button to toggle the mobile sidebar -->
            <Button
                @click="isSidebarOpen = !isSidebarOpen"
                variant="ghost"
                size="icon"
            >
                <i
                    :class="isSidebarOpen ? 'pi pi-times' : 'pi pi-bars'"
                    class="text-xl"
                ></i>
            </Button>
        </header>

        <!-- 2. LEFT NAVIGATION SIDEBAR (The actual mobile menu) -->
        <aside
            :class="{
                // Controls the slide-in/out animation on mobile
                'translate-x-0': isSidebarOpen,
                '-translate-x-full': !isSidebarOpen,
            }"
            class="fixed inset-y-0 left-0 z-40 w-64 flex flex-col border-r border-gray-200 bg-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:flex-shrink-0"
        >
            <!-- Logo/App Title Section (Visible on all screen sizes) -->
            <div
                class="flex items-center justify-center h-20 border-b border-gray-200 p-4"
            >
                <span class="text-xl font-semibold text-gray-800"
                    >SDG DASHBOARD</span
                >
            </div>

            <!-- Main Navigation Links -->
            <nav class="flex-grow p-4 space-y-2 overflow-y-auto">
                <!-- Links: Use @click to close the sidebar after navigation on mobile for better UX -->
                <router-link
                    to="/dashboard"
                    class="flex items-center p-3 text-gray-700 rounded-lg hover:bg-gray-100 transition duration-150"
                    active-class="bg-gray-100 font-semibold"
                    @click="isSidebarOpen = false"
                >
                    <i class="pi pi-home text-xl mr-3"></i>
                    Dashboard
                </router-link>

                <!-- 
                <router-link
                    to="/settings"
                    class="flex items-center p-3 text-gray-700 rounded-lg hover:bg-gray-100 transition duration-150"
                    active-class="bg-gray-100 font-semibold"
                    @click="isSidebarOpen = false"
                >
                    <i class="pi pi-cog text-xl mr-3"></i>
                    Settings
                </router-link>
                -->
            </nav>

            <!-- User/Logout Section (Bottom of Sidebar) -->
            <div class="p-4 border-t border-gray-200 flex-shrink-0">
                <!-- User Info Placeholder -->
                <div class="flex items-center p-2 mb-3">
                    <div
                        class="h-8 w-8 bg-blue-200 rounded-full mr-3 flex items-center justify-center text-sm font-bold text-blue-800"
                    >
                        {{ auth.user?.name ? auth.user.name.charAt(0) : "IA" }}
                    </div>
                    <div>
                        <div class="text-sm font-semibold truncate">
                            {{ auth.user?.name || "Loading User..." }}
                        </div>
                        <div class="text-xs text-gray-500 truncate">
                            {{ auth.user?.email || "user@email.com" }}
                        </div>
                    </div>
                </div>

                <!-- LOGOUT CONFIRMATION DIALOG -->
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
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
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

        <!-- Mobile Backdrop: Closes sidebar when clicking outside (only on mobile/tablet) -->
        <div
            v-if="isSidebarOpen && isMobile"
            @click="isSidebarOpen = false"
            class="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
        ></div>

        <!-- 3. RIGHT CONTENT AREA (Main view, takes up remaining space) -->
        <main class="flex-grow w-full flex flex-col">
            <div class="flex-grow flex flex-col">
                <div
                    v-if="!powerBiEmbedUrl"
                    class="flex items-center justify-center flex-grow text-gray-500"
                >
                    <i class="pi pi-spin pi-spinner text-3xl mr-2"></i> Loading
                    Dashboard securely...
                </div>

                <iframe
                    v-else
                    :src="powerBiEmbedUrl"
                    :key="powerBiEmbedUrl"
                    frameborder="0"
                    allowfullscreen
                    class="flex-grow w-full h-full border-0 shadow-lg"
                    title="Embedded Power BI Report"
                ></iframe>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted, onBeforeUnmount } from "vue";
import { useAuthStore } from "@/stores/auth";
import api from "@/plugins/axios";
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
import { Button } from "@/components/ui/button";

const auth = useAuthStore();
const powerBiEmbedUrl = ref(null);
const isSidebarOpen = ref(false);
const screenWidth = ref(window.innerWidth);
let refreshTimer = null;
const refreshInterval = 2700; //45 min in seconds

// Determine if screen size is below the 'lg' breakpoint (1024px), covering mobile and tablet
const isMobile = computed(() => screenWidth.value < 1024);

// Handles window resize: updates width and manages sidebar state
const handleResize = () => {
    screenWidth.value = window.innerWidth;

    if (window.innerWidth >= 1024) {
        // Desktop: Sidebar should always be visible (open)
        isSidebarOpen.value = true;
    } else {
        // Mobile/Tablet: Sidebar should be hidden by default
        isSidebarOpen.value = false;
    }
};

async function loadPowerBiUrl(isRefresh = false) {
    // 1. Initial Auth Check and Data Fetch
    try {
        const response = await api.get("/pbi", {
            headers: { Authorization: `Bearer ${auth.token}` },
        });

        console.log("Power BI API Response:", response.data);

        const { signedUrl, message } = response.data;

        if (signedUrl) {
            // Construct the final, full URL on the client side
            powerBiEmbedUrl.value = signedUrl;
            console.log(message);
        } else {
            console.error("Missing Power BI IDs in response.");
        }
    } catch (error) {
        console.error("Failed to load Power BI URL:", error);
    }

    // 2. Set up responsive listeners
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial call to set sidebar state and screenWidth correctly
}

onUnmounted(() => {
    // Crucial cleanup to prevent memory leaks
    window.removeEventListener("resize", handleResize);
});

onMounted(async () => {
    await loadPowerBiUrl();
    startAutoRefresh();
});

onBeforeUnmount(() => {
    if (refreshTimer) clearInterval(refreshTimer);
});

function startAutoRefresh() {
    // refresh every 45 minutes (before 1hr expiration)
    refreshTimer = setInterval(async () => {
        await loadPowerBiUrl(true);

        powerBiEmbedUrl.value = powerBiEmbedUrl.value + "&r=" + Date.now(); // Force iframe refresh
    }, refreshInterval * 1000);
}

//when user is inactive (tab hidden), pause refresh
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        clearInterval(refreshTimer);
    } else {
        startAutoRefresh();
    }
});

const logout = async () => {
    await auth.logout();
};
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

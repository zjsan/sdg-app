<template>
    <aside
        :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
        class="fixed inset-y-0 left-0 z-40 w-64 flex flex-col border-r border-gray-200 bg-white transform transition-transform duration-300 lg:relative lg:translate-x-0"
    >
        <div class="flex items-center justify-center h-20 border-b p-4">
            <span class="text-xl font-semibold text-gray-800"
                >SDG DASHBOARD</span
            >
        </div>

        <nav class="flex-grow p-4 space-y-2 overflow-y-auto">
            <router-link
                v-for="item in filteredMenu"
                :key="item.to"
                :to="item.to"
                class="flex items-center p-3 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                active-class="bg-gray-100 font-semibold border-l-4 border-blue-500"
            >
                <i :class="['pi text-xl mr-3', item.icon]"></i>
                {{ item.name }}
            </router-link>
        </nav>

        <UserSection />
    </aside>
</template>

<script setup>
import UserSection from "./UserSection.vue";
import { computed } from "vue";
import { useAuthStore } from "@/stores/auth";
defineProps(["isOpen", "isMobile"]);
defineEmits(["close"]);

const auth = useAuthStore();

// Define menu structure
const menuItems = [
    {
        name: "Dashboard",
        to: "/dashboard",
        icon: "pi-home",
        visible: () => true, // Everyone logged in sees this
    },
    {
        name: "Developer",
        to: "/developer",
        icon: "pi-code",
        visible: () => auth.isDeveloper,
    },
    // {
    //     name: "Admin Panel",
    //     to: "/admin",
    //     icon: "pi-shield",
    //     visible: () => auth.isAdmin,
    // },
];
const filteredMenu = computed(() => {
    return menuItems.filter((item) => item.visible());
});
</script>

<style scoped>
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

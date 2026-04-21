<template>
    <aside
        :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
        class="fixed inset-y-0 left-0 z-40 w-64 flex flex-col border-r border-slate-200 bg-white transform transition-transform duration-300 lg:relative lg:translate-x-0"
    >
        <div class="flex items-center justify-center h-20 border-b p-4">
            <img
                src="/public/images/sdg_transparent_upscaled.png"
                alt="Sustainable Development Goals Logo"
                class="w-full h-auto drop-shadow-xl transition duration-500 hover:scale-105"
            />
        </div>

        <nav class="flex-grow p-4 space-y-2 overflow-y-auto">
            <router-link
                v-for="item in filteredMenu"
                :key="item.to"
                :to="item.to"
                class="group flex items-center px-4 py-3 text-slate-500 rounded-xl hover:bg-slate-50 hover:text-blue-600 transition-all duration-200"
                active-class="bg-gray-100 font-semibold border-l-4 border-blue-500"
            >
                <i :class="['pi text-xl mr-3', item.icon]"></i>
                {{ item.name }}
            </router-link>
        </nav>

        <div class="p-4 border-t border-slate-100">
            <UserSection />
        </div>
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
        name: "DeveloperPage",
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

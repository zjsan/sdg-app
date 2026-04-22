<template>
    <aside
        :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
        class="fixed inset-y-0 left-0 z-40 w-64 flex flex-col border-r border-slate-200 drop-shadow bg-white transform transition-transform duration-300 lg:relative lg:translate-x-0"
    >
        <div class="flex items-center gap-3 pt-4 px-5">
            <div class="relative group">
                <img
                    src="/public/images/sdg_transparent_upscaled.png"
                    alt="SDG Logo"
                    class="w-12 h-12 object-contain transition-transform duration-500"
                />
                <div
                    class="absolute inset-0 bg-blue-400/20 blur-xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                ></div>
            </div>

            <div class="flex flex-col">
                <span
                    class="text-md font-black tracking-tight text-slate-800 leading-none"
                >
                    PHEI <span class="text-blue-600">SDG</span>
                </span>
                <span
                    class="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mt-1"
                >
                    Dashboard
                </span>
            </div>
        </div>

        <nav class="flex-grow p-4 space-y-2 overflow-y-auto">
            <router-link
                v-for="item in filteredMenu"
                :key="item.to"
                :to="item.to"
                class="group flex items-center px-4 py-3 hover:bg-slate-50 hover:text-blue-600 transition-all duration-200"
                active-class="bg-blue-50 font-medium rounded border-blue-500"
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

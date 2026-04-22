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

        <nav class="mt-1 flex-grow p-4 space-y-2 overflow-y-auto">
            <router-link
                v-for="item in filteredMenu"
                :key="item.to"
                :to="item.to"
                class="group flex items-center px-4 py-3 text-slate-400 text-sm hover:bg-slate-50 hover:text-blue-600 transition-all duration-200"
                active-class="bg-slate-50 !text-blue-600 font-medium rounded border-blue-500"
            >
                <i :class="['pi text-sm mr-3', item.icon]"></i>
                {{ item.name }}
            </router-link>
        </nav>

        <div class="mt-10 space-y-4">
            <div
                class="px-4 py-5 rounded-2xl bg-slate-50 border border-slate-100"
            >
                <h4 class="text-xs font-bold text-slate-800 flex items-center">
                    <i class="pi pi-info-circle mr-2 text-blue-500"></i>
                    Report Scope
                </h4>
                <p class="text-[11px] text-slate-500 mt-2 leading-relaxed">
                    Insights are derived from raw performance metrics sourced
                    via THE DataPoints. This data is pre-processed and
                    harmonized to visualize how Higher Education Institutions
                    (HEIs) align with the United Nations’ Sustainable
                    Development Goals
                </p>
            </div>
        </div>

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
        icon: "pi-chart-line",
        visible: () => true, // Everyone logged in sees this
    },
    {
        name: "Dashboard Manual",
        to: "/manual",
        icon: "pi-book",
        visible: () => true, // Everyone logged in sees this
    },
    {
        name: "Organization Management",
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
    font-weight: 500; /* font-semibold */
    color: #2563eb; /* text-blue-600 */
}
/* Adjusting icon size for consistency (PrimeIcons often require an explicit size class) */
.pi {
    font-size: 1rem; /* Equivalent to Tailwind's text-xl for icons */
}
</style>

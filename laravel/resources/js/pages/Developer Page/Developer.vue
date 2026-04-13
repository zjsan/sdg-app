<template>
    <Authenticated>
        <div class="p-8">
            <h1 class="text-2xl font-bold">Admin Control Panel</h1>
        </div>
    </Authenticated>
</template>
<script setup>
import { useAuthStore } from "@/stores/auth";
import Authenticated from "../Dashboard Template/Layout/Authenticated.vue";

const auth = useAuthStore();

const logout = async () => {
    await auth.logout();
};
</script>

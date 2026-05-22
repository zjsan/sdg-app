<template>
    <Authenticated>
        <div class="p-8 max-w-6xl mx-auto">
            <PageHeader>
                <template #title>Whitelist Management</template>
            </PageHeader>

            <div
                class="flex justify-end py-4 border-b border-slate-100 flex justify-end bg-slate-50/50"
            ></div>
        </div>
    </Authenticated>
</template>
<script setup>
import Authenticated from "../Dashboard Template/Layout/Authenticated.vue";
import PageHeader from "../Dashboard Template/Component/PageHeader.vue";
import AppTable from "../Dashboard Template/Component/AppTable.vue";
import BaseButton from "../Dashboard Template/Component/BaseButton.vue";
import BaseModal from "../Dashboard Template/Component/BaseModal.vue";
import { useAllowedEmailsStore } from "@/stores/allowedEmails";

const allowedEmailsStore = useAllowedEmailsStore();
</script>

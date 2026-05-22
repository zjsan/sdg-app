<template>
    <Authenticated>
        <div class="p-8 max-w-6xl mx-auto">
            <PageHeader>
                <template #title>Whitelist Management</template>
                <template #subtitle>
                    <span class="font-medium text-slate-700">
                        {{ allowedEmailsStore.emails?.length || 0 }}
                    </span>
                    authorized accounts/domains allowed via Google Sign-In.
                </template>
                <template #actions>
                    <!-- Header Action Shortcut  -->
                </template>
            </PageHeader>

            <!-- Action Control Bar -->
            <div
                class="flex justify-between items-center py-4 border-b border-slate-100 bg-slate-50/50 px-4 rounded-t-xl"
            >
                <!-- Search or Filter placeholder -->
                <div class="relative w-72">
                    <input
                        type="text"
                        placeholder="Search allowed emails..."
                        class="w-full pl-3 pr-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    />
                </div>

                <BaseButton @click="openAddModal">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-5 h-5 mr-1.5 -ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        />
                    </svg>
                    Authorize Access
                </BaseButton>
            </div>

            <!-- Table Component -->
            <AppTable>
                <template #header>
                    <th
                        class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                    >
                        Allowed Identity / Domain
                    </th>
                    <th
                        class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                    >
                        Status
                    </th>
                    <th
                        class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                    >
                        Added On
                    </th>
                    <th
                        class="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider"
                    >
                        Actions
                    </th>
                </template>

                <template #body>
                    <!-- Fallback Empty State -->
                    <tr
                        v-if="
                            !allowedEmailsStore.emails ||
                            allowedEmailsStore.emails.length === 0
                        "
                    >
                        <td
                            colspan="4"
                            class="px-6 py-12 text-center text-sm text-slate-400 italic"
                        >
                            No emails or domains whitelisted yet. Only system
                            admins can access.
                        </td>
                    </tr>

                    <!-- Dynamic Row Loop -->
                    <tr
                        v-for="item in allowedEmailsStore.emails"
                        :key="item.id"
                        class="hover:bg-slate-50/80 transition-colors"
                    >
                        <!-- Identity Column -->
                        <td class="px-6 py-4">
                            <div class="flex items-center space-x-3">
                                <!-- Quick visual differentiator for Domain vs Single Email -->
                                <span
                                    v-if="item.email.startsWith('@')"
                                    class="p-1.5 bg-amber-50 text-amber-600 rounded-md text-xs font-bold"
                                >
                                    DOM
                                </span>
                                <span
                                    v-else
                                    class="p-1.5 bg-indigo-50 text-indigo-600 rounded-md text-xs font-bold"
                                >
                                    USR
                                </span>

                                <span
                                    class="font-medium text-slate-900 font-mono text-sm"
                                >
                                    {{ item.email }}
                                </span>
                            </div>
                        </td>

                        <!-- Status Badge Column -->
                        <td class="px-6 py-4">
                            <span
                                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"
                            >
                                <span
                                    class="w-1.5 h-1.5 mr-1.5 bg-emerald-500 rounded-full"
                                ></span>
                                Active Access
                            </span>
                        </td>

                        <!-- Meta Info Column -->
                        <td class="px-6 py-4 text-sm text-slate-500">
                            {{ item.created_at || "N/A" }}
                        </td>

                        <!-- Action Controls -->
                        <td class="px-6 py-4 text-right space-x-2">
                            <BaseButton
                                variant="danger"
                                @click="confirmDelete(item)"
                            >
                                Revoke
                            </BaseButton>
                        </td>
                    </tr>
                </template>

                <!-- Modal Component for Adding Rules -->
                <BaseModal :show="isModalOpen" @close="closeModal">
                    <template #title> Authorize Portal Access </template>

                    <div class="space-y-4 my-2">
                        <p class="text-xs text-slate-500 leading-relaxed">
                            Input a valid Google Account email or an entire
                            organization domain to permit login capabilities.
                        </p>

                        <div>
                            <label
                                class="block text-xs font-bold uppercase text-slate-400 mb-2"
                            >
                                Google Identity / Domain Input
                            </label>
                            <input
                                v-model="newEmailInput"
                                type="text"
                                class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50 text-sm font-mono"
                                placeholder="e.g., employee@company.com or @company.com"
                                @keyup.enter="handleSubmit"
                            />
                        </div>
                    </div>

                    <template #actions>
                        <BaseButton variant="secondary" @click="closeModal">
                            Cancel
                        </BaseButton>
                        <BaseButton
                            :disabled="allowedEmailsStore.loading"
                            @click="handleSubmit"
                        >
                            {{
                                allowedEmailsStore.loading
                                    ? "Saving..."
                                    : "Grant Access"
                            }}
                        </BaseButton>
                    </template>
                </BaseModal>
            </AppTable>
        </div>
    </Authenticated>
</template>
<script setup>
import { ref, onMounted } from "vue";
import Authenticated from "../Dashboard Template/Layout/Authenticated.vue";
import PageHeader from "../Dashboard Template/Component/PageHeader.vue";
import AppTable from "../Dashboard Template/Component/AppTable.vue";
import BaseButton from "../Dashboard Template/Component/BaseButton.vue";
import BaseModal from "../Dashboard Template/Component/BaseModal.vue";
import { useAllowedEmailsStore } from "@/stores/allowedEmails";

const allowedEmailsStore = useAllowedEmailsStore();

// UI States
const isModalOpen = ref(false);
const newEmailInput = ref("");

// Fetch initial list on mount
onMounted(() => {
    if (allowedEmailsStore.fetchEmails) {
        allowedEmailsStore.fetchEmails();
    }
});

const openAddModal = () => {
    console.log("Opening Add Modal");
    newEmailInput.value = "";
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
};
</script>

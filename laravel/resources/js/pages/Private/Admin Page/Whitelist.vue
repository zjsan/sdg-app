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
                <pre class="bg-black text-green-400 p-2 text-xs">
Modal state: {{ isModalOpen }}</pre
                >
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
            </AppTable>
            <!-- Modal Component for Adding Rules -->
            <BaseModal :show="isModalOpen" @close="closeModal">
                <template #title> Authorize Portal Access </template>
                <div class="space-y-5 my-3">
                    <!-- Explanatory Alert Callout -->
                    <div
                        class="bg-indigo-50/60 border border-indigo-100 rounded-lg p-3 flex gap-3"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5 text-indigo-600 shrink-0 mt-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <p class="text-xs text-slate-600 leading-relaxed">
                            This system authenticates portal users via
                            <strong class="text-slate-900 font-semibold"
                                >Google Sign-In</strong
                            >. The exact Google account email must match a
                            whitelisted identity record here to log in.
                        </p>
                    </div>

                    <!-- Layout Formatting Example -->
                    <div
                        class="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2"
                    >
                        <span
                            class="text-[11px] font-bold uppercase tracking-wider text-slate-400 block"
                            >Required Format</span
                        >

                        <div
                            class="flex items-center justify-between text-xs py-1"
                        >
                            <span
                                class="font-mono bg-white border px-1.5 py-0.5 rounded shadow-sm text-slate-700"
                                >username@organization.com</span
                            >
                            <span class="text-slate-500 text-right"
                                >Explicit personal or workspace account</span
                            >
                        </div>
                    </div>

                    <!-- Input Field Container -->
                    <div>
                        <label
                            class="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2"
                        >
                            Authorized Google Email Address
                        </label>
                        <div class="relative">
                            <input
                                v-model="newEmailInput"
                                type="email"
                                autofocus
                                class="w-full pl-3 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none bg-white text-sm font-mono placeholder:text-slate-400 transition-all"
                                placeholder="e.g., username@organization.com"
                                @keyup.enter="handleSubmit"
                            />
                        </div>

                        <!-- Dynamic Live Error/Validation Helper text -->
                        <p
                            v-if="newEmailInput && !newEmailInput.includes('@')"
                            class="mt-1.5 text-xs text-red-500 flex items-center gap-1"
                        >
                            <span class="font-bold">⚠️</span> Enter a complete
                            email address containing an '@' symbol.
                        </p>
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
    allowedEmailsStore.fetchAllowedEmails();
});

const openAddModal = () => {
    console.log("Opening Add Modal");
    newEmailInput.value = "";
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
};

// const handleSubmit = async () => {
//     if (!newEmailInput.value.trim()) return;

//     try {
//         // Adapt this method signature to match your Pinia store's add method
//         await allowedEmailsStore.addEmail({ email: newEmailInput.value.trim() });
//         closeModal();
//     } catch (error) {
//         console.error("Failed to add email to whitelist:", error);
//     }
// };

// const confirmDelete = async (item) => {
//     if (confirm(`Are you sure you want to revoke access for ${item.email}?`)) {
//         try {
//             // Adapt this method signature to match your Pinia store's delete method
//             await allowedEmailsStore.deleteEmail(item.id);
//         } catch (error) {
//             console.error("Failed to revoke email access:", error);
//         }
//     }
// };
</script>

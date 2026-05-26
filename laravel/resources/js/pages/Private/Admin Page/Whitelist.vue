<template>
    <Authenticated>
        <div class="p-8 max-w-6xl mx-auto">
            <PageHeader>
                <template #title>Whitelist Management</template>
                <template #subtitle>
                    <span class="font-medium text-slate-700">
                        {{ filteredEmails.length }}
                    </span>
                    of {{ allowedEmailsStore.emails?.length || 0 }} authorized
                    identities mapped via Google Sign-In.
                </template>
            </PageHeader>

            <div
                class="flex justify-between items-center py-4 border-b border-slate-100 bg-slate-50/50 px-4 rounded-t-xl mt-6"
            >
                <div class="relative w-72">
                    <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Search by email, group, or role..."
                        class="w-full pl-3 pr-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white transition-all text-slate-700 placeholder:text-slate-400"
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

            <AppTable>
                <template #header>
                    <th
                        class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                    >
                        Whitelisted Identity
                    </th>
                    <th
                        class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                    >
                        Tenant Organization
                    </th>
                    <th
                        class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                    >
                        System Role
                    </th>
                    <th
                        class="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider"
                    >
                        Status Switch
                    </th>
                    <th
                        class="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider"
                    >
                        Actions
                    </th>
                </template>

                <template #body>
                    <tr v-if="filteredEmails.length === 0">
                        <td
                            colspan="5"
                            class="px-6 py-12 text-center text-sm text-slate-400 italic"
                        >
                            {{
                                allowedEmailsStore.loading
                                    ? "Synchronizing system registry..."
                                    : "No matching whitelisted credentials found."
                            }}
                        </td>
                    </tr>

                    <tr
                        v-for="item in filteredEmails"
                        :key="item.id"
                        class="hover:bg-slate-50/80 transition-colors border-b border-slate-100 last:border-0"
                    >
                        <td class="px-6 py-4">
                            <div class="flex items-center space-x-2.5">
                                <span
                                    class="p-1.5 bg-indigo-50 text-indigo-600 rounded-md text-[10px] font-bold uppercase tracking-wider"
                                >
                                    GGL
                                </span>
                                <span
                                    class="font-medium text-slate-900 font-mono text-sm"
                                >
                                    {{ item.email }}
                                </span>
                            </div>
                        </td>

                        <td
                            class="px-6 py-4 text-sm font-medium text-slate-700"
                        >
                            <div class="flex items-center gap-1.5">
                                <span
                                    class="w-2 h-2 rounded-full bg-sky-400"
                                ></span>
                                {{
                                    item.organization?.name ||
                                    `ID: ${item.organization_id} (Unresolved)`
                                }}
                            </div>
                        </td>

                        <td class="px-6 py-4">
                            <span
                                :class="[
                                    'inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold tracking-wide uppercase',
                                    item.role?.name?.toLowerCase() ===
                                    'developer'
                                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                        : item.role?.name?.toLowerCase() ===
                                            'admin'
                                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                          : 'bg-slate-100 text-slate-700 border border-slate-200',
                                ]"
                            >
                                {{
                                    item.role?.name ||
                                    `Role ID: ${item.role_id}`
                                }}
                            </span>
                        </td>

                        <td class="px-6 py-4 text-center">
                            <button
                                @click="handleToggleStatus(item)"
                                :disabled="statusChangingId === item.id"
                                class="inline-flex items-center gap-2 cursor-pointer disabled:opacity-50 outline-none"
                            >
                                <span
                                    :class="[
                                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-all duration-200',
                                        item.is_active
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                            : 'bg-rose-50 text-rose-700 border-rose-200',
                                    ]"
                                >
                                    <span
                                        :class="[
                                            'w-1.5 h-1.5 mr-1.5 rounded-full animate-pulse',
                                            item.is_active
                                                ? 'bg-emerald-500'
                                                : 'bg-rose-500',
                                        ]"
                                    ></span>
                                    {{
                                        item.is_active ? "Active" : "Suspended"
                                    }}
                                </span>
                            </button>
                        </td>

                        <td class="px-6 py-4 text-right">
                            <BaseButton
                                variant="danger"
                                size="sm"
                                @click="confirmDelete(item)"
                            >
                                Revoke
                            </BaseButton>
                        </td>
                    </tr>
                </template>
            </AppTable>

            <BaseModal :show="isModalOpen" @close="closeModal">
                <template #title> Authorize Portal Access </template>
                <div class="space-y-4 my-3 text-left">
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
                            This registers an explicit 1:1 user identity
                            mapping. The exact Google account email must match
                            this entry to successfully negotiate a session.
                        </p>
                    </div>

                    <div>
                        <label
                            class="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5"
                        >
                            Authorized Google Email Address
                        </label>
                        <input
                            v-model="form.email"
                            type="email"
                            autofocus
                            class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none bg-white text-sm font-mono placeholder:text-slate-400 transition-all"
                            placeholder="e.g., zdsantos@mmsu.edu.ph"
                            @keyup.enter="handleSubmit"
                        />
                        <p
                            v-if="form.email && !form.email.includes('@')"
                            class="mt-1.5 text-xs text-red-500 flex items-center gap-1"
                        >
                            <span class="font-bold">⚠️</span> Enter a complete
                            email configuration containing an '@' symbol.
                        </p>
                    </div>

                    <div>
                        <label
                            class="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5"
                        >
                            Assigned Tenant Organization (Power BI Source Scope)
                        </label>
                        <div class="relative">
                            <select
                                v-model="form.organization_id"
                                class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none bg-white text-sm text-slate-700 transition-all appearance-none cursor-pointer"
                            >
                                <option value="" disabled>
                                    -- Select Tenant Organization --
                                </option>
                                <option
                                    v-for="org in mockOrganizations"
                                    :key="org.id"
                                    :value="org.id"
                                >
                                    {{ org.name }}
                                </option>
                            </select>
                            <div
                                class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400"
                            >
                                <svg
                                    class="fill-current h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label
                            class="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5"
                        >
                            Functional System Role Permissions
                        </label>
                        <div class="relative">
                            <select
                                v-model="form.role_id"
                                class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none bg-white text-sm text-slate-700 transition-all appearance-none cursor-pointer"
                            >
                                <option value="" disabled>
                                    -- Select Functional Permission Level --
                                </option>
                                <option
                                    v-for="role in mockRoles"
                                    :key="role.id"
                                    :value="role.id"
                                >
                                    {{ role.name }}
                                </option>
                            </select>
                            <div
                                class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400"
                            >
                                <svg
                                    class="fill-current h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <template #actions>
                    <BaseButton variant="secondary" @click="closeModal">
                        Cancel
                    </BaseButton>
                    <BaseButton
                        :disabled="
                            allowedEmailsStore.loading ||
                            !form.email.includes('@') ||
                            !form.organization_id ||
                            !form.role_id
                        "
                        @click="handleSubmit"
                    >
                        {{
                            allowedEmailsStore.loading
                                ? "Saving Records..."
                                : "Grant System Access"
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

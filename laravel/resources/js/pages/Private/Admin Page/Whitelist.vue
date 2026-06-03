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
                v-if="successMessage"
                class="mt-4 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-sm flex items-center justify-between transition-all duration-300 ease-in"
            >
                <div class="flex items-center gap-2">
                    <span>✅</span>
                    <span>{{ successMessage }}</span>
                </div>
                <button
                    @click="successMessage = ''"
                    class="text-emerald-500 hover:text-emerald-700 font-bold"
                >
                    &times;
                </button>
            </div>

            <div
                v-if="errorMessage"
                class="mt-4 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-sm flex items-center justify-between transition-all duration-300 ease-in"
            >
                <div class="flex items-center gap-2">
                    <span class="font-medium">{{ errorMessage }}</span>
                </div>
                <button
                    @click="errorMessage = ''"
                    class="text-rose-500 hover:text-rose-700 font-bold"
                >
                    &times;
                </button>
            </div>

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
                        Organization
                    </th>
                    <th
                        class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                    >
                        System Role
                    </th>
                    <th
                        class="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider"
                    >
                        Status
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
                            <span
                                :class="[
                                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border selection:bg-transparent',
                                    item.is_active
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                        : 'bg-rose-50 text-rose-700 border-rose-200',
                                ]"
                            >
                                <span
                                    :class="[
                                        'w-1.5 h-1.5 mr-1.5 rounded-full',
                                        item.is_active
                                            ? 'bg-emerald-500'
                                            : 'bg-rose-500',
                                    ]"
                                ></span>
                                {{ item.is_active ? "Active" : "Suspended" }}
                            </span>
                        </td>

                        <td class="px-6 py-4 text-right">
                            <BaseButton
                                variant="secondary"
                                size="sm"
                                @click="openEditModal(item)"
                            >
                                Edit
                            </BaseButton>

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
                <template #title
                    >{{
                        isEditMode
                            ? "Modify Whitelist Privileges"
                            : "Authorize Portal Access"
                    }}
                </template>

                <div
                    v-if="modalErrorMessage"
                    class="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs font-medium"
                >
                    ⚠️ {{ modalErrorMessage }}
                </div>

                <form
                    id="whitelistForm"
                    @submit.prevent="handleSubmit"
                    class="space-y-4 my-3 text-left"
                >
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
                            placeholder="e.g., username@gmail.com"
                            required
                        />
                        <p
                            v-if="isEmailInvalid"
                            class="mt-1.5 text-xs text-red-500 flex items-center gap-1"
                        >
                            <span class="font-bold">⚠️</span> Please enter a
                            valid corporate or institutional email address
                            (e.g., name@domain.com).
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
                                required
                            >
                                <option value="" disabled>
                                    -- Select Tenant Organization --
                                </option>
                                <option
                                    v-for="org in dynamicOrganizations"
                                    :key="org.id"
                                    :value="org.id"
                                >
                                    {{ org.name }}
                                </option>
                            </select>
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
                                required
                            >
                                <option value="" disabled>
                                    -- Select Functional Permission Level --
                                </option>
                                <option
                                    v-for="role in dynamicRoles"
                                    :key="role.id"
                                    :value="role.id"
                                >
                                    {{ role.name }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div
                        v-if="isEditMode"
                        class="pt-4 border-t border-slate-100 flex items-center justify-between"
                    >
                        <div>
                            <label
                                class="block text-xs font-bold uppercase tracking-wide text-slate-700"
                                >Account Access State</label
                            >
                            <span class="text-[11px] text-slate-400"
                                >Suspended records lose direct system
                                authorization instantly.</span
                            >
                        </div>
                        <button
                            type="button"
                            @click="form.is_active = !form.is_active"
                            :class="[
                                'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                                form.is_active
                                    ? 'bg-indigo-600'
                                    : 'bg-slate-200',
                            ]"
                        >
                            <span
                                :class="[
                                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                                    form.is_active
                                        ? 'translate-x-5'
                                        : 'translate-x-0',
                                ]"
                            />
                        </button>
                    </div>
                </form>

                <template #actions>
                    <BaseButton
                        type="button"
                        variant="secondary"
                        @click="closeModal"
                    >
                        Cancel
                    </BaseButton>

                    <BaseButton
                        type="submit"
                        form="whitelistForm"
                        :disabled="allowedEmailsStore.loading"
                    >
                        {{
                            allowedEmailsStore.loading
                                ? "Saving Records..."
                                : isEditMode
                                  ? "Save Changes"
                                  : "Grant System Access"
                        }}
                    </BaseButton>
                </template>
            </BaseModal>
        </div>
    </Authenticated>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import Authenticated from "../Dashboard Template/Layout/Authenticated.vue";
import PageHeader from "../Dashboard Template/Component/PageHeader.vue";
import AppTable from "../Dashboard Template/Component/AppTable.vue";
import BaseButton from "../Dashboard Template/Component/BaseButton.vue";
import BaseModal from "../Dashboard Template/Component/BaseModal.vue";
import { useAllowedEmailsStore } from "@/stores/allowedEmails";
import { useLookupStore } from "@/stores/lookups";

const allowedEmailsStore = useAllowedEmailsStore();
const lookupStore = useLookupStore();

// Local UI Management States
const isModalOpen = ref(false);
const searchQuery = ref("");
const isEditMode = ref(false); //flag to track whether the form is in edit mode or add mode
const selectedId = ref(null); // capture the id of the emaiil being edited

// Component-level feedback states
const successMessage = ref("");
const errorMessage = ref("");
const modalErrorMessage = ref("");

// Form State conforming to Laravel FormRequest Validator requirements
const form = ref({
    email: "",
    organization_id: "",
    role_id: "",
    is_active: true,
});

// fetch initial data on component mount
onMounted(() => {
    allowedEmailsStore.fetchAllowedEmails().catch((err) => {
        errorMessage.value = err?.message || err || "Failed to load registry.";
    });
    lookupStore.fetchFormDependencies();
});

// email format validation using standard email validation regex pattern
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

//  Computed validation flag
const isEmailInvalid = computed(() => {
    // If the input is empty, let required handle it
    if (!form.value.email) return false;

    // Returns true if the email fails the regex test
    return !emailRegex.test(form.value.email);
});

// Read directly from the lookup store state arrays
const dynamicOrganizations = computed(() => lookupStore.organizations);
const dynamicRoles = computed(() => lookupStore.roles);

// substring search Filter logic operating cleanly on client-side state memory
const filteredEmails = computed(() => {
    const list = allowedEmailsStore.emails || [];
    const query = searchQuery.value.trim().toLowerCase();

    if (!query) return list;

    return list.filter((item) => {
        return (
            item.email.toLowerCase().includes(query) ||
            item.organization?.name?.toLowerCase().includes(query) ||
            item.role?.name?.toLowerCase().includes(query)
        );
    });
});

//modal control
const openAddModal = () => {
    isEditMode.value = false; //set to false when adding new email
    selectedId.value = null;
    modalErrorMessage.value = "";

    form.value = {
        email: "",
        organization_id: "",
        role_id: "",
        is_active: true,
    };
    isModalOpen.value = true;
};

const openEditModal = (item) => {
    isEditMode.value = true;
    selectedId.value = item.id;
    modalErrorMessage.value = "";

    form.value = {
        email: item.email,
        organization_id:
            item.organization_id != null ? Number(item.organization_id) : "",
        role_id: item.role_id != null ? Number(item.role_id) : "",
        is_active: !!item.is_active,
    };
    isModalOpen.value = true;
};
const closeModal = () => {
    isModalOpen.value = false;
    isEditMode.value = false;
    selectedId.value = null;
    modalErrorMessage.value = "";
};

// clear top-level alert systems automatically after a timeout
const flashSuccess = (msg) => {
    successMessage.value = msg;
    errorMessage.value = "";
    setTimeout(() => {
        successMessage.value = "";
    }, 5000);
};

// form submission
const handleSubmit = async () => {
    if (
        !form.value.email.trim() ||
        !form.value.organization_id ||
        !form.value.role_id
    )
        return;

    try {
        const payload = {
            ...form.value,
            email: form.value.email.trim().toLowerCase(),
            // Clean payload properties before passing off to Laravel API request cycle
            organization_id: Number(form.value.organization_id),
            role_id: Number(form.value.role_id),
        };

        //execute this block if on edit mode
        if (isEditMode.value && selectedId.value) {
            // Capture returned response safely
            const response = await allowedEmailsStore.updateAllowedEmails(
                selectedId.value,
                payload,
            );
            flashSuccess(
                response?.data?.message ||
                    response?.message ||
                    "Email updated successfully.",
            );
            closeModal();
            return;
        }

        //execute this block if on add mode
        const response = await allowedEmailsStore.addAllowedEmails(payload);
        flashSuccess(
            response?.data?.message ||
                response?.message ||
                "Email added successfully.",
        );
        closeModal();
    } catch (error) {
        // Render server validation/security failures straight into the active modal layout
        const errorText =
            error.response?.data?.message ||
            error.message ||
            "An unexpected error occurred.";
        modalErrorMessage.value = errorText;

        if (error.response && error.response.status === 422) {
            console.log(error.response.data.errors);
        }

        console.error("Submission sequence error:", error);
    }
};

//delete confirmation and execution
const confirmDelete = async (item) => {
    if (
        confirm(
            `Are you certain you wish to completely revoke systemic access for ${item.email}?`,
        )
    ) {
        try {
            const data = await allowedEmailsStore.deleteAllowedEmails(item.id);
            flashSuccess(
                data?.message || "Clearance rule successfully dropped.",
            );
        } catch (errorString) {
            errorMessage.value =
                errorString?.message ||
                errorString ||
                "Failed to revoke access.";
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }
};
</script>

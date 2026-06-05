<template>
    <Authenticated>
        <div class="p-8 max-w-6xl mx-auto">
            <PageHeader>
                <template #title>Whitelist Management</template>
                <template #subtitle>
                    <span class="font-semibold text-slate-900">
                        {{ filteredEmails.length }}
                    </span>
                    of {{ allowedEmailsStore.emails?.length || 0 }} authorized
                    identities mapped via Google Sign-In.
                </template>
            </PageHeader>

            <div class="space-y-3">
                <div
                    v-if="successMessage"
                    class="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center justify-between shadow-sm animate-in fade-in duration-200"
                >
                    <div class="flex items-center gap-2">
                        <span class="font-medium">{{ successMessage }}</span>
                    </div>
                    <button
                        @click="successMessage = ''"
                        class="text-emerald-400 hover:text-emerald-600 transition-colors text-lg font-semibold px-1"
                    >
                        &times;
                    </button>
                </div>

                <div
                    v-if="errorMessage"
                    class="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm flex items-center justify-between shadow-sm animate-in fade-in duration-200"
                >
                    <div class="flex items-center gap-2">
                        <span class="font-medium">{{ errorMessage }}</span>
                    </div>
                    <button
                        @click="errorMessage = ''"
                        class="text-rose-400 hover:text-rose-600 transition-colors text-lg font-semibold px-1"
                    >
                        &times;
                    </button>
                </div>
            </div>

            <div
                class="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden"
            >
                <div
                    class="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-slate-50/50 border-b border-slate-200/60"
                >
                    <div class="relative w-full sm:w-80">
                        <span
                            class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </span>
                        <input
                            v-model="searchQuery"
                            type="text"
                            placeholder="Search by email, group, or role..."
                            class="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white transition-all text-slate-700 placeholder:text-slate-400/90 shadow-inner"
                        />
                    </div>

                    <BaseButton
                        @click="openAddModal"
                        class="w-full sm:w-auto shadow-sm shadow-indigo-500/10"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-4 h-4 mr-2 -ml-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2.5"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        Authorize Access
                    </BaseButton>
                </div>

                <AppTable>
                    <template #header>
                        <TableHead
                            class="h-10 text-[11px] font-bold uppercase tracking-wider text-slate-500/90 pl-4"
                            >Whitelisted Identity</TableHead
                        >
                        <TableHead
                            class="h-10 text-[11px] font-bold uppercase tracking-wider text-slate-500/90"
                            >Organization</TableHead
                        >
                        <TableHead
                            class="h-10 text-[11px] font-bold uppercase tracking-wider text-slate-500/90"
                            >System Role</TableHead
                        >
                        <TableHead
                            class="h-10 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500/90"
                            >Status</TableHead
                        >
                        <TableHead
                            class="h-10 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500/90 pr-4"
                            >Actions</TableHead
                        >
                    </template>

                    <template #body>
                        <TableRow v-if="filteredEmails.length === 0">
                            <TableCell colspan="5" class="py-16 text-center">
                                <div
                                    class="flex flex-col items-center justify-center space-y-2"
                                >
                                    <template v-if="allowedEmailsStore.loading">
                                        <div
                                            class="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600"
                                        ></div>
                                        <p
                                            class="text-sm font-medium text-slate-500"
                                        >
                                            Synchronizing system registry...
                                        </p>
                                    </template>
                                    <template v-else>
                                        <p
                                            class="text-sm font-medium text-slate-600"
                                        >
                                            No matching whitelisted credentials
                                            found.
                                        </p>
                                        <p class="text-xs text-slate-400">
                                            Verify your search keywords or
                                            configure a new access rule.
                                        </p>
                                    </template>
                                </div>
                            </TableCell>
                        </TableRow>

                        <TableRow
                            v-else
                            v-for="item in filteredEmails"
                            :key="item.id"
                            class="hover:bg-slate-50/30 transition-colors group"
                        >
                            <TableCell class="py-3.5 pl-4">
                                <span
                                    class="font-mono text-[13px] font-medium text-slate-700 tracking-tight select-all"
                                >
                                    {{ item.email }}
                                </span>
                            </TableCell>

                            <TableCell class="py-3.5">
                                <div
                                    v-if="item.organization?.name"
                                    class="flex items-center gap-2 text-slate-600 text-[13px]"
                                >
                                    <span
                                        class="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-indigo-400 transition-colors"
                                    ></span>
                                    <span class="font-medium text-slate-700">{{
                                        item.organization.name
                                    }}</span>
                                </div>
                                <div
                                    v-else
                                    class="text-xs text-slate-400 italic font-normal"
                                >
                                    ID: {{ item.organization_id }}
                                    <span class="not-italic opacity-70"
                                        >(Unresolved Scope)</span
                                    >
                                </div>
                            </TableCell>

                            <TableCell class="py-3.5">
                                <span
                                    :class="[
                                        'inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium tracking-normal capitalize border transition-all',
                                        item.role?.name?.toLowerCase() ===
                                        'admin'
                                            ? 'bg-slate-900 text-white border-slate-900'
                                            : item.role?.name?.toLowerCase() ===
                                                'developer'
                                              ? 'bg-indigo-50/60 text-indigo-700 border-indigo-100'
                                              : 'bg-slate-50 text-slate-600 border-slate-200',
                                    ]"
                                >
                                    {{
                                        item.role?.name ||
                                        `Role ID: ${item.role_id}`
                                    }}
                                </span>
                            </TableCell>

                            <TableCell class="text-center py-3.5">
                                <span
                                    :class="[
                                        'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border/40',
                                        item.is_active
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                                            : 'bg-rose-50 text-rose-700 border-rose-200/60',
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
                                    {{
                                        item.is_active ? "Active" : "Suspended"
                                    }}
                                </span>
                            </TableCell>

                            <TableCell class="text-center py-3.5 pr-4">
                                <div
                                    class="flex items-center justify-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity"
                                >
                                    <button
                                        @click="openEditModal(item)"
                                        title="Edit item"
                                        class="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 transition-all cursor-pointer"
                                    >
                                        <i class="pi pi-file-edit text-xs"></i>
                                    </button>

                                    <button
                                        @click="confirmDelete(item)"
                                        title="Delete item"
                                        class="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 transition-all cursor-pointer"
                                    >
                                        <i class="pi pi-user-minus text-xs"></i>
                                    </button>
                                </div>
                            </TableCell>
                        </TableRow>
                    </template>
                </AppTable>

                <div
                    class="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-slate-50/40 border-t border-slate-200/80 gap-4"
                >
                    <div class="text-xs text-slate-500 font-medium">
                        Showing
                        <span class="text-slate-800 font-semibold">1</span> to
                        <span class="text-slate-800 font-semibold">{{
                            filteredEmails.length
                        }}</span>
                        of
                        <span class="text-slate-800 font-semibold">{{
                            filteredEmails.length
                        }}</span>
                        entries
                    </div>
                </div>
            </div>

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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

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
    console.log("Organizations in Store:", dynamicOrganizations.value);
    console.log("Item being edited:", item);

    const itemOrgId = item.organization?.id || item.organization_id;
    const itemRoleId = item.role?.id || item.role_id;

    isEditMode.value = true;
    selectedId.value = item.id;
    modalErrorMessage.value = "";

    // Find matching lookup types dynamically to guarantee strict equality matches
    const matchedOrg = dynamicOrganizations.value.find(
        (o) => String(o.id) === String(itemOrgId),
    );
    const matchedRole = dynamicRoles.value.find(
        (r) => String(r.id) === String(itemRoleId),
    );

    form.value = {
        email: item.email,
        organization_id: matchedOrg ? matchedOrg.id : "",
        role_id: matchedRole ? matchedRole.id : "",
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
        // clear any old UI validation state before firing a new request
        modalErrorMessage.value = "";

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
        // console.log("Full Axios Error Object:", error);
        // console.log("Server Response Data:", error.response?.data);

        // backend error messages, backend message, axious error message, or a fallback string
        const errorText =
            error.response?.data?.message ||
            error.message ||
            "An unexpected error occurred.";

        modalErrorMessage.value = errorText;

        //capture 422 validation errors
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
            // console.log("Full Axios Error Object:", errorString);
            // console.log("Server Response Data:", errorString.response?.data);
            errorMessage.value =
                errorString.response?.data?.message || errorString?.message;
            ("Failed to revoke access.");
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }
};
</script>

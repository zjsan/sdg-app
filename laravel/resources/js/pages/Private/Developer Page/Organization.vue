<template>
    <Authenticated>
        <div class="p-8 max-w-6xl mx-auto">
            <PageHeader>
                <template #title>Power BI Link Management</template>

                <template #subtitle>
                    Manage Power BI embed configurations across
                    <span class="font-semibold text-slate-700">
                        {{ organizations.totalItems }}
                    </span>
                    registered organizations.
                </template>
            </PageHeader>

            <!--UI success and error alert messages-->
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
                <!-- Toolbar -->
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

                        <Input
                            v-model="searchQuery"
                            type="text"
                            placeholder="Search organization..."
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

                        Add Organization
                    </BaseButton>
                </div>

                <!-- Table -->
                <AppTable>
                    <template #header>
                        <TableHead
                            class="h-10 text-[11px] font-bold uppercase tracking-wider text-slate-500/90 pl-4"
                        >
                            Organization
                        </TableHead>

                        <TableHead
                            class="h-10 text-[11px] font-bold uppercase tracking-wider text-slate-500/90"
                        >
                            Embed Configuration
                        </TableHead>

                        <TableHead
                            class="h-10 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500/90 pr-4"
                        >
                            Actions
                        </TableHead>
                    </template>

                    <template #body>
                        <!-- Empty State -->
                        <TableRow v-if="organizations.length === 0">
                            <TableCell colspan="3" class="py-16 text-center">
                                <div
                                    class="flex flex-col items-center justify-center space-y-2"
                                >
                                    <template v-if="organizationStore.loading">
                                        <div
                                            class="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600"
                                        ></div>

                                        <p
                                            class="text-sm font-medium text-slate-500"
                                        >
                                            Loading organizations...
                                        </p>
                                    </template>

                                    <template v-else>
                                        <p
                                            class="text-sm font-medium text-slate-600"
                                        >
                                            No organizations found.
                                        </p>

                                        <p class="text-xs text-slate-400">
                                            Add an organization to configure
                                            Power BI access.
                                        </p>
                                    </template>
                                </div>
                            </TableCell>
                        </TableRow>

                        <!-- Rows -->
                        <TableRow
                            v-for="org in organizations"
                            v-else
                            :key="org.id"
                            class="hover:bg-slate-50/30 transition-colors group"
                        >
                            <TableCell class="py-3.5 pl-4">
                                <div class="flex flex-col">
                                    <span
                                        class="font-medium text-[13px] text-slate-700"
                                    >
                                        {{ org.name }}
                                    </span>

                                    <span class="text-xs text-slate-400">
                                        ID: {{ org.id }}
                                    </span>
                                </div>
                            </TableCell>

                            <TableCell class="py-3.5">
                                <div
                                    v-if="org.pbi_embed_id"
                                    class="flex items-center gap-2"
                                >
                                    <span
                                        class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border bg-indigo-50/60 text-indigo-700 border-indigo-100 font-mono"
                                    >
                                        {{
                                            org.pbi_embed_id.length > 25
                                                ? org.pbi_embed_id.substring(
                                                      0,
                                                      25,
                                                  ) + "..."
                                                : org.pbi_embed_id
                                        }}
                                    </span>

                                    <button
                                        @click="
                                            copyToClipboard(org.pbi_embed_id)
                                        "
                                        title="Copy embed ID"
                                        class="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-all"
                                    >
                                        <i class="pi pi-copy text-xs"></i>
                                    </button>
                                </div>

                                <div
                                    v-else
                                    class="text-xs text-slate-400 italic"
                                >
                                    No embed configuration assigned.
                                </div>
                            </TableCell>

                            <TableCell class="text-center py-3.5 pr-4">
                                <div
                                    class="flex items-center justify-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity"
                                >
                                    <!--Edit button and form trigger-->
                                    <button
                                        @click="openEditModal(org)"
                                        title="Edit link"
                                        class="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 transition-all cursor-pointer"
                                    >
                                        <i class="pi pi-file-edit text-xs"></i>
                                    </button>

                                    <!--delete dialog box-->
                                    <AlertDialog>
                                        <AlertDialogTrigger as-child>
                                            <button
                                                @click="selectedOrgId = org.id"
                                                title="Delete organization"
                                                class="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 transition-all cursor-pointer"
                                            >
                                                <i
                                                    class="pi pi-trash text-xs"
                                                ></i>
                                            </button>
                                        </AlertDialogTrigger>

                                        <AlertDialogContent
                                            class="max-w-[400px]"
                                        >
                                            <AlertDialogHeader>
                                                <AlertDialogTitle
                                                    class="text-xl font-semibold text-slate-900"
                                                >
                                                    Delete Organization?
                                                </AlertDialogTitle>
                                                <AlertDialogDescription
                                                    class="text-sm text-slate-500 mt-2 leading-relaxed"
                                                >
                                                    This action cannot be
                                                    undone. This will
                                                    permanently delete the
                                                    organization and remove all
                                                    associated data from our
                                                    servers.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>

                                            <AlertDialogFooter
                                                class="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:gap-2"
                                            >
                                                <AlertDialogCancel
                                                    :disabled="isDeleting"
                                                    class="mt-0 cursor-pointer border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                                                >
                                                    Cancel
                                                </AlertDialogCancel>

                                                <AlertDialogAction
                                                    @click="executeDelete"
                                                    :disabled="isDeleting"
                                                    class="bg-rose-600 hover:bg-rose-700 text-white shadow-sm focus:ring-rose-500 transition-colors cursor-pointer disabled:opacity-70"
                                                >
                                                    <template v-if="isDeleting">
                                                        <i
                                                            class="pi pi-spinner animate-spin mr-2 text-xs"
                                                        ></i>
                                                        Deleting...
                                                    </template>
                                                    <template v-else>
                                                        Delete Organization
                                                    </template>
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </TableCell>
                        </TableRow>
                    </template>
                </AppTable>

                <!--pagination control-->
                <div
                    class="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-slate-50/40 border-t border-slate-200/80 gap-4"
                >
                    <div
                        class="text-xs text-slate-500 font-medium order-2 sm:order-1"
                    >
                        Showing
                        <span class="text-slate-800 font-semibold">{{
                            rangeStart
                        }}</span>
                        to
                        <span class="text-slate-800 font-semibold">{{
                            rangeEnd
                        }}</span>
                        of
                        <span class="text-slate-800 font-semibold">{{
                            totalItems
                        }}</span>
                        entries
                    </div>

                    <div
                        class="flex items-center gap-1.5 order-1 sm:order-2 w-full sm:w-auto justify-end"
                    >
                        <button
                            @click="prevPage"
                            :disabled="
                                currentPage === 1 || organizationStore.loading
                            "
                            class="inline-flex items-center justify-center min-w-8 h-8 px-2 rounded-lg border border-slate-200 bg-white text-slate-600 text-xs font-medium shadow-sm transition-all hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed cursor-pointer select-none"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="w-3.5 h-3.5 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                            Prev
                        </button>

                        <div class="hidden md:flex items-center gap-1">
                            <button
                                v-if="visiblePages[0] > 1"
                                @click="goToPage(1)"
                                :disabled="organizationStore.loading"
                                class="w-8 h-8 rounded-lg text-xs font-semibold border bg-white text-slate-600 border-slate-200 hover:bg-slate-50 disabled:opacity-50"
                            >
                                1
                            </button>

                            <span
                                v-if="visiblePages[0] > 2"
                                class="text-slate-400 text-xs px-1"
                                >...</span
                            >

                            <button
                                v-for="page in visiblePages"
                                :key="page"
                                @click="goToPage(page)"
                                :disabled="organizationStore.loading"
                                :class="[
                                    'w-8 h-8 rounded-lg text-xs font-semibold border transition-all cursor-pointer select-none',
                                    currentPage === page
                                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/10'
                                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 disabled:opacity-50',
                                ]"
                            >
                                {{ page }}
                            </button>

                            <span
                                v-if="
                                    visiblePages[visiblePages.length - 1] <
                                    lastPage - 1
                                "
                                class="text-slate-400 text-xs px-1"
                                >...</span
                            >

                            <button
                                v-if="
                                    visiblePages[visiblePages.length - 1] <
                                    lastPage
                                "
                                @click="goToPage(lastPage)"
                                :disabled="organizationStore.loading"
                                class="w-8 h-8 rounded-lg text-xs font-semibold border bg-white text-slate-600 border-slate-200 hover:bg-slate-50 disabled:opacity-50"
                            >
                                {{ lastPage }}
                            </button>
                        </div>

                        <span
                            class="text-xs font-medium text-slate-500 md:hidden px-2"
                        >
                            Page {{ currentPage }} of {{ lastPage }}
                        </span>

                        <button
                            @click="nextPage"
                            :disabled="
                                currentPage === lastPage ||
                                organizationStore.loading
                            "
                            class="inline-flex items-center justify-center min-w-8 h-8 px-2 rounded-lg border border-slate-200 bg-white text-slate-600 text-xs font-medium shadow-sm transition-all hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed cursor-pointer select-none"
                        >
                            Next
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="w-3.5 h-3.5 ml-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Modal -->
            <BaseModal :show="isModalOpen" @close="closeModal">
                <template #title>
                    {{
                        selectedOrg
                            ? "Update Embed Configuration"
                            : "Add New Organization"
                    }}
                </template>

                <form
                    id="orgForm"
                    @submit.prevent="handleSubmit"
                    class="space-y-5 my-3 text-left"
                >
                    <div class="space-y-5 my-3 text-left">
                        <div class="flex flex-col">
                            <label
                                class="text-sm font-medium text-slate-700 mb-1.5"
                            >
                                Organization Name
                            </label>

                            <Input
                                v-model="orgName"
                                type="text"
                                placeholder="e.g. CHED"
                                :class="[
                                    'h-10 px-3.5 bg-white text-slate-800 rounded-lg border shadow-sm transition-all outline-none',
                                    formErrors.name
                                        ? 'border-red-300 focus:ring-2 focus:ring-red-500/10 focus:border-red-500'
                                        : 'border-slate-200 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500',
                                ]"
                                required
                            />
                            <p
                                v-if="formErrors.name"
                                class="mt-1 text-xs text-red-600 font-medium"
                            >
                                {{ formErrors.name }}
                            </p>
                        </div>

                        <div class="flex flex-col">
                            <label
                                class="text-sm font-medium text-slate-700 mb-1.5"
                            >
                                Power BI Embed ID / URL
                            </label>

                            <textarea
                                v-model="editValue"
                                rows="5"
                                :class="[
                                    'w-full px-3.5 py-2.5 font-mono text-[13px] bg-white text-slate-800 rounded-lg border shadow-sm transition-all outline-none resize-none',
                                    formErrors.pbi_embed_id
                                        ? 'border-red-300 focus:ring-2 focus:ring-red-500/10 focus:border-red-500'
                                        : 'border-slate-200 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500',
                                ]"
                                placeholder="Paste Power BI embed ID..."
                                required
                            ></textarea>

                            <span class="mt-1.5 text-xs text-slate-400">
                                This value will be used when rendering the Power
                                BI report for the selected organization.
                            </span>
                            <p
                                v-if="formErrors.pbi_embed_id"
                                class="mt-1 text-xs text-red-600 font-medium"
                            >
                                {{ formErrors.pbi_embed_id }}
                            </p>
                        </div>
                    </div>
                </form>

                <template #actions>
                    <BaseButton variant="secondary" @click="closeModal">
                        Cancel
                    </BaseButton>

                    <BaseButton
                        type="submit"
                        form="orgForm"
                        :disabled="organizationStore.loading"
                    >
                        {{
                            organizationStore.loading
                                ? "Saving..."
                                : selectedOrg
                                  ? "Save Changes"
                                  : "Create Organization"
                        }}
                    </BaseButton>
                </template>
            </BaseModal>
        </div>
    </Authenticated>
</template>
<script setup>
import Authenticated from "../Dashboard Template/Layout/Authenticated.vue";
import { ref, onMounted, onUnmounted, watch } from "vue";
import { usePowerBiStore } from "../../../stores/powerBi.js";
import { useOrganizationStore } from "../../../stores/organization.js";
import PageHeader from "../Dashboard Template/Component/PageHeader.vue";
import AppTable from "../Dashboard Template/Component/AppTable.vue";
import BaseModal from "../Dashboard Template/Component/BaseModal.vue";
import BaseButton from "../Dashboard Template/Component/BaseButton.vue";
import debounce from "lodash/debounce"; //for debouncing search input
import { usePagination } from "@/composables/usePagination";
import { useNotification } from "@/composables/useNotification.js";
import { Input } from "@/components/ui/input";
import { storeToRefs } from "pinia";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const pbiStore = usePowerBiStore();
const organizationStore = useOrganizationStore();
const isModalOpen = ref(false);
const selectedOrg = ref(null); //if null means adding
const editValue = ref("");
const orgName = ref("");
const selectedOrgId = ref(null);
const searchQuery = ref("");

// Component-level feedback states
const {
    successMessage,
    errorMessage,
    flashSuccess,
    flashError,
    clearNotifications,
} = useNotification();

const modalErrorMessage = ref("");
const isDeleting = ref(false);
const hasError = ref(false); //for updating input styles for invalid input

//extract states from the store while maintaining reactivity
const { organizations } = storeToRefs(organizationStore);

const loadPage = async (pageNumber, searchKeyword = searchQuery.value) => {
    try {
        errorMessage.value = ""; //clear any existing error messages before attempting to load new data
        await organizationStore.fetchOrganizations(
            pageNumber,
            organizationStore.itemsPerPage,
            searchKeyword,
        );
    } catch (err) {
        errorMessage.value = err?.message || err || "Failed to load registry.";
    }
};

// Custom pagination composable to manage pagination state and logic
const {
    currentPage,
    lastPage,
    totalItems,
    isLoading,
    visiblePages,
    rangeStart,
    rangeEnd,
    prevPage,
    nextPage,
    goToPage,
} = usePagination(organizationStore, loadPage);

//debounced search function to limit API calls while typing in the search input
const debouncedSearch = debounce((targetQuery) => {
    loadPage(1, targetQuery);
}, 500);

//watch the searchQuery for changes and trigger the debounced search function
watch(searchQuery, (newVal, oldVal) => {
    //trim the search query to prevent unnecessary API calls on whitespace changes
    //fall back to empty string if newVal or oldVal is null or undefined to prevent errors
    const currentText = newVal?.trim() || "";
    const previousText = oldVal?.trim() || "";

    if (currentText === previousText) {
        return;
    }

    debouncedSearch(currentText);
});

onMounted(() => {
    loadPage(currentPage.value, searchQuery.value.trim() || "");
});

onUnmounted(() => {
    console.log(
        "Component unmounted, cancelling pending debounced search calls.",
    );
    debouncedSearch.cancel(); //cancel any pending debounce calls

    //cancel any api request upon unmount
    if (organizationStore.currentAbortController) {
        organizationStore.currentAbortController.abort();
    }
});

//for editing
const openEditModal = (org) => {
    selectedOrg.value = org;
    editValue.value = org.pbi_embed_id || ""; // Initialize with current value
    isModalOpen.value = true;
};

//adding
const openAddModal = () => {
    selectedOrg.value = null; // Ensure it's null
    editValue.value = ""; // Clear the input
    isModalOpen.value = true;
};

//local state tracking for field errors
const formErrors = ref({
    name: "",
    pbi_embed_id: "",
});

const validateForm = (isUpdate) => {
    const cleanOrgName = isUpdate
        ? selectedOrg.value?.name
        : orgName.value?.trim();
    const cleanOrgPBI = editValue.value?.trim();

    let validateError = false; //error flag

    //validation rules
    //cases in the name problem
    if (!isUpdate) {
        if (!cleanOrgName) {
            formErrors.value.name = "Organization name is required.";
            validateError = true;
        } else if (cleanOrgName.length < 3) {
            formErrors.value.name =
                "Organization name must be at least 3 characters.";
            validateError = true;
        } else if (cleanOrgName.length > 255) {
            formErrors.value.name =
                "Organization name cannot exceed 255 characters.";
            validateError = true;
        }
    }

    //cases for the power bi
    if (!cleanOrgPBI) {
        formErrors.value.pbi_embed_id = "Power BI Embed ID is required.";
        validateError = true;
    } else if (cleanOrgPBI.length < 10) {
        formErrors.value.pbi_embed_id =
            "Power BI Embed ID must be at least 10 characters.";
        validateError = true;
    } else if (cleanOrgPBI.length > 255) {
        formErrors.value.pbi_embed_id =
            "Power BI Embed ID cannot exceed 255 characters.";
        validateError = true;
    }

    return { cleanOrgName, cleanOrgPBI, validateError }; //returning the validated organization name and powerbi embed id
};

const resetForm = () => {
    selectedOrg.value = null;
    editValue.value = "";
    orgName.value = "";
};

const closeModal = () => {
    isModalOpen.value = false;
    hasError.value = false;
    formErrors.value = { name: "", pbi_embed_id: "" };
    resetForm();
};

const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        alert("Embed ID copied to clipboard!");
    } catch (err) {
        console.error("Failed to copy: ", err);
        alert("Failed to copy to clipboard.");
    }
};

const handleSubmit = async () => {
    //resetting flags before start of validation and crud execution
    clearNotifications();
    modalErrorMessage.value = "";
    hasError.value = false; //general error state for the inputs
    // hasErrorOrgName.value = false;
    // hasErrorPbi.value = false;
    formErrors.value = { name: "", pbi_embed_id: "" };

    const isUpdate = !!selectedOrg.value; //true if editing, false if adding
    const { cleanOrgName, cleanOrgPBI, validateError } = validateForm(isUpdate);

    //stop further execution if there are errors during the validation
    if (validateError) {
        hasError.value = true;
        return;
    }

    try {
        let response;

        //CRUD Execution Block
        if (isUpdate) {
            //update action
            response = await organizationStore.updateOrganizations(
                selectedOrg.value.id,
                cleanOrgPBI,
            );
            console.log("updated successfully");
        } else {
            //create action
            response = await organizationStore.createOrganization(
                cleanOrgName,
                cleanOrgPBI,
            );
            console.log("created successfully.");
        }

        //Backend Processes Execution Block
        const tasks = [organizationStore.fetchOrganizations()]; //always refresh org list after add/edit

        // only force refresh power bi link when the operation is update
        //this avoid uncessarry refresh
        if (isUpdate) {
            tasks.push(pbiStore.forceRefresh());
        }

        const refreshResults = await Promise.allSettled(tasks); //wait for all refresh tasks to complete

        //evaluating background tasks
        let refreshFailed = false;
        refreshResults.forEach((result, index) => {
            const taskLabel =
                index === 0 ? "Organization List" : "Power BI Link";
            if (result.status === "rejected") {
                console.error(`Failed to refresh ${taskLabel}:`, result.reason);
                refreshFailed = true;
            }
        });

        closeModal(); //close modal once form is properly submitted

        // If background tasks failed, append a warning to the success message
        if (refreshFailed) {
            flashSuccess(
                "Changes saved, but some data views are still updating in the background.",
            );
        } else {
            flashSuccess(
                response.data?.message ||
                    `${isUpdate ? "Updated" : "Added"} successfully.`,
            );
        }
    } catch (error) {
        console.error("Form submission failed:", error);

        if (error.response?.status === 422 && error.response?.data?.errors) {
            const laravelErrors = error.response.data.errors;

            // Map backend validation errors
            if (laravelErrors.name) {
                formErrors.value.name = laravelErrors.name[0]; // Take first rule error
            }
            if (laravelErrors.pbi_embed_id) {
                formErrors.value.pbi_embed_id = laravelErrors.pbi_embed_id[0];
            }
        } else {
            // backend error messages, backend message, axious error message, or a fallback string
            const errorText =
                error.response?.data?.message ||
                error.response?.data?.errors ||
                error.message ||
                "An unexpected error occurred.";

            modalErrorMessage.value = errorText;
        }
    }
};

//input watcher
watch([orgName, editValue], () => {
    hasError.value = false;
    modalErrorMessage.value = "";
    formErrors.value = { name: "", pbi_embed_id: "" };
});

const executeDelete = async () => {
    if (!selectedOrgId.value) return;

    isDeleting.value = true;
    clearNotifications();

    try {
        const data = await organizationStore.deleteOrganization(
            selectedOrgId.value,
        ); //call the delete action in the store
        flashSuccess(data?.message || "Organization successfully deleted.");

        // Reset state on successful execution
        selectedOrgId.value = null;
    } catch (error) {
        console.error("Component caught error:", error);

        const apiError =
            error.response?.data?.message ||
            error.message ||
            "Failed to revoke access.";

        flashError(apiError);
    } finally {
        isDeleting.value = false;
    }
};
</script>

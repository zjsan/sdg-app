<template>
    <Authenticated>
        <div class="p-8 max-w-6xl mx-auto">
            <!-- 1. Page Header -->
            <PageHeader>
                <template #title>Power BI Link Management</template>
                <template #subtitle>
                    <span class="font-medium text-slate-700">
                        {{ organizationStore.organizations.length }}
                    </span>
                    active organizations.
                </template>
            </PageHeader>

            <div
                class="flex justify-end py-4 border-b border-slate-100 flex justify-end bg-slate-50/50"
            >
                <BaseButton @click="openAddModal">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-5 h-5 mr-2 -ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                    </svg>
                    Add Organization
                </BaseButton>
            </div>

            <!-- 2. Reusable Table -->
            <AppTable>
                <template #header>
                    <th
                        class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                    >
                        Organization
                    </th>
                    <th
                        class="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                    >
                        Embed Configuration
                    </th>
                    <th
                        class="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider"
                    >
                        Action
                    </th>
                </template>

                <template #body>
                    <tr
                        v-for="org in organizationStore.organizations"
                        :key="org.id"
                        class="hover:bg-slate-50 transition-colors"
                    >
                        <td class="px-6 py-4">
                            <div class="font-semibold text-slate-900">
                                {{ org.name }}
                            </div>
                            <div class="text-xs text-slate-400">
                                ID: {{ org.id }}
                            </div>
                        </td>

                        <td class="px-6 py-4">
                            <div
                                v-if="org.pbi_embed_id"
                                class="flex items-center space-x-2"
                            >
                                <span
                                    class="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-mono"
                                >
                                    {{ org.pbi_embed_id.substring(0, 15) }}...
                                </span>
                                <button
                                    @click="copyToClipboard(org.pbi_embed_id)"
                                    class="text-xs text-blue-600 hover:text-indigo-800"
                                >
                                    Copy
                                </button>
                            </div>
                            <span v-else class="text-sm text-slate-400 italic"
                                >No link configured</span
                            >
                        </td>

                        <td class="px-6 py-4 text-right space-x-2">
                            <BaseButton
                                variant="secondary"
                                @click="openEditModal(org)"
                                >Edit Link</BaseButton
                            >
                            <BaseButton
                                variant="secondary"
                                @click="confirmDelete(org.id)"
                                >Delete</BaseButton
                            >
                        </td>
                    </tr>
                </template>
            </AppTable>

            <!-- 3. Reusable Modal -->
            <BaseModal :show="isModalOpen" @close="closeModal">
                <template #title>
                    {{
                        selectedOrg
                            ? "Update Embed Link"
                            : "Add New Organization"
                    }}
                </template>

                <span
                    v-if="selectedOrg"
                    class="text-sm text-slate-500 block mb-2"
                >
                    {{ "Editing Organization: " + selectedOrg.name }}
                </span>
                <div class="space-y-4">
                    <div v-if="!selectedOrg">
                        <label
                            class="block text-xs font-bold uppercase text-slate-400 mb-2"
                            >Organization Name</label
                        >
                        <input
                            v-model="orgName"
                            type="text"
                            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
                            placeholder="e.g. CHED"
                        />
                    </div>

                    <div>
                        <label
                            class="block text-xs font-bold uppercase text-slate-400 mb-2"
                            >Power BI Embed ID / URL</label
                        >
                        <textarea
                            v-model="editValue"
                            rows="4"
                            class="w-full px-3 py-2 font-mono text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
                        ></textarea>
                    </div>
                </div>

                <template #actions>
                    <BaseButton variant="secondary" @click="closeModal"
                        >Cancel</BaseButton
                    >
                    <BaseButton @click="handleSubmit">
                        {{
                            organizationStore.loading
                                ? "Processing..."
                                : selectedOrg
                                  ? "Save Changes"
                                  : "Create"
                        }}
                    </BaseButton>
                </template>
            </BaseModal>
        </div>
    </Authenticated>
</template>
<script setup>
import Authenticated from "../Dashboard Template/Layout/Authenticated.vue";
import { ref, onMounted } from "vue";
import { usePowerBiStore } from "../../../stores/powerBi.js";
import { useOrganizationStore } from "../../../stores/organization.js";
import PageHeader from "../Dashboard Template/Component/PageHeader.vue";
import AppTable from "../Dashboard Template/Component/AppTable.vue";
import BaseModal from "../Dashboard Template/Component/BaseModal.vue";
import BaseButton from "../Dashboard Template/Component/BaseButton.vue";
import debounce from "lodash/debounce"; //for debouncing search input
import { usePagination } from "@/composables/usePagination";

const pbiStore = usePowerBiStore();
const organizationStore = useOrganizationStore();
const isModalOpen = ref(false);
const selectedOrg = ref(null); //if null means adding
const editValue = ref("");
const orgName = ref("");
const selectedOrgId = ref(null);

// Component-level feedback states
const successMessage = ref("");
const errorMessage = ref("");

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

const resetForm = () => {
    selectedOrg.value = null;
    editValue.value = "";
    orgName.value = "";
};

const closeModal = () => {
    isModalOpen.value = false;
    selectedOrg.value = null;
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
    //  console.log("ID:", id, "New PBI ID:", newId);

    if (!editValue.value || (!selectedOrg.value && !orgName.value)) {
        alert("Please fill in all required fields.");
        return;
    }

    const isUpdate = !!selectedOrg.value; //true if editing, false if adding

    try {
        if (isUpdate) {
            //update action
            await organizationStore.UpdateOrganizations(
                selectedOrg.value.id,
                editValue.value,
            );
            console.log("updated successfully.");
        } else {
            //create action
            await organizationStore.createOrganization(
                orgName.value,
                editValue.value,
            );
            console.log("created successfully.");
            alert("Organization created successfully!");
        }
        closeModal(); //close modal once form is properly submitted
    } catch (error) {
        console.error("Error updating organization: ", error);
        alert("Failed to update organization. Please try again.");
        return; //exit on failure
    }

    const tasks = [organizationStore.fetchOrganizations()]; //always refresh org list after add/edit

    // only force refresh power bi link when the operation is update
    //this avoid uncessarry refresh
    if (isUpdate) {
        tasks.push(pbiStore.forceRefresh());
    }

    const refreshResults = await Promise.allSettled(tasks); //wait for all refresh tasks to complete

    //log corresponding result for each task
    refreshResults.forEach((result, index) => {
        const taskLabel = index === 0 ? "Organization List" : "Power BI Link";

        if (result.status === "rejected") {
            console.error(`Failed to refresh ${taskLabel}:`, result.reason);
            alert(`Failed to refresh ${taskLabel}`);
        } else {
            //if result status is fullfilled
            console.log(`${taskLabel} refreshed successfully.`);
            alert(`${taskLabel} refreshed successfully.`);
        }
    });
};

const confirmDelete = async (id) => {
    selectedOrgId.value = id; //store the ID of the organization to be deleted
    if (confirm("Are you sure you want to delete this organization?")) {
        await organizationStore.deleteOrganization(selectedOrgId.value); //call the delete action in the store
    }
};

onMounted(() => {
    organizationStore.fetchOrganizations();
});
</script>

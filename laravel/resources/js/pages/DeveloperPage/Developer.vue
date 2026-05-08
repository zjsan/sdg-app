<template>
    <Authenticated>
        <div class="p-8 max-w-6xl mx-auto">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-2xl font-bold text-slate-800">
                    Power BI Link Management
                </h1>
                <span class="text-sm text-slate-500"
                    >{{
                        organizationStore.organizations.length
                    }}
                    Organizations</span
                >
            </div>
            <button
                @click="openAddModal"
                class="inline-flex items-center px-3 py-1.5 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all cursor-pointer"
            >
                Add Organization
            </button>
            <div
                class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
            >
                <table class="min-w-full divide-y divide-slate-200">
                    <thead class="bg-slate-50">
                        <tr>
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
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-200">
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
                                        {{
                                            org.pbi_embed_id.substring(0, 15)
                                        }}...{{ org.pbi_embed_id.slice(-4) }}
                                    </span>
                                    <!-- A small "copy" button here would be a huge UX win -->
                                    <button
                                        @click="
                                            copyToClipboard(org.pbi_embed_id)
                                        "
                                        class="text-xs text-blue-600 hover:text-indigo-800 cursor-pointer transition-colors"
                                    >
                                        Copy
                                    </button>
                                </div>
                                <span
                                    v-else
                                    class="text-sm text-slate-400 italic"
                                    >No link configured</span
                                >
                            </td>
                            <td class="px-6 py-4 text-right">
                                <button
                                    @click="openEditModal(org)"
                                    class="inline-flex items-center px-3 py-1.5 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all cursor-pointer"
                                >
                                    Edit Link
                                </button>
                                <button
                                    @click="confirmDelete(org.id)"
                                    class="inline-flex items-center px-3 py-1.5 border border-slate-300 text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all cursor-pointer"
                                >
                                    Delete Organization
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <pre>
Debug Loading: {{ organizationStore.loading }} (Type: {{
                typeof organizationStore.loading
            }})</pre
        >
        <!-- Modal Backdrop -->
        <div
            v-if="isModalOpen"
            class="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
            <!-- Backdrop Blur -->
            <div
                class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                @click="closeModal"
            ></div>

            <!-- Modal Content -->
            <div
                class="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all"
            >
                <div class="p-6">
                    <div class="flex items-center justify-between mb-4">
                        <!--header-->
                        <h3 class="text-lg font-semibold text-slate-800">
                            {{
                                selectedOrg
                                    ? "Update Embed Link"
                                    : "Add New Organization"
                            }}
                        </h3>

                        <!--close icon-->
                        <button
                            @click="closeModal"
                            class="text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    <div class="mb-6">
                        <p
                            v-if="selectedOrg"
                            class="text-sm text-slate-500 mb-4"
                        >
                            Updating link for
                            <span class="font-bold text-slate-700">{{
                                selectedOrg?.name
                            }}</span>
                        </p>
                        <p v-else class="text-sm text-slate-500 mb-4">
                            Enter the details for the new organization.
                        </p>

                        <!--organization input when adding new organization-->
                        <div v-if="!selectedOrg" class="mb-4">
                            <label
                                class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2"
                            >
                                Organization Name
                            </label>
                            <input
                                v-model="orgName"
                                type="text"
                                class="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
                                placeholder="e.g. CHED"
                            />
                        </div>

                        <!--embed ID input for both add and edit-->
                        <label
                            class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2"
                        >
                            Power BI Embed ID / URL
                        </label>
                        <textarea
                            v-model="editValue"
                            rows="4"
                            class="w-full px-3 py-2 font-mono text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-slate-50"
                            placeholder="Paste the link here..."
                        ></textarea>
                        <p class="mt-2 text-xs text-slate-400">
                            Ensure the link includes the workspace and report
                            identifiers.
                        </p>
                    </div>

                    <!--action buttons-->
                    <div class="flex justify-end gap-3">
                        <button
                            @click="closeModal"
                            class="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            @click="handleSubmit"
                            class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-200 transition-all active:scale-95 cursor-pointer"
                        >
                            <span v-if="organizationStore.loading"
                                >Processing...</span
                            >

                            <span v-else>{{
                                selectedOrg
                                    ? "Save Changes"
                                    : "Create Organization"
                            }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Authenticated>
</template>
<script setup>
import Authenticated from "../Dashboard Template/Layout/Authenticated.vue";
import { ref, onMounted } from "vue";
import { usePowerBiStore } from "../../stores/powerBi.js";
import { useOrganizationStore } from "../../stores/organization.js";

const pbiStore = usePowerBiStore();
const organizationStore = useOrganizationStore();
const isModalOpen = ref(false);
const selectedOrg = ref(null); //if null means adding
const editValue = ref("");
const orgName = ref("");
const selectedOrgId = ref(null);

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

const closeModal = () => {
    isModalOpen.value = false;
    selectedOrg.value = null;
};

const testLink = (id) => {
    // POWER_BI_BASE_URL should ideally be an injected config or env variable
    const baseUrl = "https://app.powerbi.com/view?r=";
    window.open(`${baseUrl}${id}`, "_blank");
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

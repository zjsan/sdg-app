import { defineStore } from "pinia";
import api from "@/plugins/axios";

export const useOrganizationStore = defineStore("organization", {
    // other options...
    state: () => ({
        users: [],
        loading: false,
        errors: null,
    }),
    actions: {},
});

import { defineStore } from "pinia";
import api from "@/plugins/axios";

export const useAllowedEmailsStore = defineStore("allowedEmails", {
    state: () => ({
        emails: [],
        loading: false,
        errors: null,
    }),
    actions: {},
});

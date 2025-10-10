import { defineStore } from "pinia";
import api from "@/plugins/axios";

export const usePasswordResetStore = defineStore("passwordReset", {
    state: () => ({
        loading: false,
        message: "",
        error: "",
        // persist token/email if you want to keep them across route navigation
        token: null,
        email: null,
    }),

    actions: {
        setToken(token) {
            this.token = token || null;
        },
        setEmail(email) {
            this.email = email || null;
        },
        async requestReset(email) {
            this.loading = true;
            this.message = "";
            this.error = "";

            try {
                const { data } = await api.post("/forgot-password", { email });
                this.message =
                    data.message ||
                    "If the email exists, a reset link has been sent.";
                if (data.reset_token) {
                    this.token = data.reset_token;
                }
            } catch (err) {
                this.error =
                    err.response?.data?.message || "Failed to send reset link.";
            } finally {
                this.loading = false;
            }
        },

        async resetPassword(payload) {
            this.loading = true;
            this.message = "";
            this.error = "";

            try {
                const { data } = await api.post("/reset-password", payload);
                this.message = data.message || "Password reset successfully.";
                this.token = null;
                this.email = null;
            } catch (err) {
                this.error = err.response?.data?.message || "Reset failed.";
            } finally {
                this.loading = false;
            }
        },
    },
});

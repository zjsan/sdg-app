import { defineStore } from "pinia";
import api from "@/plugins/axios";

export const usePasswordResetStore = defineStore("passwordReset", {
    state: () => ({
        loading: false,
        message: "",
        error: "",
    }),

    actions: {
        async requestReset(email) {
            this.loading = true;
            this.message = "";
            this.error = "";

            try {
                const { data } = await api.post("/forgot-password", { email });
                this.message =
                    data.message ||
                    "If the email exists, a reset link has been sent.";
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
            } catch (err) {
                this.error = err.response?.data?.message || "Reset failed.";
            } finally {
                this.loading = false;
            }
        },
    },
});

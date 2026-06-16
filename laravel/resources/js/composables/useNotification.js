import { ref } from "vue";

//global variables for notification
const successMessage = ref("");
const errorMessage = ref("");
let timeoutId = null;

export function useNotification() {
    //state clearing after successful notifcation
    const clearNotifications = () => {
        successMessage.value = "";
        errorMessage.value = "";

        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
    };

    const flashSuccess = (msg, duration = 5000) => {
        clearNotifications(); //clear previous messages

        successMessage.value = msg;

        timeoutId = setTimeout(() => {
            successMessage.value = "";
        }, duration);
    };

    const flashError = (msg) => {
        clearNotifications();

        errorMessage.value = msg;

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return {
        successMessage,
        errorMessage,
        flashSuccess,
        flashError,
        clearNotifications,
    };
}

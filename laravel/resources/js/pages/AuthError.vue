<template>
    <AuthStatusLayout
        title="Authentication Error"
        message="Something went wrong while signing you in with Google. Please try again later or contact support if the issue persists."
        action-text="Back to Login"
        action-route="Login"
    />
</template>

<script setup>
import AuthStatusLayout from "../pages/AuthStatusLayout.vue";
</script>

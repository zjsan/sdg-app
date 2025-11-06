<template>
    <AuthStatusLayout
        title="Access Denied"
        message="Your account is not authorized to use this system. Please contact an administrator if you believe this is a mistake."
        action-text="Back to Login"
        action-route="Login"
    />
</template>

<script setup>
import AuthStatusLayout from "../pages/AuthStatusLayout.vue";
</script>

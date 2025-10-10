<template>
    <AdminAddUnits/>
</template>
<route lang="json">
{
  "meta": {
    "requiresAuth": true,
    "roles": ["admin"]
  }
}
</route>
<script setup>
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore()


console.log('user role', authStore.userRole)
</script>
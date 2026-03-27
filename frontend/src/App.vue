<script setup>
import { RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { onMounted } from 'vue'

const authStore = useAuthStore()

onMounted(async () => {
  // Initialize from localStorage
  authStore.initAuth()

  // If token exists, fetch fresh user from backend
  if (authStore.token) {
    try {
      await authStore.fetchUser()
    } catch (err) {
      authStore.logout()
    }
  }
})
</script>

<template>
  <RouterView />
</template>
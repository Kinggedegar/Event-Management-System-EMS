<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../../stores/auth'
import Attendee from '../../components/dashboard/AttendeeDashboard.vue'
import Organizer from '../../components/dashboard/OrganizerDashboard.vue'
import Admin from '../../components/dashboard/AdminDashboard.vue'

const authStore = useAuthStore()
const role = computed(() => authStore.user?.role || 'attendee')
</script>

<template>
  <div class="min-h-screen bg-gray-950">
    <Admin     v-if="role === 'admin'"     />
    <Organizer v-else-if="role === 'organizer'" />
    <Attendee  v-else                      />
  </div>
</template>
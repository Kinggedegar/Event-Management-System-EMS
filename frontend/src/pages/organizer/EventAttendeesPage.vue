<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Event Attendees</h1>
        <p class="text-muted-foreground">Manage attendees for this event</p>
      </div>
      <router-link :to="`/organizer/events/${$route.params.id}/edit`"
                   class="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Edit Event
      </router-link>
    </div>

    <!-- Event Info -->
    <div class="bg-card rounded-lg border p-6">
      <h2 class="text-lg font-semibold text-foreground mb-2">{{ event.title }}</h2>
      <p class="text-muted-foreground">{{ formatDate(event.date) }} • {{ event.location }}</p>
      <div class="mt-4 flex items-center gap-4">
        <span class="text-sm text-muted-foreground">Total Attendees: {{ attendees.length }}</span>
        <span class="text-sm text-muted-foreground">Capacity: {{ event.capacity }}</span>
      </div>
    </div>

    <!-- Attendees List -->
    <div class="bg-card rounded-lg border">
      <div class="p-6 border-b">
        <h3 class="text-lg font-semibold text-foreground">Registered Attendees</h3>
      </div>

      <div v-if="loading" class="p-6 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p class="text-muted-foreground mt-2">Loading attendees...</p>
      </div>

      <div v-else-if="attendees.length === 0" class="p-6 text-center text-muted-foreground">
        No attendees registered yet.
      </div>

      <div v-else class="divide-y">
        <div v-for="attendee in attendees" :key="attendee.id"
             class="p-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <span class="text-primary font-semibold">{{ attendee.name.charAt(0).toUpperCase() }}</span>
            </div>
            <div>
              <p class="font-medium text-foreground">{{ attendee.name }}</p>
              <p class="text-sm text-muted-foreground">{{ attendee.email }}</p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="text-right">
              <p class="text-sm font-medium text-foreground">{{ attendee.quantity }} ticket{{ attendee.quantity > 1 ? 's' : '' }}</p>
              <p class="text-sm text-muted-foreground">{{ formatDate(attendee.registration_date) }}</p>
            </div>

            <div class="flex items-center gap-2">
              <span :class="[
                'px-2 py-1 text-xs rounded-full',
                attendee.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                attendee.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              ]">
                {{ attendee.status }}
              </span>

              <button v-if="attendee.status === 'pending'"
                      @click="checkInAttendee(attendee.id)"
                      class="px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
                Check In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const event = ref({})
const attendees = ref([])
const loading = ref(true)

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const checkInAttendee = async (registrationId) => {
  try {
    await axios.put(`/api/registrations/${registrationId}/checkin`)
    // Refresh attendees list
    await fetchAttendees()
  } catch (error) {
    console.error('Error checking in attendee:', error)
  }
}

const fetchEvent = async () => {
  try {
    const response = await axios.get(`/api/events/${route.params.id}`)
    event.value = response.data
  } catch (error) {
    console.error('Error fetching event:', error)
  }
}

const fetchAttendees = async () => {
  try {
    loading.value = true
    const response = await axios.get(`/api/events/${route.params.id}/attendees`)
    attendees.value = response.data
  } catch (error) {
    console.error('Error fetching attendees:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchEvent()
  fetchAttendees()
})
</script>
<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-foreground">QR Scanner</h1>
      <p class="text-muted-foreground">Scan attendee tickets to check them in</p>
    </div>

    <!-- Event Selection -->
    <div class="bg-card border border-border rounded-xl p-6">
      <label class="block text-sm font-medium text-foreground mb-2">Select Event</label>
      <select 
        v-model="selectedEventId"
        class="w-full px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">Choose an event...</option>
        <option v-for="event in events" :key="event.id" :value="event.id">
          {{ event.title }} - {{ formatDate(event.event_date) }}
        </option>
      </select>
    </div>

    <!-- Manual Entry -->
    <div class="bg-card border border-border rounded-xl p-6">
      <h2 class="font-semibold text-foreground mb-4">Manual Check-in</h2>
      <form @submit.prevent="manualCheckIn" class="flex gap-2">
        <input 
          v-model="registrationId"
          type="text"
          placeholder="Enter registration ID or QR code"
          class="flex-1 px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button 
          type="submit"
          :disabled="!selectedEventId || !registrationId || checking"
          class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {{ checking ? 'Checking...' : 'Check In' }}
        </button>
      </form>
    </div>

    <!-- Scan Result -->
    <div v-if="scanResult" 
         :class="scanResult.success ? 'bg-green-500/10 border-green-500' : 'bg-red-500/10 border-red-500'"
         class="border rounded-xl p-6">
      <div class="flex items-center gap-3">
        <div :class="scanResult.success ? 'text-green-500' : 'text-red-500'">
          <svg v-if="scanResult.success" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg v-else class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 :class="scanResult.success ? 'text-green-700' : 'text-red-700'" class="font-semibold">
            {{ scanResult.success ? 'Check-in Successful!' : 'Check-in Failed' }}
          </h3>
          <p :class="scanResult.success ? 'text-green-600' : 'text-red-600'" class="text-sm">
            {{ scanResult.message }}
          </p>
        </div>
      </div>
      
      <div v-if="scanResult.success && scanResult.registration" class="mt-4 pt-4 border-t border-current/20">
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p class="text-muted-foreground">Attendee</p>
            <p class="font-medium text-foreground">{{ scanResult.registration.user_name }}</p>
          </div>
          <div>
            <p class="text-muted-foreground">Ticket</p>
            <p class="font-medium text-foreground">{{ scanResult.registration.ticket_name }}</p>
          </div>
          <div>
            <p class="text-muted-foreground">Quantity</p>
            <p class="font-medium text-foreground">{{ scanResult.registration.quantity }}</p>
          </div>
          <div>
            <p class="text-muted-foreground">Check-in Time</p>
            <p class="font-medium text-foreground">{{ formatTime(new Date()) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Check-ins -->
    <div class="bg-card border border-border rounded-xl">
      <div class="p-4 border-b border-border">
        <h2 class="font-semibold text-foreground">Recent Check-ins</h2>
      </div>
      <div class="p-4">
        <div v-if="recentCheckIns.length === 0" class="text-center py-4 text-muted-foreground">
          No check-ins yet
        </div>
        <div v-else class="space-y-2">
          <div v-for="checkIn in recentCheckIns" :key="checkIn.id"
               class="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div>
              <p class="font-medium text-foreground">{{ checkIn.user_name }}</p>
              <p class="text-sm text-muted-foreground">{{ checkIn.ticket_name }}</p>
            </div>
            <span class="text-sm text-muted-foreground">{{ checkIn.time }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const events = ref([])
const selectedEventId = ref('')
const registrationId = ref('')
const checking = ref(false)
const scanResult = ref(null)
const recentCheckIns = ref([])

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  })
}

const manualCheckIn = async () => {
  if (!selectedEventId.value || !registrationId.value) return
  
  checking.value = true
  scanResult.value = null
  
  try {
    const { data } = await api.post('/registrations/check-in', {
      registration_id: registrationId.value,
      event_id: selectedEventId.value
    })
    
    scanResult.value = {
      success: true,
      message: 'Attendee has been checked in successfully',
      registration: data.registration
    }
    
    recentCheckIns.value.unshift({
      id: data.registration.id,
      user_name: data.registration.user_name,
      ticket_name: data.registration.ticket_name,
      time: formatTime(new Date())
    })
    
    registrationId.value = ''
  } catch (error) {
    scanResult.value = {
      success: false,
      message: error.response?.data?.error || 'Failed to check in attendee'
    }
  } finally {
    checking.value = false
  }
}

const fetchEvents = async () => {
  try {
    const { data } = await api.get('/events/my-events')
    events.value = (data.events || []).filter(e => e.status === 'published')
  } catch (error) {
    console.error('Failed to fetch events:', error)
  }
}

onMounted(fetchEvents)
</script>

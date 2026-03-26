<template>
  <div class="space-y-6">
    <LoadingSpinner v-if="loading" />
    
    <template v-else-if="event">
      <!-- Header -->
      <div class="flex items-start justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 mb-2">
            <router-link to="/organizer/events" class="text-muted-foreground hover:text-foreground">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </router-link>
            <span :class="getStatusClass(event.status)" class="px-2 py-0.5 rounded-full text-xs font-medium capitalize">
              {{ event.status }}
            </span>
          </div>
          <h1 class="text-2xl font-bold text-foreground">{{ event.title }}</h1>
          <p class="text-muted-foreground">{{ formatDate(event.event_date) }} - {{ event.location }}</p>
        </div>
        <div class="flex gap-2">
          <router-link :to="`/organizer/events/${event.id}/edit`" 
                       class="inline-flex items-center gap-2 px-4 py-2 border border-input rounded-lg hover:bg-muted transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </router-link>
          <router-link :to="`/events/${event.id}`" target="_blank"
                       class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View Public Page
          </router-link>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-card border border-border rounded-xl p-4">
          <p class="text-sm text-muted-foreground">Total Registrations</p>
          <p class="text-2xl font-bold text-foreground">{{ stats.totalRegistrations }}</p>
        </div>
        <div class="bg-card border border-border rounded-xl p-4">
          <p class="text-sm text-muted-foreground">Tickets Sold</p>
          <p class="text-2xl font-bold text-foreground">{{ stats.ticketsSold }}</p>
        </div>
        <div class="bg-card border border-border rounded-xl p-4">
          <p class="text-sm text-muted-foreground">Revenue</p>
          <p class="text-2xl font-bold text-foreground">${{ stats.revenue.toFixed(2) }}</p>
        </div>
        <div class="bg-card border border-border rounded-xl p-4">
          <p class="text-sm text-muted-foreground">Check-ins</p>
          <p class="text-2xl font-bold text-foreground">{{ stats.checkedIn }}</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex gap-2 border-b border-border">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
            activeTab === tab.id 
              ? 'border-primary text-primary' 
              : 'border-transparent text-muted-foreground hover:text-foreground'
          ]"
        >
          {{ tab.name }}
        </button>
      </div>

      <!-- Tab Content -->
      <div v-if="activeTab === 'registrations'" class="bg-card border border-border rounded-xl">
        <div class="p-4 border-b border-border flex items-center justify-between">
          <h2 class="font-semibold text-foreground">Registrations</h2>
          <button @click="exportRegistrations" class="text-sm text-primary hover:underline">
            Export CSV
          </button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-muted/50">
              <tr>
                <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Attendee</th>
                <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Ticket</th>
                <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Qty</th>
                <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Amount</th>
                <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr v-for="reg in registrations" :key="reg.id" class="hover:bg-muted/30">
                <td class="px-4 py-3">
                  <div>
                    <p class="font-medium text-foreground">{{ reg.user_name }}</p>
                    <p class="text-sm text-muted-foreground">{{ reg.user_email }}</p>
                  </div>
                </td>
                <td class="px-4 py-3 text-foreground">{{ reg.ticket_name }}</td>
                <td class="px-4 py-3 text-foreground">{{ reg.quantity }}</td>
                <td class="px-4 py-3 text-foreground">${{ reg.total_amount?.toFixed(2) }}</td>
                <td class="px-4 py-3">
                  <span :class="getRegStatusClass(reg.status)" class="px-2 py-0.5 rounded-full text-xs font-medium capitalize">
                    {{ reg.status }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <button 
                    v-if="reg.status === 'confirmed'"
                    @click="checkInAttendee(reg.id)"
                    class="text-sm text-primary hover:underline"
                  >
                    Check In
                  </button>
                </td>
              </tr>
              <tr v-if="registrations.length === 0">
                <td colspan="6" class="px-4 py-8 text-center text-muted-foreground">
                  No registrations yet
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="activeTab === 'tickets'" class="bg-card border border-border rounded-xl p-6">
        <h2 class="font-semibold text-foreground mb-4">Ticket Types</h2>
        <div class="space-y-3">
          <div v-for="ticket in event.tickets" :key="ticket.id" 
               class="p-4 bg-muted/50 rounded-lg flex items-center justify-between">
            <div>
              <h3 class="font-medium text-foreground">{{ ticket.name }}</h3>
              <p class="text-sm text-muted-foreground">{{ ticket.description || 'No description' }}</p>
            </div>
            <div class="text-right">
              <p class="font-bold text-foreground">${{ ticket.price?.toFixed(2) }}</p>
              <p class="text-sm text-muted-foreground">{{ ticket.sold || 0 }} / {{ ticket.quantity }} sold</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'reviews'" class="bg-card border border-border rounded-xl p-6">
        <h2 class="font-semibold text-foreground mb-4">Reviews</h2>
        <div v-if="reviews.length === 0" class="text-center py-8 text-muted-foreground">
          No reviews yet
        </div>
        <div v-else class="space-y-4">
              <div v-for="review in reviews" :key="review.id" class="p-4 bg-muted/50 rounded-lg">
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <div class="flex">
                      <svg v-for="i in 5" :key="i" 
                           :class="i <= review.rating ? 'text-violet-400' : 'text-muted-foreground/30'"
                           class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </div>
                    <span class="font-medium text-foreground">{{ review.user_name }}</span>
                  </div>
                  <span class="text-sm text-muted-foreground">{{ formatDate(review.created_at) }}</span>
                </div>
                <p class="text-foreground">{{ review.comment }}</p>
              </div>
            </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const route = useRoute()

const loading = ref(true)
const event = ref(null)
const registrations = ref([])
const reviews = ref([])
const activeTab = ref('registrations')

const tabs = [
  { id: 'registrations', name: 'Registrations' },
  { id: 'tickets', name: 'Tickets' },
  { id: 'reviews', name: 'Reviews' }
]

const stats = ref({
  totalRegistrations: 0,
  ticketsSold: 0,
  revenue: 0,
  checkedIn: 0
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const getStatusClass = (status) => {
  const classes = {
    published: 'bg-green-500/10 text-green-600',
    draft: 'bg-gray-500/10 text-gray-600',
    cancelled: 'bg-red-500/10 text-red-600'
  }
  return classes[status] || 'bg-muted text-muted-foreground'
}

const getRegStatusClass = (status) => {
  const classes = {
    confirmed: 'bg-green-500/10 text-green-600',
    pending: 'bg-violet-500/10 text-violet-600',
    cancelled: 'bg-red-500/10 text-red-600',
    checked_in: 'bg-primary/10 text-primary'
  }
  return classes[status] || 'bg-muted text-muted-foreground'
}

const checkInAttendee = async (registrationId) => {
  try {
    await api.post(`/registrations/${registrationId}/check-in`)
    const reg = registrations.value.find(r => r.id === registrationId)
    if (reg) reg.status = 'checked_in'
    stats.value.checkedIn++
  } catch (error) {
    alert(error.response?.data?.error || 'Failed to check in attendee')
  }
}

const exportRegistrations = () => {
  const csv = [
    ['Name', 'Email', 'Ticket', 'Quantity', 'Amount', 'Status'].join(','),
    ...registrations.value.map(r => [
      r.user_name,
      r.user_email,
      r.ticket_name,
      r.quantity,
      r.total_amount,
      r.status
    ].join(','))
  ].join('\n')
  
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${event.value.title}-registrations.csv`
  a.click()
}

const fetchData = async () => {
  try {
    const eventId = route.params.id
    const [eventRes, regsRes, reviewsRes] = await Promise.all([
      api.get(`/events/${eventId}`),
      api.get(`/registrations/event/${eventId}`),
      api.get(`/reviews/event/${eventId}`)
    ])
    
    event.value = eventRes.data.event
    registrations.value = regsRes.data.registrations || []
    reviews.value = reviewsRes.data.reviews || []
    
    // Calculate stats
    stats.value = {
      totalRegistrations: registrations.value.length,
      ticketsSold: registrations.value.reduce((sum, r) => sum + r.quantity, 0),
      revenue: registrations.value.reduce((sum, r) => sum + (r.total_amount || 0), 0),
      checkedIn: registrations.value.filter(r => r.status === 'checked_in').length
    }
  } catch (error) {
    console.error('Failed to fetch event data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>

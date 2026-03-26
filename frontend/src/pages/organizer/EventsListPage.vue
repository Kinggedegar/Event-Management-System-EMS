<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-foreground">My Events</h1>
        <p class="text-muted-foreground">Manage all your events</p>
      </div>
      <router-link to="/organizer/events/create" 
                   class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Create Event
      </router-link>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-4">
      <div class="flex-1 min-w-[200px]">
        <input 
          v-model="searchQuery"
          type="text"
          placeholder="Search events..."
          class="w-full px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <select v-model="statusFilter" 
              class="px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
        <option value="">All Status</option>
        <option value="draft">Draft</option>
        <option value="published">Published</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </div>

    <LoadingSpinner v-if="loading" />
    
    <div v-else-if="filteredEvents.length === 0" class="text-center py-12">
      <svg class="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <h3 class="text-lg font-medium text-foreground mb-1">No events found</h3>
      <p class="text-muted-foreground mb-4">Create your first event to get started</p>
      <router-link to="/organizer/events/create" 
                   class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
        Create Event
      </router-link>
    </div>

    <div v-else class="space-y-4">
      <div v-for="event in filteredEvents" :key="event.id" 
           class="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors">
        <div class="flex flex-col md:flex-row">
          <div class="md:w-48 h-32 md:h-auto">
            <img 
              :src="event.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&h=200&fit=crop'" 
              :alt="event.title"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="flex-1 p-4">
            <div class="flex items-start justify-between gap-4">
              <div>
                <span :class="getStatusClass(event.status)" class="px-2 py-0.5 rounded-full text-xs font-medium capitalize">
                  {{ event.status }}
                </span>
                <h3 class="text-lg font-semibold text-foreground mt-2">{{ event.title }}</h3>
                <p class="text-sm text-muted-foreground line-clamp-2">{{ event.description }}</p>
              </div>
            </div>
            
            <div class="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <p class="text-muted-foreground">Date</p>
                <p class="font-medium text-foreground">{{ formatDate(event.event_date) }}</p>
              </div>
              <div>
                <p class="text-muted-foreground">Location</p>
                <p class="font-medium text-foreground truncate">{{ event.location || 'TBA' }}</p>
              </div>
              <div>
                <p class="text-muted-foreground">Registrations</p>
                <p class="font-medium text-foreground">{{ event.registration_count || 0 }}</p>
              </div>
              <div>
                <p class="text-muted-foreground">Revenue</p>
                <p class="font-medium text-foreground">${{ (event.revenue || 0).toFixed(2) }}</p>
              </div>
            </div>
            
            <div class="mt-4 flex flex-wrap gap-2">
              <router-link 
                :to="`/organizer/events/${event.id}`"
                class="inline-flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Details
              </router-link>
              
              <router-link 
                :to="`/organizer/events/${event.id}/edit`"
                class="inline-flex items-center gap-2 px-3 py-1.5 border border-input rounded-lg text-sm hover:bg-muted transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </router-link>
              
              <button 
                v-if="event.status === 'draft'"
                @click="publishEvent(event.id)"
                class="inline-flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Publish
              </button>
              
              <button 
                v-if="event.status !== 'cancelled'"
                @click="cancelEvent(event.id)"
                class="inline-flex items-center gap-2 px-3 py-1.5 text-red-600 border border-red-200 rounded-lg text-sm hover:bg-red-50 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const loading = ref(true)
const events = ref([])
const searchQuery = ref('')
const statusFilter = ref('')

const filteredEvents = computed(() => {
  return events.value.filter(event => {
    const matchesSearch = !searchQuery.value || 
      event.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = !statusFilter.value || event.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
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

const publishEvent = async (eventId) => {
  try {
    await api.put(`/events/${eventId}`, { status: 'published' })
    const event = events.value.find(e => e.id === eventId)
    if (event) event.status = 'published'
  } catch (error) {
    alert(error.response?.data?.error || 'Failed to publish event')
  }
}

const cancelEvent = async (eventId) => {
  if (!confirm('Are you sure you want to cancel this event?')) return
  
  try {
    await api.put(`/events/${eventId}`, { status: 'cancelled' })
    const event = events.value.find(e => e.id === eventId)
    if (event) event.status = 'cancelled'
  } catch (error) {
    alert(error.response?.data?.error || 'Failed to cancel event')
  }
}

const fetchEvents = async () => {
  try {
    const { data } = await api.get('/events/my-events')
    events.value = data.events || []
  } catch (error) {
    console.error('Failed to fetch events:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchEvents)
</script>

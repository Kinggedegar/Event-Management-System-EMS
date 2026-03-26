<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-foreground">Event Management</h1>
      <p class="text-muted-foreground">Review and moderate all platform events</p>
    </div>

    <!-- Toast -->
    <div v-if="toast.message" :class="`fixed top-6 right-6 z-50 px-4 py-2 rounded-lg shadow-lg ${toast.type === 'success' ? 'bg-violet-600 text-white' : 'bg-red-600 text-white'}`">
      {{ toast.message }}
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
      <select v-model="categoryFilter" 
              class="px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
        <option value="">All Categories</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
      </select>
    </div>

    <LoadingSpinner v-if="loading" />

    <div v-else class="space-y-4">
      <div v-for="event in filteredEvents" :key="event.id" 
           class="bg-card border border-border rounded-xl overflow-hidden">
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
                <div class="flex items-center gap-2 mb-1">
                  <span :class="getStatusClass(event.status)" class="px-2 py-0.5 rounded-full text-xs font-medium capitalize">
                    {{ event.status }}
                  </span>
                  <span v-if="event.featured" class="px-2 py-0.5 bg-violet-500/10 text-violet-600 rounded-full text-xs font-medium">
                    Featured
                  </span>
                </div>
                <h3 class="text-lg font-semibold text-foreground">{{ event.title }}</h3>
                <p class="text-sm text-muted-foreground">by {{ event.organizer_name }} ({{ event.organizer_email }})</p>
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
                :to="`/events/${event.id}`"
                target="_blank"
                class="inline-flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View
              </router-link>
              
                <button 
                v-if="!event.featured"
                @click="featureEvent(event.id)"
                class="inline-flex items-center gap-2 px-3 py-1.5 border border-violet-300 text-violet-600 rounded-lg text-sm hover:bg-violet-50 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Feature
              </button>
              
              <button 
                v-else
                @click="unfeatureEvent(event.id)"
                class="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-100 text-violet-700 rounded-lg text-sm hover:bg-violet-200 transition-colors"
              >
                Unfeature
              </button>
              
              <button 
                v-if="event.status === 'published'"
                @click="cancelEvent(event.id)"
                class="inline-flex items-center gap-2 px-3 py-1.5 text-red-600 border border-red-200 rounded-lg text-sm hover:bg-red-50 transition-colors"
              >
                Cancel Event
              </button>
              
              <button
                v-if="event.status === 'draft'"
                @click="approveEvent(event.id)"
                class="inline-flex items-center gap-2 px-3 py-1.5 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-500 transition-colors"
              >
                Approve
              </button>
              
              <button 
                @click="deleteEvent(event.id)"
                class="inline-flex items-center gap-2 px-3 py-1.5 text-red-600 border border-red-200 rounded-lg text-sm hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredEvents.length === 0" class="text-center py-12 text-muted-foreground">
        No events found
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
const categories = ref([])
const searchQuery = ref('')
const statusFilter = ref('')
const categoryFilter = ref('')
const toast = ref({ message: '', type: 'success' })

const showToast = (message, type = 'success', ms = 3000) => {
  toast.value.message = message
  toast.value.type = type
  setTimeout(() => {
    toast.value.message = ''
  }, ms)
}

const filteredEvents = computed(() => {
  return events.value.filter(event => {
    const matchesSearch = !searchQuery.value || 
      event.title?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = !statusFilter.value || event.status === statusFilter.value
    const matchesCategory = !categoryFilter.value || event.category_id === parseInt(categoryFilter.value)
    return matchesSearch && matchesStatus && matchesCategory
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

const featureEvent = async (eventId) => {
  try {
    await api.put(`/admin/events/${eventId}/feature`, { featured: true })
    const event = events.value.find(e => e.id === eventId)
    if (event) event.featured = true
  } catch (error) {
    alert(error.response?.data?.error || 'Failed to feature event')
  }
}

const unfeatureEvent = async (eventId) => {
  try {
    await api.put(`/admin/events/${eventId}/feature`, { featured: false })
    const event = events.value.find(e => e.id === eventId)
    if (event) event.featured = false
  } catch (error) {
    alert(error.response?.data?.error || 'Failed to unfeature event')
  }
}

const cancelEvent = async (eventId) => {
  if (!confirm('Are you sure you want to cancel this event?')) return
  
  try {
    await api.put(`/admin/events/${eventId}/status`, { status: 'cancelled' })
    const event = events.value.find(e => e.id === eventId)
    if (event) event.status = 'cancelled'
  } catch (error) {
    alert(error.response?.data?.error || 'Failed to cancel event')
  }
}

const approveEvent = async (eventId) => {
  if (!confirm('Approve this event and publish it to upcoming events?')) return

  try {
    // frontend should send 'published' which backend maps to 'active'
    await api.put(`/admin/events/${eventId}/status`, { status: 'published' })
    showToast('Event approved and published', 'success')
    await fetchData()
  } catch (error) {
    showToast(error.response?.data?.error || 'Failed to approve event', 'error')
  }
}

const deleteEvent = async (eventId) => {
  if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) return
  
  try {
    await api.delete(`/admin/events/${eventId}`)
    events.value = events.value.filter(e => e.id !== eventId)
  } catch (error) {
    alert(error.response?.data?.error || 'Failed to delete event')
  }
}

const fetchData = async () => {
  try {
    const [eventsRes, catsRes] = await Promise.all([
      api.get('/admin/events'),
      api.get('/categories')
    ])
    events.value = eventsRes.data.events || []
    categories.value = catsRes.data.categories || []
  } catch (error) {
    console.error('Failed to fetch data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>

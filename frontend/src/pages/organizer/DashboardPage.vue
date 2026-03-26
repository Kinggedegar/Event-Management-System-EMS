<template>
  <div class="space-y-6">
    <!-- Welcome -->
    <div class="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-6 shadow-sm">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-2xl font-bold">Welcome back</h1>
          <p class="text-white/80">Manage your events, track performance, and publish updates in one place.</p>
        </div>
        <div class="flex flex-wrap gap-3">
          <router-link
            to="/organizer/events/create"
            class="inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-violet-600 shadow-sm hover:bg-white"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Create Event
          </router-link>
          <router-link
            to="/organizer/events"
            class="inline-flex items-center gap-2 rounded-full border border-white/60 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
          >
            View Events
          </router-link>
        </div>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-card border border-border rounded-xl p-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p class="text-2xl font-bold text-foreground">{{ stats.totalEvents }}</p>
            <p class="text-sm text-muted-foreground">Total Events</p>
          </div>
        </div>
      </div>
      
      <div class="bg-card border border-border rounded-xl p-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <p class="text-2xl font-bold text-foreground">{{ stats.totalAttendees }}</p>
            <p class="text-sm text-muted-foreground">Total Attendees</p>
          </div>
        </div>
      </div>
      
      <div class="bg-card border border-border rounded-xl p-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-violet-500/10 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-2xl font-bold text-foreground">${{ stats.totalRevenue.toFixed(2) }}</p>
            <p class="text-sm text-muted-foreground">Total Revenue</p>
          </div>
        </div>
      </div>
      
      <div class="bg-card border border-border rounded-xl p-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <div>
            <p class="text-2xl font-bold text-foreground">{{ stats.avgRating.toFixed(1) }}</p>
            <p class="text-sm text-muted-foreground">Avg Rating</p>
          </div>
        </div>
      </div>
    </div>

    <!-- My Events -->
    <div class="bg-card border border-border rounded-xl">
      <div class="p-4 border-b border-border flex items-center justify-between">
        <h2 class="text-lg font-semibold text-foreground">My Events</h2>
        <router-link to="/organizer/events" class="text-sm text-primary hover:underline">View All</router-link>
      </div>
      <div class="p-4">
        <LoadingSpinner v-if="loading" />
        <div v-else-if="events.length === 0" class="text-center py-8">
          <svg class="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p class="text-muted-foreground mb-4">You haven't created any events yet</p>
          <router-link to="/organizer/events/create" class="text-primary hover:underline">Create your first event</router-link>
        </div>
        <div v-else class="space-y-3">
          <div v-for="event in events.slice(0, 5)" :key="event.id" 
               class="flex items-center gap-4 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
            <img :src="event.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&h=100&fit=crop'" 
                 :alt="event.title"
                 class="w-16 h-16 rounded-lg object-cover" />
            <div class="flex-1 min-w-0">
              <h3 class="font-medium text-foreground truncate">{{ event.title }}</h3>
              <p class="text-sm text-muted-foreground">{{ formatDate(event.event_date) }}</p>
            </div>
            <div class="text-right">
              <span :class="getStatusClass(event.status)" class="px-2 py-0.5 rounded-full text-xs font-medium capitalize">
                {{ event.status }}
              </span>
              <p class="text-sm text-muted-foreground mt-1">{{ event.registration_count || 0 }} registrations</p>
            </div>
            <router-link :to="`/organizer/events/${event.id}`" class="text-primary hover:text-primary/80">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <router-link to="/organizer/events/create" 
           class="bg-card border border-border rounded-xl p-4 hover:border-primary transition-colors group">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-violet-500/10 rounded-lg flex items-center justify-center group-hover:bg-violet-500/20 transition-colors">
            <svg class="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h3 class="font-medium text-foreground">Create Event</h3>
            <p class="text-sm text-muted-foreground">Launch a new event</p>
          </div>
        </div>
      </router-link>
      
      <router-link to="/organizer/scanner" 
                   class="bg-card border border-border rounded-xl p-4 hover:border-primary transition-colors group">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
            <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </div>
          <div>
            <h3 class="font-medium text-foreground">QR Scanner</h3>
            <p class="text-sm text-muted-foreground">Check-in attendees</p>
          </div>
        </div>
      </router-link>
      
      <router-link to="/organizer/analytics" 
                   class="bg-card border border-border rounded-xl p-4 hover:border-primary transition-colors group">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-violet-500/10 rounded-lg flex items-center justify-center group-hover:bg-violet-500/20 transition-colors">
            <svg class="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h3 class="font-medium text-foreground">Analytics</h3>
            <p class="text-sm text-muted-foreground">View performance metrics</p>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const loading = ref(true)
const events = ref([])
const stats = ref({
  totalEvents: 0,
  totalAttendees: 0,
  totalRevenue: 0,
  avgRating: 0
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

const fetchData = async () => {
  try {
    const [eventsRes, statsRes] = await Promise.all([
      api.get('/events/my-events'),
      api.get('/events/organizer-stats')
    ])
    events.value = eventsRes.data.events || []
    stats.value = statsRes.data || stats.value
  } catch (error) {
    console.error('Failed to fetch organizer data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>

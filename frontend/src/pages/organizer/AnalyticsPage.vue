<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-foreground">Analytics</h1>
      <p class="text-muted-foreground">Track your event performance</p>
    </div>

    <LoadingSpinner v-if="loading" />

    <template v-else>
      <!-- Overview Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-card border border-border rounded-xl p-4">
          <p class="text-sm text-muted-foreground">Total Events</p>
          <p class="text-3xl font-bold text-foreground">{{ stats.totalEvents }}</p>
          <p class="text-sm text-green-600">{{ stats.publishedEvents }} published</p>
        </div>
        <div class="bg-card border border-border rounded-xl p-4">
          <p class="text-sm text-muted-foreground">Total Attendees</p>
          <p class="text-3xl font-bold text-foreground">{{ stats.totalAttendees }}</p>
          <p class="text-sm text-muted-foreground">across all events</p>
        </div>
        <div class="bg-card border border-border rounded-xl p-4">
          <p class="text-sm text-muted-foreground">Total Revenue</p>
          <p class="text-3xl font-bold text-foreground">${{ stats.totalRevenue.toFixed(2) }}</p>
          <p class="text-sm text-muted-foreground">lifetime earnings</p>
        </div>
        <div class="bg-card border border-border rounded-xl p-4">
          <p class="text-sm text-muted-foreground">Avg. Rating</p>
          <p class="text-3xl font-bold text-foreground">{{ stats.avgRating.toFixed(1) }}</p>
          <div class="flex">
            <svg v-for="i in 5" :key="i" 
                 :class="i <= Math.round(stats.avgRating) ? 'text-violet-400' : 'text-muted-foreground/30'"
                 class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Revenue Chart -->
      <div class="bg-card border border-border rounded-xl p-6">
        <h2 class="text-lg font-semibold text-foreground mb-4">Revenue Over Time</h2>
        <div class="h-64 flex items-end gap-2">
          <div v-for="(month, index) in revenueData" :key="index" class="flex-1 flex flex-col items-center">
            <div 
              class="w-full bg-primary rounded-t transition-all hover:bg-primary/80"
              :style="{ height: `${(month.revenue / maxRevenue) * 100}%`, minHeight: month.revenue > 0 ? '4px' : '0' }"
            ></div>
            <span class="text-xs text-muted-foreground mt-2">{{ month.month }}</span>
          </div>
        </div>
      </div>

      <!-- Top Events -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-card border border-border rounded-xl p-6">
          <h2 class="text-lg font-semibold text-foreground mb-4">Top Events by Revenue</h2>
          <div class="space-y-3">
            <div v-for="event in topEventsByRevenue" :key="event.id" 
                 class="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div class="flex-1 min-w-0">
                <p class="font-medium text-foreground truncate">{{ event.title }}</p>
                <p class="text-sm text-muted-foreground">{{ event.registration_count }} registrations</p>
              </div>
              <p class="font-bold text-foreground">${{ event.revenue?.toFixed(2) }}</p>
            </div>
            <p v-if="topEventsByRevenue.length === 0" class="text-center py-4 text-muted-foreground">
              No events yet
            </p>
          </div>
        </div>

        <div class="bg-card border border-border rounded-xl p-6">
          <h2 class="text-lg font-semibold text-foreground mb-4">Top Events by Attendees</h2>
          <div class="space-y-3">
            <div v-for="event in topEventsByAttendees" :key="event.id" 
                 class="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div class="flex-1 min-w-0">
                <p class="font-medium text-foreground truncate">{{ event.title }}</p>
                <p class="text-sm text-muted-foreground">${{ event.revenue?.toFixed(2) }} revenue</p>
              </div>
              <p class="font-bold text-foreground">{{ event.registration_count }} attendees</p>
            </div>
            <p v-if="topEventsByAttendees.length === 0" class="text-center py-4 text-muted-foreground">
              No events yet
            </p>
          </div>
        </div>
      </div>

      <!-- Ticket Sales Distribution -->
      <div class="bg-card border border-border rounded-xl p-6">
        <h2 class="text-lg font-semibold text-foreground mb-4">Ticket Type Distribution</h2>
        <div class="flex items-center gap-8">
          <div class="flex-1 space-y-3">
            <div v-for="ticket in ticketDistribution" :key="ticket.name">
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm text-foreground">{{ ticket.name }}</span>
                <span class="text-sm text-muted-foreground">{{ ticket.percentage }}%</span>
              </div>
              <div class="h-2 bg-muted rounded-full overflow-hidden">
                <div class="h-full bg-primary rounded-full" :style="{ width: `${ticket.percentage}%` }"></div>
              </div>
            </div>
            <p v-if="ticketDistribution.length === 0" class="text-center py-4 text-muted-foreground">
              No ticket data yet
            </p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const loading = ref(true)
const stats = ref({
  totalEvents: 0,
  publishedEvents: 0,
  totalAttendees: 0,
  totalRevenue: 0,
  avgRating: 0
})

const events = ref([])
const revenueData = ref([])
const ticketDistribution = ref([])

const maxRevenue = computed(() => {
  return Math.max(...revenueData.value.map(m => m.revenue), 1)
})

const topEventsByRevenue = computed(() => {
  return [...events.value]
    .sort((a, b) => (b.revenue || 0) - (a.revenue || 0))
    .slice(0, 5)
})

const topEventsByAttendees = computed(() => {
  return [...events.value]
    .sort((a, b) => (b.registration_count || 0) - (a.registration_count || 0))
    .slice(0, 5)
})

const fetchAnalytics = async () => {
  try {
    const [eventsRes, statsRes] = await Promise.all([
      api.get('/events/my-events'),
      api.get('/events/organizer-stats')
    ])
    
    events.value = eventsRes.data.events || []
    stats.value = {
      totalEvents: events.value.length,
      publishedEvents: events.value.filter(e => e.status === 'published').length,
      totalAttendees: statsRes.data?.totalAttendees || 0,
      totalRevenue: statsRes.data?.totalRevenue || 0,
      avgRating: statsRes.data?.avgRating || 0
    }
    
    // Generate mock monthly revenue data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    revenueData.value = months.map((month, i) => ({
      month,
      revenue: Math.random() * stats.value.totalRevenue * 0.3
    }))
    
    // Generate mock ticket distribution
    ticketDistribution.value = [
      { name: 'General Admission', percentage: 60 },
      { name: 'VIP', percentage: 25 },
      { name: 'Early Bird', percentage: 15 }
    ]
  } catch (error) {
    console.error('Failed to fetch analytics:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchAnalytics)
</script>

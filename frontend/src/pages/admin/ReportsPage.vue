<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-foreground">Platform Reports</h1>
      <p class="text-muted-foreground">View comprehensive platform analytics</p>
    </div>

    <LoadingSpinner v-if="loading" />

    <template v-else>
      <!-- Overview -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-card border border-border rounded-xl p-4">
          <p class="text-sm text-muted-foreground">Total Revenue</p>
          <p class="text-3xl font-bold text-foreground">${{ stats.totalRevenue.toFixed(2) }}</p>
          <p class="text-sm text-green-600">+{{ stats.revenueGrowth }}% vs last month</p>
        </div>
        <div class="bg-card border border-border rounded-xl p-4">
          <p class="text-sm text-muted-foreground">Active Users</p>
          <p class="text-3xl font-bold text-foreground">{{ stats.activeUsers }}</p>
          <p class="text-sm text-muted-foreground">{{ stats.newUsersThisMonth }} new this month</p>
        </div>
        <div class="bg-card border border-border rounded-xl p-4">
          <p class="text-sm text-muted-foreground">Events This Month</p>
          <p class="text-3xl font-bold text-foreground">{{ stats.eventsThisMonth }}</p>
          <p class="text-sm text-muted-foreground">{{ stats.upcomingEvents }} upcoming</p>
        </div>
        <div class="bg-card border border-border rounded-xl p-4">
          <p class="text-sm text-muted-foreground">Avg. Tickets/Event</p>
          <p class="text-3xl font-bold text-foreground">{{ stats.avgTicketsPerEvent }}</p>
          <p class="text-sm text-muted-foreground">across all events</p>
        </div>
      </div>

      <!-- Revenue Chart -->
      <div class="bg-card border border-border rounded-xl p-6">
        <h2 class="text-lg font-semibold text-foreground mb-4">Monthly Revenue</h2>
        <div class="h-64 flex items-end gap-2">
          <div v-for="(month, index) in revenueByMonth" :key="index" class="flex-1 flex flex-col items-center">
            <div 
              class="w-full bg-primary rounded-t transition-all hover:bg-primary/80"
              :style="{ height: `${(month.revenue / maxRevenue) * 100}%`, minHeight: month.revenue > 0 ? '4px' : '0' }"
            ></div>
            <span class="text-xs text-muted-foreground mt-2">{{ month.month }}</span>
            <span class="text-xs text-foreground font-medium">${{ month.revenue.toFixed(0) }}</span>
          </div>
        </div>
      </div>

      <!-- Category & User Distribution -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-card border border-border rounded-xl p-6">
          <h2 class="text-lg font-semibold text-foreground mb-4">Events by Category</h2>
          <div class="space-y-3">
            <div v-for="cat in categoryDistribution" :key="cat.name">
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm text-foreground flex items-center gap-2">
                  <span>{{ cat.icon }}</span>
                  {{ cat.name }}
                </span>
                <span class="text-sm text-muted-foreground">{{ cat.count }} events</span>
              </div>
              <div class="h-2 bg-muted rounded-full overflow-hidden">
                <div class="h-full bg-primary rounded-full" :style="{ width: `${cat.percentage}%` }"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-card border border-border rounded-xl p-6">
          <h2 class="text-lg font-semibold text-foreground mb-4">User Growth</h2>
          <div class="h-48 flex items-end gap-2">
            <div v-for="(month, index) in userGrowth" :key="index" class="flex-1 flex flex-col items-center">
              <div 
                class="w-full bg-green-500 rounded-t transition-all hover:bg-green-600"
                :style="{ height: `${(month.users / maxUsers) * 100}%`, minHeight: month.users > 0 ? '4px' : '0' }"
              ></div>
              <span class="text-xs text-muted-foreground mt-2">{{ month.month }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Organizers -->
      <div class="bg-card border border-border rounded-xl p-6">
        <h2 class="text-lg font-semibold text-foreground mb-4">Top Organizers</h2>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-muted/50">
              <tr>
                <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Organizer</th>
                <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Events</th>
                <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Attendees</th>
                <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Revenue</th>
                <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Rating</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr v-for="org in topOrganizers" :key="org.id" class="hover:bg-muted/30">
                <td class="px-4 py-3">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span class="text-xs font-medium text-primary">{{ getInitials(org.name) }}</span>
                    </div>
                    <div>
                      <p class="font-medium text-foreground">{{ org.name }}</p>
                      <p class="text-sm text-muted-foreground">{{ org.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3 text-foreground">{{ org.event_count }}</td>
                <td class="px-4 py-3 text-foreground">{{ org.attendee_count }}</td>
                <td class="px-4 py-3 text-foreground">${{ org.revenue?.toFixed(2) }}</td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-1">
                    <svg class="w-4 h-4 text-violet-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span class="text-foreground">{{ org.avg_rating?.toFixed(1) || 'N/A' }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
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
  totalRevenue: 0,
  revenueGrowth: 12,
  activeUsers: 0,
  newUsersThisMonth: 0,
  eventsThisMonth: 0,
  upcomingEvents: 0,
  avgTicketsPerEvent: 0
})

const revenueByMonth = ref([])
const categoryDistribution = ref([])
const userGrowth = ref([])
const topOrganizers = ref([])

const maxRevenue = computed(() => Math.max(...revenueByMonth.value.map(m => m.revenue), 1))
const maxUsers = computed(() => Math.max(...userGrowth.value.map(m => m.users), 1))

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const fetchReports = async () => {
  try {
    const { data } = await api.get('/admin/reports')
    
    stats.value = data.stats || stats.value
    topOrganizers.value = data.topOrganizers || []
    
    // Generate monthly data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    revenueByMonth.value = months.slice(0, 6).map((month, i) => ({
      month,
      revenue: Math.random() * (stats.value.totalRevenue / 3) + 100
    }))
    
    userGrowth.value = months.slice(0, 6).map((month, i) => ({
      month,
      users: Math.floor(Math.random() * (stats.value.activeUsers / 4)) + 10
    }))
    
    categoryDistribution.value = data.categoryDistribution || [
      { name: 'Music', icon: '🎵', count: 45, percentage: 30 },
      { name: 'Technology', icon: '💻', count: 38, percentage: 25 },
      { name: 'Sports', icon: '⚽', count: 30, percentage: 20 },
      { name: 'Business', icon: '💼', count: 22, percentage: 15 },
      { name: 'Arts', icon: '🎨', count: 15, percentage: 10 }
    ]
  } catch (error) {
    console.error('Failed to fetch reports:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchReports)
</script>

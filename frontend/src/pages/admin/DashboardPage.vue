<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Dashboard</h1>
        <p class="text-muted-foreground">Welcome back, {{ displayName }}. Here’s an overview of your platform.</p>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <div class="relative w-full sm:w-72">
          <input
            v-model="search"
            type="text"
            placeholder="Search users, events, or reports"
            class="w-full rounded-full bg-card border border-border px-10 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m1.6-4.15a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <button class="h-10 w-10 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground transition" aria-label="Notifications">
          <svg class="mx-auto h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 11-6 0h6z" />
          </svg>
        </button>

        <button class="h-10 w-10 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground transition" aria-label="Settings">
          <svg class="mx-auto h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-2.21 0-4 .79-4 2v4c0 1.21 1.79 2 4 2s4-.79 4-2v-4c0-1.21-1.79-2-4-2zm7 3v2l2 1v4l-2 1v2l-4 1-2-1-2 1-4-1v-2l-2-1v-4l2-1v-2l4-1 2 1 2-1 4 1z" />
          </svg>
        </button>

        <div class="flex items-center gap-2 rounded-full border border-border bg-card px-2 py-1">
          <div class="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
            {{ initials }}
          </div>
          <div class="hidden sm:block">
            <p class="text-xs font-semibold text-foreground">{{ displayName }}</p>
            <p class="text-[10px] text-muted-foreground">Admin</p>
          </div>
        </div>
      </div>
    </div>

    <LoadingSpinner v-if="loading" />

    <template v-else>
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div class="lg:col-span-8 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-card border border-border rounded-2xl p-4 shadow-sm">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-full bg-fuchsia-100 text-fuchsia-600 flex items-center justify-center">&#9679;</div>
                <div>
                  <p class="text-sm text-muted-foreground">Upcoming Events</p>
                  <p class="text-2xl font-bold text-foreground">{{ stats.upcomingEvents }}</p>
                </div>
              </div>
            </div>

            <div class="bg-card border border-border rounded-2xl p-4 shadow-sm">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">&#9679;</div>
                <div>
                  <p class="text-sm text-muted-foreground">Total Bookings</p>
                  <p class="text-2xl font-bold text-foreground">{{ stats.totalBookings }}</p>
                </div>
              </div>
            </div>

            <div class="bg-card border border-border rounded-2xl p-4 shadow-sm">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">&#9679;</div>
                <div>
                  <p class="text-sm text-muted-foreground">Tickets Sold</p>
                  <p class="text-2xl font-bold text-foreground">{{ stats.ticketsSold }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-semibold text-foreground">Ticket Sales</h2>
                <span class="text-xs text-muted-foreground">This week</span>
              </div>

              <div class="relative h-52">
                <canvas ref="ticketChartRef" class="h-52"></canvas>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                  <p class="text-xs text-muted-foreground">Total Tickets</p>
                  <p class="text-2xl font-bold text-foreground">{{ stats.ticketTotal }}</p>
                </div>
              </div>

              <div class="mt-4 space-y-2 text-sm">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="h-2 w-2 rounded-full bg-fuchsia-500"></span>
                    <span class="text-muted-foreground">Sold out</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-foreground">{{ stats.soldOut }}</span>
                    <span class="text-xs text-muted-foreground">45%</span>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="h-2 w-2 rounded-full bg-slate-800"></span>
                    <span class="text-muted-foreground">Fully booked</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-foreground">{{ stats.fullyBooked }}</span>
                    <span class="text-xs text-muted-foreground">30%</span>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="h-2 w-2 rounded-full bg-gray-300"></span>
                    <span class="text-muted-foreground">Available</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-foreground">{{ stats.available }}</span>
                    <span class="text-xs text-muted-foreground">25%</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <div class="flex items-center justify-between mb-1">
                <h2 class="text-lg font-semibold text-foreground">Sales Revenue</h2>
                <span class="text-xs text-muted-foreground">Last 8 months</span>
              </div>
              <p class="text-sm text-muted-foreground">Total revenue</p>
              <div class="flex items-end justify-between mb-4">
                <p class="text-2xl font-bold text-foreground">${{ stats.totalRevenue.toLocaleString() }}</p>
                <p class="text-sm text-emerald-600 font-medium">This month ${{ stats.revenueThisMonth.toLocaleString() }}</p>
              </div>
              <div class="h-48">
                <canvas ref="revenueChartRef" class="h-48"></canvas>
              </div>
            </div>
          </div>

          <div class="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-foreground">Popular Categories</h2>
              <span class="text-xs text-muted-foreground">Top segments</span>
            </div>

            <div class="space-y-4">
              <div v-for="event in popularEvents" :key="event.name" class="space-y-2">
                <div class="flex items-center justify-between text-sm">
                  <div class="flex items-center gap-3">
                    <span class="h-2 w-2 rounded-full" :class="event.dot"></span>
                    <span class="text-foreground">{{ event.name }}</span>
                  </div>
                  <span class="text-muted-foreground">{{ event.count.toLocaleString() }} Events</span>
                </div>
                <div class="h-2 w-full rounded-full bg-muted">
                  <div class="h-2 rounded-full" :class="event.bar" :style="{ width: event.percent + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-4 space-y-6">
          <div class="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div class="p-4 flex items-center justify-between">
              <h2 class="text-lg font-semibold text-foreground">Upcoming Event</h2>
              <button class="text-muted-foreground">...</button>
            </div>
            <img :src="upcomingEvent.image" :alt="upcomingEvent.title" class="h-40 w-full object-cover" />
            <div class="p-4 space-y-3">
              <span class="inline-flex items-center rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs">{{ upcomingEvent.category }}</span>
              <h3 class="text-lg font-semibold text-foreground">{{ upcomingEvent.title }}</h3>
              <p class="text-sm text-muted-foreground">{{ upcomingEvent.location }}</p>
              <p class="text-sm text-muted-foreground line-clamp-3">{{ upcomingEvent.description }}</p>
              <div class="flex items-center justify-between">
                <div class="text-xs text-muted-foreground">
                  {{ upcomingEvent.date }} | {{ upcomingEvent.time }}
                </div>
                <button class="rounded-full bg-primary px-4 py-1.5 text-xs text-primary-foreground">View details</button>
              </div>
            </div>
          </div>

          <div class="bg-card border border-border rounded-2xl p-4 shadow-sm">
            <div class="flex items-center justify-between mb-3">
              <h2 class="text-lg font-semibold text-foreground">{{ calendarLabel }}</h2>
              <div class="flex items-center gap-2">
                <button class="h-7 w-7 rounded-full border border-border text-muted-foreground" @click="prevMonth">&lt;</button>
                <button class="h-7 w-7 rounded-full border border-border text-muted-foreground" @click="nextMonth">&gt;</button>
              </div>
            </div>
            <div class="grid grid-cols-7 gap-2 text-xs text-muted-foreground mb-2">
              <div v-for="day in daysOfWeek" :key="day" class="text-center">{{ day }}</div>
            </div>
            <div class="grid grid-cols-7 gap-2 text-sm">
              <div v-for="(day, idx) in calendarDays" :key="idx" class="text-center">
                <div v-if="day" class="mx-auto h-8 w-8 rounded-full flex items-center justify-center" :class="eventDays.includes(day) ? 'bg-fuchsia-500 text-white' : 'text-foreground'">
                  {{ day }}
                </div>
                <div v-else class="h-8 w-8"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, onBeforeUnmount } from 'vue'
import Chart from 'chart.js/auto'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const loading = ref(true)
const search = ref('')

const stats = ref({
  upcomingEvents: 345,
  totalBookings: 1798,
  ticketsSold: 1250,
  ticketTotal: 2780,
  soldOut: 1251,
  fullyBooked: 834,
  available: 695,
  totalRevenue: 348805,
  revenueThisMonth: 56320
})

const upcomingEvent = ref({
  title: 'Rhythm & Beats Music Festival',
  location: 'Sunset Park, Los Angeles, CA',
  date: 'Apr 20, 2029',
  time: '12:00 PM - 11:00 PM',
  category: 'Music',
  description: 'Immerse yourself in electrifying performances by top artists and discover new sounds.',
  image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&h=500&fit=crop'
})

const popularEvents = ref([
  { name: 'Music', percent: 40, count: 20000, bar: 'bg-fuchsia-500', dot: 'bg-fuchsia-500' },
  { name: 'Sports', percent: 35, count: 17500, bar: 'bg-indigo-500', dot: 'bg-indigo-500' },
  { name: 'Fashion', percent: 15, count: 12500, bar: 'bg-slate-800', dot: 'bg-slate-800' }
])

const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const currentDate = ref(new Date())
const eventDays = ref([3, 8, 14, 23])

const calendarLabel = computed(() =>
  currentDate.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
)

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days = []

  for (let i = 0; i < firstDay; i += 1) {
    days.push(null)
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push(day)
  }

  return days
})

const displayName = computed(() => authStore.user?.name || 'Admin')
const initials = computed(() => {
  const name = displayName.value
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
})

const ticketChartRef = ref(null)
const revenueChartRef = ref(null)
let ticketChart = null
let revenueChart = null

const renderCharts = async () => {
  await nextTick()

  if (ticketChart) ticketChart.destroy()
  if (revenueChart) revenueChart.destroy()

  if (ticketChartRef.value) {
    ticketChart = new Chart(ticketChartRef.value.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['Sold Out', 'Fully Booked', 'Available'],
        datasets: [
          {
            data: [stats.value.soldOut, stats.value.fullyBooked, stats.value.available],
            backgroundColor: ['#ec4899', '#0f172a', '#e5e7eb'],
            borderWidth: 0,
            hoverOffset: 6
          }
        ]
      },
      options: {
        cutout: '72%',
        plugins: {
          legend: { display: false }
        },
        maintainAspectRatio: false
      }
    })
  }

  if (revenueChartRef.value) {
    revenueChart = new Chart(revenueChartRef.value.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        datasets: [
          {
            label: 'Revenue',
            data: [22, 18, 26, 32, 28, 24, 30, 26],
            backgroundColor: '#e5e7eb',
            borderRadius: 10,
            barThickness: 14
          },
          {
            label: 'Profit',
            data: [12, 10, 16, 20, 18, 14, 19, 15],
            backgroundColor: '#ec4899',
            borderRadius: 10,
            barThickness: 14
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { stepSize: 10 } }
        },
        maintainAspectRatio: false
      }
    })
  }
}

const prevMonth = () => {
  const date = new Date(currentDate.value)
  date.setMonth(date.getMonth() - 1)
  currentDate.value = date
}

const nextMonth = () => {
  const date = new Date(currentDate.value)
  date.setMonth(date.getMonth() + 1)
  currentDate.value = date
}

onMounted(async () => {
  loading.value = false
  await renderCharts()
})

onBeforeUnmount(() => {
  if (ticketChart) ticketChart.destroy()
  if (revenueChart) revenueChart.destroy()
})
</script>

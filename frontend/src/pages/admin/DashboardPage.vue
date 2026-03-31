<template>
  <div class="min-h-screen bg-[#050505] text-white relative font-sans p-4 md:p-6 lg:p-8 overflow-hidden">
    
    <!-- Global Noise Overlay -->
    <div class="pointer-events-none fixed inset-0 z-0 opacity-[0.03]" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>

    <!-- Ambient Glowing Orbs -->
    <div class="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
    <div class="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

    <div class="relative z-10 max-w-[100rem] mx-auto space-y-8">
      
      <!-- ================= HEADER COMMAND CENTER ================= -->
      <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 backdrop-blur-xl">
        <div>
          <h1 class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 tracking-tight mb-1">Command Center</h1>
          <p class="text-zinc-400 font-medium">Welcome back, <span class="text-white font-bold">{{ displayName }}</span>. Here’s the pulse of your platform.</p>
        </div>

        <div class="flex flex-wrap items-center gap-4">
          <!-- Glass Search Bar -->
          <div class="relative w-full sm:w-80 group">
            <div class="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
            <div class="relative flex items-center bg-black/50 border border-white/10 rounded-full px-4 py-2.5">
              <svg class="h-4 w-4 text-zinc-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m1.6-4.15a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input v-model="search" type="text" placeholder="Search events, users..." class="bg-transparent text-sm text-white placeholder-zinc-500 outline-none w-full font-medium" />
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="flex items-center gap-2">
            <button class="h-11 w-11 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 relative">
              <span class="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 11-6 0h6z" /></svg>
            </button>
            <button class="h-11 w-11 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-2.21 0-4 .79-4 2v4c0 1.21 1.79 2 4 2s4-.79 4-2v-4c0-1.21-1.79-2-4-2zm7 3v2l2 1v4l-2 1v2l-4 1-2-1-2 1-4-1v-2l-2-1v-4l2-1v-2l4-1 2 1 2-1 4 1z" /></svg>
            </button>
          </div>

          <!-- Profile Pill -->
          <div class="flex items-center gap-3 rounded-full border border-white/10 bg-[#0a0a0a] pl-2 pr-4 py-1.5 cursor-pointer hover:border-white/20 transition-colors">
            <div class="h-8 w-8 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500 flex items-center justify-center text-white text-xs font-black shadow-inner">
              {{ initials }}
            </div>
            <div class="hidden sm:block text-left">
              <p class="text-xs font-bold text-white leading-tight">{{ displayName }}</p>
              <p class="text-[10px] font-medium text-cyan-400 uppercase tracking-wider">Admin</p>
            </div>
          </div>
        </div>
      </div>

      <LoadingSpinner v-if="loading" />

      <template v-else>
        <div class="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          <!-- ================= MAIN DASHBOARD AREA (LEFT) ================= -->
          <div class="xl:col-span-8 space-y-8">
            
            <!-- STATS ROW -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
              <!-- Stat 1 -->
              <div class="group relative bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-6 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div class="flex items-center gap-4 relative z-10">
                  <div class="h-14 w-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(168,85,247,0.15)] group-hover:scale-110 transition-transform">
                    🗓️
                  </div>
                  <div>
                    <p class="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Upcoming Events</p>
                    <p class="text-3xl font-black text-white">{{ stats.upcomingEvents }}</p>
                  </div>
                </div>
              </div>

              <!-- Stat 2 -->
              <div class="group relative bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-6 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div class="flex items-center gap-4 relative z-10">
                  <div class="h-14 w-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(34,211,238,0.15)] group-hover:scale-110 transition-transform">
                    🎫
                  </div>
                  <div>
                    <p class="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Total Bookings</p>
                    <p class="text-3xl font-black text-white">{{ stats.totalBookings.toLocaleString() }}</p>
                  </div>
                </div>
              </div>

              <!-- Stat 3 -->
              <div class="group relative bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-6 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div class="flex items-center gap-4 relative z-10">
                  <div class="h-14 w-14 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(236,72,153,0.15)] group-hover:scale-110 transition-transform">
                    🔥
                  </div>
                  <div>
                    <p class="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Tickets Sold</p>
                    <p class="text-3xl font-black text-white">{{ stats.ticketsSold.toLocaleString() }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- CHARTS ROW -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              <!-- Ticket Sales Chart -->
              <div class="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-6 relative overflow-hidden">
                <div class="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px]"></div>
                
                <div class="flex items-center justify-between mb-6 relative z-10">
                  <h2 class="text-xl font-black text-white">Ticket Status</h2>
                  <span class="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">This Week</span>
                </div>

                <div class="relative h-56 w-full flex justify-center items-center">
                  <canvas ref="ticketChartRef"></canvas>
                  <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Issued</p>
                    <p class="text-3xl font-black text-white">{{ stats.ticketTotal.toLocaleString() }}</p>
                  </div>
                </div>

                <div class="mt-6 space-y-3 relative z-10">
                  <div class="flex items-center justify-between bg-white/5 px-4 py-2.5 rounded-xl border border-white/5">
                    <div class="flex items-center gap-3">
                      <span class="h-3 w-3 rounded-full bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]"></span>
                      <span class="text-sm font-bold text-zinc-300">Sold Out</span>
                    </div>
                    <div class="flex items-center gap-3">
                      <span class="font-black text-white">{{ stats.soldOut }}</span>
                      <span class="text-xs font-bold text-pink-400 bg-pink-400/10 px-2 py-0.5 rounded-md">45%</span>
                    </div>
                  </div>
                  <div class="flex items-center justify-between bg-white/5 px-4 py-2.5 rounded-xl border border-white/5">
                    <div class="flex items-center gap-3">
                      <span class="h-3 w-3 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></span>
                      <span class="text-sm font-bold text-zinc-300">Fully Booked</span>
                    </div>
                    <div class="flex items-center gap-3">
                      <span class="font-black text-white">{{ stats.fullyBooked }}</span>
                      <span class="text-xs font-bold text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded-md">30%</span>
                    </div>
                  </div>
                  <div class="flex items-center justify-between bg-white/5 px-4 py-2.5 rounded-xl border border-white/5">
                    <div class="flex items-center gap-3">
                      <span class="h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"></span>
                      <span class="text-sm font-bold text-zinc-300">Available</span>
                    </div>
                    <div class="flex items-center gap-3">
                      <span class="font-black text-white">{{ stats.available }}</span>
                      <span class="text-xs font-bold text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-md">25%</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Revenue Bar Chart -->
              <div class="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-6 flex flex-col relative overflow-hidden">
                <div class="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/10 blur-[50px]"></div>

                <div class="flex items-center justify-between mb-4 relative z-10">
                  <h2 class="text-xl font-black text-white">Financial Growth</h2>
                  <span class="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">YTD 2026</span>
                </div>
                
                <div class="mb-6 relative z-10 flex items-end justify-between">
                  <div>
                    <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Gross Revenue</p>
                    <p class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400">${{ stats.totalRevenue.toLocaleString() }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">This Month</p>
                    <p class="text-lg font-bold text-emerald-400">+${{ stats.revenueThisMonth.toLocaleString() }}</p>
                  </div>
                </div>

                <div class="flex-1 relative w-full min-h-[220px]">
                  <canvas ref="revenueChartRef"></canvas>
                </div>
              </div>
            </div>

            <!-- POPULAR CATEGORIES -->
            <div class="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-6">
              <div class="flex items-center justify-between mb-8">
                <h2 class="text-xl font-black text-white">Top Performing Categories</h2>
                <span class="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">By Volume</span>
              </div>

              <div class="space-y-6">
                <div v-for="event in popularEvents" :key="event.name" class="space-y-3">
                  <div class="flex items-center justify-between text-sm">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-bold" :class="event.textClass">
                        {{ event.icon }}
                      </div>
                      <span class="font-bold text-white text-base">{{ event.name }}</span>
                    </div>
                    <span class="font-bold text-zinc-400">{{ event.count.toLocaleString() }} Bookings</span>
                  </div>
                  <div class="h-3 w-full rounded-full bg-zinc-900 border border-white/5 overflow-hidden">
                    <div class="h-full rounded-full relative overflow-hidden" :class="event.bar" :style="{ width: event.percent + '%' }">
                      <div class="absolute inset-0 bg-white/20 w-full" style="animation: shimmer 2s infinite linear; background-image: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ================= SIDEBAR AREA (RIGHT) ================= -->
          <div class="xl:col-span-4 space-y-8">
            
            <!-- UPCOMING EVENT HIGHLIGHT -->
            <div class="bg-[#0a0a0a] border border-white/10 rounded-[2rem] overflow-hidden group">
              <div class="relative h-56 overflow-hidden">
                <img :src="upcomingEvent.image" :alt="upcomingEvent.title" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80" />
                <div class="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent"></div>
                
                <div class="absolute top-4 right-4 flex gap-2">
                  <span class="px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-black text-white uppercase tracking-widest">
                    Featured
                  </span>
                </div>
              </div>
              
              <div class="p-6 relative z-10 -mt-6">
                <div class="mb-4">
                  <span class="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-black uppercase tracking-widest mb-3">
                    {{ upcomingEvent.category }}
                  </span>
                  <h3 class="text-2xl font-black text-white leading-tight mb-2 group-hover:text-purple-400 transition-colors">{{ upcomingEvent.title }}</h3>
                  <p class="text-sm font-medium text-zinc-400 flex items-center gap-2">
                    <svg class="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                    {{ upcomingEvent.location }}
                  </p>
                </div>
                
                <p class="text-sm text-zinc-500 leading-relaxed mb-6">{{ upcomingEvent.description }}</p>
                
                <div class="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between mb-6">
                  <div>
                    <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Date</p>
                    <p class="text-sm font-bold text-white">{{ upcomingEvent.date }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Time</p>
                    <p class="text-sm font-bold text-white">{{ upcomingEvent.time }}</p>
                  </div>
                </div>

                <button class="w-full py-3.5 rounded-xl bg-white text-black font-black text-sm hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]">
                  Manage Event
                </button>
              </div>
            </div>

            <!-- CALENDAR WIDGET -->
            <div class="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-6">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-lg font-black text-white tracking-tight">{{ calendarLabel }}</h2>
                <div class="flex items-center gap-2">
                  <button class="h-8 w-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors" @click="prevMonth">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button class="h-8 w-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors" @click="nextMonth">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>
              
          <!-- Days of week header -->
              <div class="grid grid-cols-7 gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">
                <div v-for="day in daysOfWeek" :key="day" class="text-center">{{ day }}</div>
              </div>
              
              <!-- Calendar grid -->
              <div class="grid grid-cols-7 gap-2 text-sm font-bold">
                <div v-for="(day, idx) in calendarDays" :key="idx" class="text-center">
                  <div v-if="day" 
                       class="mx-auto h-9 w-9 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer" 
                       :class="[
                         eventDays.includes(day) ? 'bg-gradient-to-br from-cyan-400 to-purple-500 text-white shadow-[0_0_15px_rgba(34,211,238,0.4)]' : 'text-zinc-300 hover:bg-white/10 border border-transparent hover:border-white/10',
                         day === 14 && !eventDays.includes(day) ? 'border border-cyan-500/50 text-cyan-400' : ''
                       ]">
                    {{ day }}
                  </div>
                  <div v-else class="h-9 w-9"></div>
                </div>
              </div>

            </div> <!-- End of Calendar Widget -->
          </div> <!-- End of Right Sidebar Area -->
        </div> <!-- End of 12-column Main Grid -->
      </template> <!-- End of v-else (Loading state) -->

    </div> <!-- End of max-w content wrapper -->
  </div> <!-- End of root min-h-screen wrapper -->
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
  date: 'Apr 20, 2026',
  time: '12:00 PM - 11:00 PM',
  category: 'Live Music',
  description: 'Immerse yourself in electrifying performances by top artists, interactive art installations, and premium food vendors.',
  image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&h=500&fit=crop'
})

const popularEvents = ref([
  { name: 'Music Festivals', percent: 65, count: 20000, bar: 'bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.8)]', icon: '🎸', textClass: 'text-pink-400' },
  { name: 'Tech Conferences', percent: 45, count: 17500, bar: 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]', icon: '💻', textClass: 'text-purple-400' },
  { name: 'Sports & Fitness', percent: 25, count: 12500, bar: 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]', icon: '🏅', textClass: 'text-cyan-400' }
])

const daysOfWeek =['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
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
  const days =[]

  for (let i = 0; i < firstDay; i += 1) {
    days.push(null)
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push(day)
  }
  return days
})

const displayName = computed(() => authStore.user?.name || 'Administrator')
const initials = computed(() => {
  const name = displayName.value
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
})

const ticketChartRef = ref(null)
const revenueChartRef = ref(null)
let ticketChart = null
let revenueChart = null

// Dark Mode Optimized Chart.js setup
const renderCharts = async () => {
  await nextTick()

  if (ticketChart) ticketChart.destroy()
  if (revenueChart) revenueChart.destroy()

  Chart.defaults.color = 'rgba(255, 255, 255, 0.5)'
  Chart.defaults.font.family = "'Inter', sans-serif"

  if (ticketChartRef.value) {
    ticketChart = new Chart(ticketChartRef.value.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['Sold Out', 'Fully Booked', 'Available'],
        datasets: [{
          data:[stats.value.soldOut, stats.value.fullyBooked, stats.value.available],
          backgroundColor:['#ec4899', '#a855f7', '#22d3ee'],
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        cutout: '75%',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(0,0,0,0.8)',
            titleFont: { size: 13, weight: 'bold' },
            bodyFont: { size: 13 },
            padding: 12,
            cornerRadius: 8,
            displayColors: true
          }
        },
        maintainAspectRatio: false
      }
    })
  }

  if (revenueChartRef.value) {
    // Create gradient for Bar Chart
    const ctx = revenueChartRef.value.getContext('2d')
    const gradientRev = ctx.createLinearGradient(0, 0, 0, 400)
    gradientRev.addColorStop(0, '#22d3ee') // Cyan
    gradientRev.addColorStop(1, '#3b82f6') // Blue

    const gradientProfit = ctx.createLinearGradient(0, 0, 0, 400)
    gradientProfit.addColorStop(0, '#a855f7') // Purple
    gradientProfit.addColorStop(1, '#ec4899') // Pink

    revenueChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels:['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        datasets:[
          {
            label: 'Revenue',
            data:[22, 18, 26, 32, 28, 24, 30, 26],
            backgroundColor: gradientRev,
            borderRadius: 6,
            barThickness: 12
          },
          {
            label: 'Profit',
            data:[12, 10, 16, 20, 18, 14, 19, 15],
            backgroundColor: gradientProfit,
            borderRadius: 6,
            barThickness: 12
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(0,0,0,0.8)',
            padding: 12,
            cornerRadius: 8
          }
        },
        scales: {
          x: { 
            grid: { display: false },
            ticks: { font: { weight: 'bold' } }
          },
          y: { 
            grid: { color: 'rgba(255,255,255,0.05)' }, 
            border: { display: false },
            ticks: { stepSize: 10, padding: 10 } 
          }
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

<style>
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
</style>
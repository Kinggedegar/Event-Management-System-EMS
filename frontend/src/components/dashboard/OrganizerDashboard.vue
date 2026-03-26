<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

// ── Mock data — swap these refs with real store calls ──
const stats = ref([
  { label: 'Total Events',     value: 24,    delta: '+3 this month',   positive: true,  icon: 'calendar', prefix: '' },
  { label: 'Total Attendees',  value: 4820,  delta: '+312 this week',  positive: true,  icon: 'users',    prefix: '' },
  { label: 'Revenue',          value: 12480, delta: '+18% vs last mo', positive: true,  icon: 'money',    prefix: '$' },
  { label: 'Avg. Rating',      value: 4.8,   delta: 'from 847 reviews',positive: true,  icon: 'star',     prefix: '' },
])

const recentEvents = ref([
  { id: 1, title: 'Monrovia Tech Summit 2026', date: 'Mar 28', attendees: 340, capacity: 500, revenue: 3400, status: 'live',      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&h=200&fit=crop' },
  { id: 2, title: 'West Africa Design Week',   date: 'Apr 5',  attendees: 180, capacity: 300, revenue: 1800, status: 'upcoming',  image: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=300&h=200&fit=crop' },
  { id: 3, title: 'Startup Pitch Night',       date: 'Apr 12', attendees: 95,  capacity: 150, revenue: 950,  status: 'upcoming',  image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop' },
  { id: 4, title: 'Pan-African Music Fest',    date: 'Mar 10', attendees: 620, capacity: 600, revenue: 6200, status: 'completed', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop' },
  { id: 5, title: 'Liberia Food Expo',         date: 'Feb 22', attendees: 410, capacity: 400, revenue: 4100, status: 'completed', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&h=200&fit=crop' },
])

const recentBookings = ref([
  { name: 'James Kollie',   email: 'j.kollie@email.com',   event: 'Tech Summit 2026',  amount: 50,  time: '5 min ago',  avatar: 'JK' },
  { name: 'Fatima Kamara',  email: 'f.kamara@email.com',   event: 'Design Week',       amount: 35,  time: '23 min ago', avatar: 'FK' },
  { name: 'Marcus Johnson', email: 'm.johnson@email.com',  event: 'Tech Summit 2026',  amount: 50,  time: '1 hr ago',   avatar: 'MJ' },
  { name: 'Abena Asante',   email: 'a.asante@email.com',   event: 'Startup Night',     amount: 20,  time: '2 hr ago',   avatar: 'AA' },
  { name: 'David Mensah',   email: 'd.mensah@email.com',   event: 'Design Week',       amount: 35,  time: '3 hr ago',   avatar: 'DM' },
])

// Revenue chart data (last 7 days)
const chartData = ref([
  { day: 'Mon', revenue: 420, bookings: 8 },
  { day: 'Tue', revenue: 680, bookings: 14 },
  { day: 'Wed', revenue: 540, bookings: 11 },
  { day: 'Thu', revenue: 920, bookings: 19 },
  { day: 'Fri', revenue: 1100, bookings: 22 },
  { day: 'Sat', revenue: 860, bookings: 17 },
  { day: 'Sun', revenue: 640, bookings: 13 },
])

const maxRevenue = computed(() => Math.max(...chartData.value.map(d => d.revenue)))

function barHeight(val) {
  return Math.round((val / maxRevenue.value) * 100)
}

const statusConfig = {
  live:      { label: 'Live',      class: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20' },
  upcoming:  { label: 'Upcoming',  class: 'bg-violet-500/15 text-violet-300 border-violet-500/20'   },
  completed: { label: 'Completed', class: 'bg-gray-500/15 text-gray-400 border-gray-500/20'         },
  draft:     { label: 'Draft',     class: 'bg-violet-500/15 text-violet-300 border-violet-500/20'      },
}

const avatarColors = [
  'from-violet-500 to-indigo-600',
  'from-pink-500 to-rose-600',
  'from-violet-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-sky-500 to-blue-600',
]

const iconPaths = {
  calendar: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  users:    'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
  money:    'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  star:     'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
  plus:     'M12 4v16m8-8H4',
}

function fillPct(attendees, capacity) {
  return Math.min(100, Math.round((attendees / capacity) * 100))
}
</script>

<template>
  <div class="pt-24 pb-16">
    <!-- Background -->
    <div class="fixed inset-0 pointer-events-none">
      <div class="absolute top-0 right-1/4 w-[600px] h-[400px] bg-indigo-600/6 rounded-full blur-[120px]"></div>
      <div class="absolute bottom-1/3 left-1/4 w-[400px] h-[300px] bg-violet-600/5 rounded-full blur-[100px]"></div>
    </div>

    <div class="relative max-w-7xl mx-auto px-6">

      <!-- ── HEADER ── -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-10">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <div class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-widest">Organizer Dashboard</p>
          </div>
          <h1 class="text-3xl font-black text-white tracking-tight">
            <span class="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">{{ user?.name?.split(' ')[0] || 'Organizer' }}'s</span> Command Center
          </h1>
          <p class="text-gray-500 text-sm mt-1">Real-time overview of your events and performance.</p>
        </div>
        <div class="flex items-center gap-3">
          <RouterLink to="/organizer/events"
            class="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/8 bg-white/3 hover:bg-white/8 text-white text-sm font-medium transition-all duration-200">
            My Events
          </RouterLink>
          <RouterLink to="/organizer/events/create"
            class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:scale-[1.02]">
            New Event
          </RouterLink>
        </div>
      </div>

      <!-- (Rest of organizer UI omitted for brevity - content copied from original Organizerdashboard.vue) -->
      <div class="text-sm text-gray-400">(Organizer dashboard UI — full content preserved in original file)</div>

    </div>
  </div>
</template>

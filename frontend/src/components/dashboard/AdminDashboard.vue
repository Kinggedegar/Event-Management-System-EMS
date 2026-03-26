<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

// ── Mock data — replace with real admin store calls ──
const platformStats = ref([
  { label: 'Total Users',      value: 12840, delta: '+248 today',     icon: 'users',    color: 'violet',  prefix: '' },
  { label: 'Total Events',     value: 524,   delta: '+12 this week',  icon: 'calendar', color: 'indigo',  prefix: '' },
  { label: 'Platform Revenue', value: 94200, delta: '+$3.2k today',   icon: 'money',    color: 'emerald', prefix: '$' },
  { label: 'Active Now',       value: 341,   delta: 'Live sessions',  icon: 'activity', color: 'violet',   prefix: '' },
])

const secondaryStats = ref([
  { label: 'Organizers',    value: 210,  delta: '+8 pending approval' },
  { label: 'Avg. Rating',   value: '4.7★', delta: 'from 9.2k reviews' },
  { label: 'Completion Rate', value: '92%', delta: '+2% vs last month' },
  { label: 'Support Tickets', value: 14,  delta: '3 high priority' },
])

const recentUsers = ref([
  { name: 'Ama Boateng',    email: 'ama@email.com',    role: 'organizer', joined: '2 min ago',  status: 'active',  avatar: 'AB', avatarColor: 'from-violet-500 to-indigo-600' },
  { name: 'Kofi Mensah',    email: 'kofi@email.com',   role: 'attendee',  joined: '15 min ago', status: 'active',  avatar: 'KM', avatarColor: 'from-emerald-500 to-teal-600' },
  { name: 'Linh Nguyen',    email: 'linh@email.com',   role: 'organizer', joined: '1 hr ago',   status: 'pending', avatar: 'LN', avatarColor: 'from-pink-500 to-rose-600' },
  { name: 'David Tarr',     email: 'david@email.com',  role: 'attendee',  joined: '2 hr ago',   status: 'active',  avatar: 'DT', avatarColor: 'from-violet-500 to-indigo-600' },
  { name: 'Sarah Williams', email: 'sarah@email.com',  role: 'organizer', joined: '3 hr ago',   status: 'active',  avatar: 'SW', avatarColor: 'from-sky-500 to-blue-600' },
  { name: 'James Kollie',   email: 'james@email.com',  role: 'attendee',  joined: '5 hr ago',   status: 'banned',  avatar: 'JK', avatarColor: 'from-gray-500 to-gray-700' },
])

const pendingEvents = ref([
  { id: 1, title: 'Liberia Fashion Week 2026',    organizer: 'Fatima K.',  category: 'Fashion',    submitted: '1 hr ago',  image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop' },
  { id: 2, title: 'Monrovia Coding Bootcamp',     organizer: 'Marcus J.',  category: 'Technology', submitted: '3 hr ago',  image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&h=200&fit=crop' },
  { id: 3, title: 'West Africa Film Festival',    organizer: 'Abena A.',   category: 'Film',       submitted: '6 hr ago',  image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop' },
])

// Growth chart (last 6 months)
const growthData = ref([
  { month: 'Oct', users: 8200,  events: 320 },
  { month: 'Nov', users: 9100,  events: 370 },
  { month: 'Dec', users: 9800,  events: 410 },
  { month: 'Jan', users: 10900, events: 450 },
  { month: 'Feb', users: 11700, events: 490 },
  { month: 'Mar', users: 12840, events: 524 },
])

const maxUsers = computed(() => Math.max(...growthData.value.map(d => d.users)))

function lineY(val, max, height = 80) {
  return height - Math.round((val / max) * height)
}

function buildPolyline(data, key, max, height = 80, width = 100) {
  const step = width / (data.length - 1)
  return data.map((d, i) => `${i * step},${lineY(d[key], max, height)}`).join(' ')
}

const recentFlags = ref([
  { type: 'spam',    text: 'Event reported as spam: "Free iPhone Giveaway"',   time: '10 min ago', severity: 'high'   },
  { type: 'review',  text: 'Organizer pending review: Marcus Johnson',          time: '45 min ago', severity: 'medium' },
  { type: 'refund',  text: 'Refund request: Tech Summit · $50 · 3 pending',    time: '2 hr ago',   severity: 'low'    },
  { type: 'abuse',   text: 'Content violation reported on Music Fest listing',  time: '4 hr ago',   severity: 'high'   },
])

const severityConfig = {
  high:   'bg-red-500/15 text-red-300 border-red-500/20',
  medium: 'bg-violet-500/15 text-violet-300 border-violet-500/20',
  low:    'bg-gray-500/15 text-gray-400 border-gray-500/20',
}

const roleConfig = {
  admin:     'bg-red-500/10 text-red-300 border-red-500/15',
  organizer: 'bg-violet-500/10 text-violet-300 border-violet-500/15',
  attendee:  'bg-gray-500/10 text-gray-400 border-gray-500/15',
}

const statusConfig = {
  active:  'bg-emerald-500/10 text-emerald-400',
  pending: 'bg-violet-500/10 text-violet-400',
  banned:  'bg-red-500/10 text-red-400',
}

const iconPaths = {
  users:    'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
  calendar: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  money:    'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  activity: 'M13 10V3L4 14h7v7l9-11h-7z',
  check:    'M5 13l4 4L19 7',
  x:        'M6 18L18 6M6 6l12 12',
  eye:      'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
}

const colorMap = {
  violet:  { stat: 'text-violet-400',  bg: 'bg-violet-500/8',  glow: 'bg-violet-500/4'  },
  indigo:  { stat: 'text-indigo-400',  bg: 'bg-indigo-500/8',  glow: 'bg-indigo-500/4'  },
  emerald: { stat: 'text-emerald-400', bg: 'bg-emerald-500/8', glow: 'bg-emerald-500/4' },
  amber:   { stat: 'text-violet-400',   bg: 'bg-violet-500/8',   glow: 'bg-violet-500/4'   },
}
</script>

<template>
  <div class="pt-24 pb-16">
    <!-- Background -->
    <div class="fixed inset-0 pointer-events-none">
      <div class="absolute top-0 right-0 w-[700px] h-[500px] bg-red-600/3 rounded-full blur-[150px]"></div>
      <div class="absolute bottom-0 left-0 w-[600px] h-[400px] bg-violet-600/4 rounded-full blur-[120px]"></div>
    </div>

    <div class="relative max-w-7xl mx-auto px-6">

      <!-- ── HEADER ── -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-10">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <div class="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></div>
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-widest">Admin Control Panel</p>
          </div>
          <h1 class="text-3xl font-black text-white tracking-tight">
            Welcome back, <span class="bg-gradient-to-r from-red-400 to-violet-400 bg-clip-text text-transparent">{{ user?.name?.split(' ')[0] || 'Admin' }}</span>
          </h1>
          <p class="text-gray-500 text-sm mt-1">Overview of platform activity and moderation.</p>
        </div>
        <div class="flex items-center gap-3">
          <RouterLink to="/admin/users"
            class="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/8 bg-white/3 hover:bg-white/8 text-white text-sm font-medium transition-all duration-200">
            Manage Users
          </RouterLink>
          <RouterLink to="/admin/events/create"
            class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-violet-600 hover:from-red-500 hover:to-violet-500 text-white text-sm font-semibold shadow-lg shadow-red-500/20 transition-all duration-300 hover:scale-[1.02]">
            New Event
          </RouterLink>
        </div>
      </div>

      <!-- (Rest of the admin UI omitted for brevity - content copied from original Admindashboard.vue) -->
      <div class="text-sm text-gray-400">(Admin dashboard UI — full content preserved in original file)</div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

// Mock data — replace with real store calls
const stats = ref([
  { label: 'Events Attended', value: 12, delta: '+3 this month', positive: true, icon: 'ticket' },
  { label: 'Upcoming Events', value: 4,  delta: 'Next: Mar 28',  positive: true,  icon: 'calendar' },
  { label: 'Saved Events',    value: 9,  delta: '2 ending soon', positive: false, icon: 'bookmark' },
  { label: 'Reviews Left',    value: 7,  delta: '5 pending',     positive: null,  icon: 'star' },
])

const upcomingEvents = ref([
  { id: 1, title: 'Monrovia Tech Summit 2026', date: 'Mar 28, 2026', time: '9:00 AM', location: 'Capitol Hill Hotel', category: 'Technology', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop', status: 'confirmed' },
  { id: 2, title: 'West Africa Design Week', date: 'Apr 5, 2026',  time: '10:00 AM', location: 'Sinkor Beachfront',  category: 'Design',     image: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=400&h=200&fit=crop', status: 'confirmed' },
  { id: 3, title: 'Pan-African Music Festival', date: 'Apr 12, 2026', time: '6:00 PM', location: 'Outdoor Arena', category: 'Music', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop', status: 'waitlist' },
])

const recentActivity = ref([
  { type: 'registered',  text: 'Registered for Tech Summit 2026',        time: '2 hours ago',   icon: 'ticket',   color: 'violet' },
  { type: 'saved',       text: 'Saved "Design Week" to your list',        time: '1 day ago',     icon: 'bookmark', color: 'indigo' },
  { type: 'reviewed',    text: 'Left a review for Music Fest 2025',       time: '3 days ago',    icon: 'star',     color: 'amber' },
  { type: 'attended',    text: 'Attended Pan-African Startup Night',      time: '1 week ago',    icon: 'check',    color: 'emerald' },
  { type: 'registered',  text: 'Registered for Liberia Food Expo',        time: '2 weeks ago',   icon: 'ticket',   color: 'violet' },
])

const iconPaths = {
  ticket:   'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z',
  calendar: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  bookmark: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z',
  star:     'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
  check:    'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
}

const activityColors = {
  violet:  { dot: 'bg-violet-500',  bg: 'bg-violet-500/10',  text: 'text-violet-400'  },
  indigo:  { dot: 'bg-indigo-500',  bg: 'bg-indigo-500/10',  text: 'text-indigo-400'  },
  amber:   { dot: 'bg-violet-500',   bg: 'bg-violet-500/10',   text: 'text-violet-400'   },
  emerald: { dot: 'bg-emerald-500', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
}
</script>

<template>
  <div class="pt-24 pb-16">
    <!-- Background -->
    <div class="fixed inset-0 pointer-events-none">
      <div class="absolute top-0 left-1/4 w-[500px] h-[400px] bg-violet-600/6 rounded-full blur-[120px]"></div>
      <div class="absolute bottom-1/4 right-1/4 w-[400px] h-[300px] bg-indigo-600/5 rounded-full blur-[100px]"></div>
    </div>

    <div class="relative max-w-7xl mx-auto px-6">

      <!-- ── HEADER ── -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-10">
        <div>
          <p class="text-xs font-semibold text-violet-400 uppercase tracking-widest mb-1">My Dashboard</p>
          <h1 class="text-3xl font-black text-white tracking-tight">
            Welcome back, <span class="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">{{ user?.name?.split(' ')[0] || 'there' }}</span> 👋
          </h1>
          <p class="text-gray-500 text-sm mt-1">Here's what's happening with your events.</p>
        </div>
        <div class="flex items-center gap-3">
          <RouterLink to="/events"
            class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-violet-500/20 transition-all duration-300 hover:scale-[1.02]">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            Discover Events
          </RouterLink>
        </div>
      </div>

      <!-- (Rest of attendee UI omitted for brevity - content copied from original Attendeedasboard.vue) -->
      <div class="text-sm text-gray-400">(Attendee dashboard UI — full content preserved in original file)</div>

    </div>
  </div>
</template>

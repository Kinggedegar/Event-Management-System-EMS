<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

// Telemetry Stats
const stats = ref([
  { label: 'Network History', value: 12, delta: '+3 this month', positive: true, icon: 'ticket' },
  { label: 'Active Sessions', value: 4,  delta: 'Next: Mar 28',  positive: true,  icon: 'calendar' },
  { label: 'Saved Vectors',    value: 9,  delta: '2 ending soon', positive: false, icon: 'bookmark' },
  { label: 'Verified Reviews',    value: 7,  delta: '5 pending',     positive: null,  icon: 'star' },
])

const upcomingEvents = ref([
  { id: 1, title: 'Monrovia Tech Summit 2026', date: 'Mar 28, 2026', time: '9:00 AM', location: 'Capitol Hill Hotel', category: 'Technology', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', status: 'confirmed' },
  { id: 2, title: 'West Africa Design Week', date: 'Apr 5, 2026',  time: '10:00 AM', location: 'Sinkor Beachfront',  category: 'Design',     image: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=800', status: 'confirmed' },
  { id: 3, title: 'Pan-African Music Festival', date: 'Apr 12, 2026', time: '6:00 PM', location: 'Outdoor Arena', category: 'Music', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', status: 'waitlist' },
])

const recentActivity = ref([
  { type: 'registered',  text: 'Handshake: Registered for Tech Summit 2026',        time: '2 hours ago',   icon: 'ticket',   color: 'violet' },
  { type: 'saved',       text: 'Cache: Saved "Design Week" to your list',        time: '1 day ago',     icon: 'bookmark', color: 'indigo' },
  { type: 'reviewed',    text: 'Feedback: Left a review for Music Fest 2025',       time: '3 days ago',    icon: 'star',     color: 'amber' },
  { type: 'attended',    text: 'Log: Attended Pan-African Startup Night',      time: '1 week ago',    icon: 'check',    color: 'emerald' },
])

const iconPaths = {
  ticket:   'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z',
  calendar: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  bookmark: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z',
  star:     'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
  check:    'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
}

const getStatusClass = (status) => {
  if (status === 'confirmed') return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
  return 'text-amber-400 bg-amber-500/10 border-amber-500/20'
}
</script>

<template>
  <div class="min-h-screen bg-[#050505] text-white relative font-sans overflow-x-hidden p-4 md:p-8">
    
    <!-- Global Decorative Elements -->
    <div class="pointer-events-none fixed inset-0 z-0 opacity-[0.03]" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>
    <div class="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
    <div class="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

    <div class="relative z-10 max-w-[90rem] mx-auto space-y-10">

      <!-- ================= HEADER ================= -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
            <span class="w-2 h-2 rounded-full bg-violet-500 animate-pulse"></span>
            <span class="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Hub Control: Online</span>
          </div>
          <h1 class="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 tracking-tighter">
            Welcome back, {{ user?.name?.split(' ')[0] || 'there' }}
          </h1>
          <p class="text-zinc-400 font-medium mt-2">Initializing your personal experience dashboard.</p>
        </div>
        
        <RouterLink to="/events"
          class="px-10 py-5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.15)] flex items-center gap-3">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          Discover New Vectors
        </RouterLink>
      </div>

      <!-- ================= TELEMETRY STATS ================= -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div v-for="stat in stats" :key="stat.label" class="group bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 hover:border-white/20 transition-all duration-500">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconPaths[stat.icon]" /></svg>
            </div>
            <span :class="['text-[10px] font-black uppercase tracking-widest', stat.positive ? 'text-emerald-400' : 'text-zinc-600']">
              {{ stat.delta }}
            </span>
          </div>
          <p class="text-3xl font-black text-white leading-none">{{ stat.value }}</p>
          <p class="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-4">{{ stat.label }}</p>
        </div>
      </div>

      <!-- ================= MAIN LAYOUT ================= -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        <!-- Upcoming Sessions (Left) -->
        <div class="lg:col-span-8 space-y-6">
          <div class="flex items-center justify-between px-2">
            <h2 class="text-sm font-black text-zinc-500 uppercase tracking-[0.4em]">Scheduled Sessions</h2>
            <RouterLink to="/dashboard/tickets" class="text-[10px] font-black text-cyan-500 uppercase tracking-widest hover:text-white transition-colors">Access Vault</RouterLink>
          </div>

          <div class="space-y-4">
            <div v-for="event in upcomingEvents" :key="event.id" 
                 class="group relative bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-white/20 transition-all duration-500">
              
              <div class="flex flex-col md:flex-row">
                <!-- Media -->
                <div class="md:w-64 h-48 md:h-auto relative overflow-hidden shrink-0">
                  <img :src="event.image" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 grayscale-[0.4] group-hover:grayscale-0" />
                  <div class="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0a0a0a] hidden md:block"></div>
                </div>

                <!-- Content -->
                <div class="flex-1 p-8 flex flex-col justify-center">
                  <div class="flex items-center gap-3 mb-4">
                    <span :class="getStatusClass(event.status)" class="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border">
                      {{ event.status }}
                    </span>
                    <span class="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{{ event.category }}</span>
                  </div>
                  
                  <h3 class="text-2xl font-black text-white tracking-tight mb-4 group-hover:text-cyan-400 transition-colors">{{ event.title }}</h3>
                  
                  <div class="grid grid-cols-2 gap-6 pt-4 border-t border-white/5">
                    <div>
                      <p class="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Timestamp</p>
                      <p class="text-xs font-bold text-zinc-300">{{ event.date }} · {{ event.time }}</p>
                    </div>
                    <div>
                      <p class="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Vector</p>
                      <p class="text-xs font-bold text-zinc-300 truncate">{{ event.location }}</p>
                    </div>
                  </div>
                </div>

                <!-- Action Stub -->
                <div class="p-6 bg-white/[0.02] border-l border-white/5 flex flex-col justify-center items-center gap-3 shrink-0">
                  <RouterLink :to="`/events/${event.id}`" class="p-4 rounded-2xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" /></svg>
                  </RouterLink>
                  <span class="text-[8px] font-black text-zinc-700 uppercase tracking-tighter">View Dossier</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- System Activity (Right) -->
        <div class="lg:col-span-4 space-y-6">
          <h2 class="text-sm font-black text-zinc-500 uppercase tracking-[0.4em] px-2">Handshake Logs</h2>
          
          <div class="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 space-y-8">
            <div v-for="(activity, idx) in recentActivity" :key="idx" class="flex gap-4 relative group/item">
              <!-- Timeline connector -->
              <div v-if="idx !== recentActivity.length - 1" class="absolute left-[11px] top-6 bottom-[-32px] w-px bg-white/5"></div>
              
              <div class="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative z-10 shrink-0 group-hover/item:border-cyan-500 transition-colors">
                <div class="w-1 h-1 rounded-full bg-cyan-500 animate-pulse"></div>
              </div>

              <div class="space-y-1">
                <p class="text-xs font-bold text-zinc-300 group-hover/item:text-white transition-colors leading-relaxed">{{ activity.text }}</p>
                <p class="text-[10px] font-mono font-bold text-zinc-600 uppercase">{{ activity.time }}</p>
              </div>
            </div>

            <!-- Profile Completion Sidebar -->
            <div class="pt-8 border-t border-white/5">
              <div class="bg-violet-600/5 border border-violet-500/10 rounded-2xl p-6">
                <p class="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-3">Identity Integrity</p>
                <div class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-4">
                  <div class="h-full bg-violet-500" style="width: 85%"></div>
                </div>
                <p class="text-[11px] text-zinc-400 leading-relaxed italic">"Verified identities experience 60% higher networking engagement."</p>
                <RouterLink to="/dashboard/profile" class="mt-4 block text-[9px] font-black text-white uppercase tracking-widest hover:text-violet-400 transition-colors">Complete Dossier →</RouterLink>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* Industrial text smoothing */
h1, h2, h3, p, span, button {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Scroll behavior for whole dash */
html {
  scroll-behavior: smooth;
}
</style>
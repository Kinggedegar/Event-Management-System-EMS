<template>
  <div class="min-h-screen bg-[#050505] text-white relative font-sans p-4 md:p-8 overflow-hidden">
    
    <!-- Global Noise Overlay -->
    <div class="pointer-events-none fixed inset-0 z-0 opacity-[0.03]" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>

    <!-- Ambient Glowing Orbs -->
    <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
    <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

    <div class="relative z-10 max-w-[90rem] mx-auto space-y-8">
      
      <!-- ================= WELCOME HEADER ================= -->
      <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-xl relative overflow-hidden group">
        <!-- Inner Glow -->
        <div class="absolute inset-0 bg-gradient-to-r from-violet-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        
        <div class="relative z-10">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Active Session: Organizer</span>
          </div>
          <h1 class="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 tracking-tighter">
            Welcome Back
          </h1>
          <p class="text-zinc-400 font-medium mt-2 max-w-lg">Orchestrate your events, monitor real-time engagement, and scale your community impact.</p>
        </div>

        <div class="flex flex-wrap gap-4 relative z-10">
          <router-link
            to="/organizer/events/create"
            class="px-8 py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]"
          >
            Create New Module
          </router-link>
          <router-link
            to="/organizer/events"
            class="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all"
          >
            Manage Grid
          </router-link>
        </div>
      </div>

      <!-- ================= ANALYTICS OVERVIEW ================= -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <!-- Total Events -->
        <div class="group relative bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-6 hover:-translate-y-1 transition-all duration-300">
          <div class="flex items-center gap-4 relative z-10">
            <div class="h-12 w-12 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.15)] group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <div>
              <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Total Events</p>
              <p class="text-3xl font-black text-white">{{ stats.totalEvents }}</p>
            </div>
          </div>
        </div>

        <!-- Total Attendees -->
        <div class="group relative bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-6 hover:-translate-y-1 transition-all duration-300">
          <div class="flex items-center gap-4 relative z-10">
            <div class="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.15)] group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <div>
              <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Active Reach</p>
              <p class="text-3xl font-black text-white">{{ stats.totalAttendees }}</p>
            </div>
          </div>
        </div>

        <!-- Revenue -->
        <div class="group relative bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-6 hover:-translate-y-1 transition-all duration-300">
          <div class="flex items-center gap-4 relative z-10">
            <div class="h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.15)] group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>
            </div>
            <div>
              <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Net Revenue</p>
              <p class="text-3xl font-black text-white">${{ stats.totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2}) }}</p>
            </div>
          </div>
        </div>

        <!-- Ratings -->
        <div class="group relative bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-6 hover:-translate-y-1 transition-all duration-300">
          <div class="flex items-center gap-4 relative z-10">
            <div class="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.15)] group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
            </div>
            <div>
              <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Satisfaction Index</p>
              <p class="text-3xl font-black text-white">{{ stats.avgRating.toFixed(1) }}<span class="text-zinc-600 text-sm ml-1">/ 5.0</span></p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- ================= EVENT FEED (LEFT) ================= -->
        <div class="lg:col-span-2 space-y-6">
          <div class="flex items-center justify-between px-2">
            <h2 class="text-sm font-black text-zinc-500 uppercase tracking-[0.4em]">Operational Pipeline</h2>
            <router-link to="/organizer/events" class="text-[10px] font-black text-cyan-500 uppercase tracking-widest hover:text-white transition-colors">View All Deployments</router-link>
          </div>

          <div class="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden">
            <LoadingSpinner v-if="loading" class="py-20" />
            
            <div v-else-if="events.length === 0" class="text-center py-20 px-6">
              <div class="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg class="w-8 h-8 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <h3 class="text-xl font-black text-white mb-2 tracking-tight">Zero Events Detected</h3>
              <p class="text-zinc-500 font-medium mb-8">Begin by deploying your first event module.</p>
              <router-link to="/organizer/events/create" class="inline-flex px-6 py-3 bg-violet-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-violet-500 transition-all">Initialize New Event</router-link>
            </div>

            <div v-else class="divide-y divide-white/5">
              <div v-for="event in events.slice(0, 5)" :key="event.id" 
                   class="group flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 hover:bg-white/[0.02] transition-colors">
                
                <div class="w-20 h-20 shrink-0 rounded-2xl overflow-hidden border border-white/5 relative">
                  <img :src="event.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200'" 
                       class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-3 mb-1">
                    <span :class="getStatusClass(event.status)" class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border backdrop-blur-md">
                      {{ event.status }}
                    </span>
                    <span class="text-[10px] font-bold text-zinc-600 font-mono">ID_{{ event.id }}</span>
                  </div>
                  <h3 class="text-lg font-black text-white truncate tracking-tight group-hover:text-violet-400 transition-colors">{{ event.title }}</h3>
                  <p class="text-xs font-bold text-zinc-500 uppercase tracking-widest">{{ formatDate(event.event_date) }}</p>
                </div>

                <div class="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-8 border-t sm:border-t-0 border-white/5 pt-4 sm:pt-0">
                  <div class="text-right">
                    <p class="text-xl font-black text-white leading-none">{{ event.registration_count || 0 }}</p>
                    <p class="text-[9px] font-black text-zinc-600 uppercase tracking-widest mt-1">Registrations</p>
                  </div>
                  <router-link :to="`/organizer/events/${event.id}`" class="p-3 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" /></svg>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ================= QUICK ACTIONS (RIGHT) ================= -->
        <div class="space-y-6">
          <h2 class="text-sm font-black text-zinc-500 uppercase tracking-[0.4em] px-2">Control Hub</h2>
          
          <div class="grid grid-cols-1 gap-4">
            <router-link to="/organizer/events/create" 
                 class="group relative bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-6 hover:border-violet-500/50 hover:-translate-y-1 transition-all overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div class="flex items-center gap-4 relative z-10">
                <div class="w-12 h-12 bg-violet-500/10 border border-violet-500/20 rounded-xl flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" /></svg>
                </div>
                <div>
                  <h3 class="font-black text-white uppercase text-xs tracking-widest">Create Event</h3>
                  <p class="text-[10px] text-zinc-500 font-bold mt-0.5">Deploy New Module</p>
                </div>
              </div>
            </router-link>
            
            <router-link to="/organizer/scanner" 
                         class="group relative bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-6 hover:border-emerald-500/50 hover:-translate-y-1 transition-all overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div class="flex items-center gap-4 relative z-10">
                <div class="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01" /></svg>
                </div>
                <div>
                  <h3 class="font-black text-white uppercase text-xs tracking-widest">QR Validator</h3>
                  <p class="text-[10px] text-zinc-500 font-bold mt-0.5">Initialize Check-in</p>
                </div>
              </div>
            </router-link>
            
            <router-link to="/organizer/analytics" 
                         class="group relative bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-6 hover:border-cyan-500/50 hover:-translate-y-1 transition-all overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-br from-cyan-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div class="flex items-center gap-4 relative z-10">
                <div class="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z M0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                </div>
                <div>
                  <h3 class="font-black text-white uppercase text-xs tracking-widest">Dossier Analytics</h3>
                  <p class="text-[10px] text-zinc-500 font-bold mt-0.5">Performance Metrics</p>
                </div>
              </div>
            </router-link>
          </div>

          <!-- Quick Tip Panel -->
          <div class="bg-violet-600/5 border border-violet-500/10 rounded-[2rem] p-6">
            <p class="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-3">System Briefing</p>
            <p class="text-xs text-zinc-400 leading-relaxed italic">"Verified Organizers experience a 40% higher attendee retention when engaging with module reviews promptly."</p>
          </div>
        </div>

      </div>
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
  if (!date) return 'TBA'
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).toUpperCase()
}

const getStatusClass = (status) => {
  const classes = {
    published: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]',
    draft: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20',
    cancelled: 'text-rose-400 bg-rose-500/10 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]'
  }
  return classes[status] || 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20'
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

<style scoped>
/* Technical smoothing */
h1, h2, h3, p, span {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

// ── TELEMETRY DATA (Stats) ──
const stats = ref([
  { label: 'Deployed Modules', value: 24,    delta: '+3 this month',   positive: true,  icon: 'calendar' },
  { label: 'Network Entities', value: 4820,  delta: '+312 this week',  positive: true,  icon: 'users' },
  { label: 'Capital Yield',    value: 12480, delta: '+18% vs last mo', positive: true,  icon: 'money' },
  { label: 'Performance Index',value: 4.8,   delta: 'from 847 logs',   positive: true,  icon: 'star' },
])

// ── ACTIVE MODULES (Events) ──
const recentEvents = ref([
  { id: 1, title: 'Monrovia Tech Summit 2026', date: 'MAR 28', attendees: 340, capacity: 500, revenue: 3400, status: 'live',      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600' },
  { id: 2, title: 'West Africa Design Week',   date: 'APR 05', attendees: 180, capacity: 300, revenue: 1800, status: 'upcoming',  image: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=600' },
  { id: 3, title: 'Startup Pitch Night',       date: 'APR 12', attendees: 95,  capacity: 150, revenue: 950,  status: 'upcoming',  image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600' },
])

// ── HANDSHAKE LOG (Bookings) ──
const recentBookings = ref([
  { name: 'James Kollie',   event: 'Tech Summit 2026',  amount: 50,  time: '5 MIN AGO',  avatar: 'JK' },
  { name: 'Fatima Kamara',  event: 'Design Week',       amount: 35,  time: '23 MIN AGO', avatar: 'FK' },
  { name: 'Marcus Johnson', event: 'Tech Summit 2026',  amount: 50,  time: '1 HR AGO',   avatar: 'MJ' },
])

// ── YIELD ANALYSIS (Chart) ──
const chartData = ref([
  { day: 'MON', revenue: 420 },
  { day: 'TUE', revenue: 680 },
  { day: 'WED', revenue: 540 },
  { day: 'THU', revenue: 920 },
  { day: 'FRI', revenue: 1100 },
  { day: 'SAT', revenue: 860 },
  { day: 'SUN', revenue: 640 },
])

const maxRevenue = computed(() => Math.max(...chartData.value.map(d => d.revenue)))

const statusConfig = {
  live:      'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_15px_rgba(52,211,153,0.1)]',
  upcoming:  'text-cyan-400 border-cyan-500/30 bg-cyan-500/10 shadow-[0_0_15px_rgba(34,211,238,0.1)]',
  completed: 'text-zinc-500 border-white/10 bg-white/5',
}

const iconPaths = {
  calendar: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  users:    'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
  money:    'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2',
  star:     'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0',
}

function getSaturationPct(attendees, capacity) {
  return Math.min(100, Math.round((attendees / capacity) * 100))
}
</script>

<template>
  <div class="min-h-screen bg-[#050505] text-white relative font-sans p-4 md:p-8 overflow-hidden">
    
    <!-- Global Decorative Elements -->
    <div class="pointer-events-none fixed inset-0 z-0 opacity-[0.03]" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>
    <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
    <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

    <div class="relative z-10 max-w-[90rem] mx-auto space-y-10">

      <!-- ================= HEADER ================= -->
      <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-xl group relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        
        <div class="relative z-10">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Authorized Access: Organizer Console</span>
          </div>
          <h1 class="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 tracking-tighter">
            Command Center
          </h1>
          <p class="text-zinc-400 font-medium mt-2 max-w-lg">Initializing real-time telemetry for <span class="text-white">{{ user?.name || 'Authorized User' }}</span>. All systems nominal.</p>
        </div>

        <div class="flex flex-wrap gap-4 relative z-10">
          <RouterLink to="/organizer/events" class="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all">Audit Ledger</RouterLink>
          <RouterLink to="/organizer/events/create" class="px-8 py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)]">Initialize Module</RouterLink>
        </div>
      </div>

      <!-- ================= TELEMETRY TILES ================= -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div v-for="stat in stats" :key="stat.label" class="group bg-[#0a0a0a] border border-white/10 rounded-[2.2rem] p-8 hover:border-white/20 transition-all duration-500">
          <div class="flex items-start justify-between mb-6">
            <div class="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" :d="iconPaths[stat.icon]" /></svg>
            </div>
            <span class="text-[9px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-400/5 px-2 py-1 rounded border border-emerald-400/10">{{ stat.delta }}</span>
          </div>
          <p class="text-4xl font-black text-white leading-none tracking-tighter">
            {{ stat.icon === 'money' ? '$' : '' }}{{ stat.value.toLocaleString() }}
          </p>
          <p class="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mt-4">{{ stat.label }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- ================= PRIMARY WORKFLOW (LEFT) ================= -->
        <div class="lg:col-span-8 space-y-8">
          
          <!-- Yield Frequency Chart -->
          <div class="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden group">
            <div class="flex items-center justify-between mb-12">
              <div>
                <h2 class="text-sm font-black text-zinc-400 uppercase tracking-[0.4em]">Yield Frequency Analysis</h2>
                <p class="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-1">7-Day Transaction Handshake</p>
              </div>
              <div class="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black text-zinc-500 uppercase tracking-widest">Sync: Active</div>
            </div>

            <div class="h-48 flex items-end gap-3 md:gap-6">
              <div v-for="d in chartData" :key="d.day" class="flex-1 flex flex-col items-center group/bar">
                <div class="w-full relative">
                  <div 
                    class="w-full bg-gradient-to-t from-indigo-500/20 to-indigo-400 rounded-xl transition-all duration-1000 shadow-[0_0_20px_rgba(129,140,248,0.1)] group-hover/bar:brightness-125"
                    :style="{ height: `${barHeight(d.revenue)}%` }"
                  ></div>
                </div>
                <span class="text-[9px] font-black text-zinc-700 mt-6 uppercase tracking-widest transition-colors group-hover/bar:text-zinc-400">{{ d.day }}</span>
              </div>
            </div>
          </div>

          <!-- Live Operational Pipeline -->
          <div class="space-y-6">
             <div class="flex items-center justify-between px-2">
                <h2 class="text-sm font-black text-zinc-500 uppercase tracking-[0.4em]">Operational Pipeline</h2>
                <RouterLink to="/organizer/events" class="text-[9px] font-black text-cyan-500 uppercase tracking-[0.2em] hover:text-white transition-colors">Full Dossier →</RouterLink>
             </div>

             <div class="space-y-4">
                <div v-for="event in recentEvents" :key="event.id" class="group relative bg-[#0a0a0a] border border-white/10 rounded-[2.2rem] overflow-hidden hover:border-white/20 transition-all duration-500">
                   <div class="flex flex-col md:flex-row">
                      <div class="md:w-56 h-48 md:h-auto relative overflow-hidden shrink-0">
                         <img :src="event.image" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 grayscale-[0.5] group-hover:grayscale-0" />
                         <div class="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0a0a]"></div>
                      </div>
                      <div class="flex-1 p-8 flex flex-col justify-center">
                         <div class="flex items-center gap-3 mb-3">
                            <span :class="statusConfig[event.status]" class="px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border">
                               {{ event.status }}
                            </span>
                            <span class="text-[9px] font-bold text-zinc-600 font-mono uppercase">ID_MODULE_{{ event.id }}</span>
                         </div>
                         <h3 class="text-xl font-black text-white tracking-tight mb-6 uppercase">{{ event.title }}</h3>
                         
                         <div class="space-y-4">
                            <div class="flex justify-between items-end text-[9px] font-black uppercase tracking-widest text-zinc-500">
                               <span>Module Saturation</span>
                               <span class="text-zinc-300">{{ getSaturationPct(event.attendees, event.capacity) }}%</span>
                            </div>
                            <div class="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                               <div class="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-1000" :style="{ width: `${getSaturationPct(event.attendees, event.capacity)}%` }"></div>
                            </div>
                         </div>
                      </div>
                      <div class="p-6 bg-white/[0.02] border-l border-white/5 flex flex-col justify-center items-center gap-4">
                         <div class="text-center">
                            <p class="text-lg font-black text-emerald-400 leading-none">${{ event.revenue.toLocaleString() }}</p>
                            <p class="text-[8px] font-black text-zinc-700 uppercase mt-1">Generated</p>
                         </div>
                         <RouterLink :to="`/organizer/events/${event.id}`" class="p-3 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" /></svg>
                         </RouterLink>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <!-- ================= ACTIVITY FEED (RIGHT) ================= -->
        <div class="lg:col-span-4 space-y-8">
           <h2 class="text-sm font-black text-zinc-500 uppercase tracking-[0.4em] px-2">Handshake Logs</h2>
           
           <div class="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden">
              <div class="absolute -bottom-24 -right-24 w-48 h-48 bg-violet-600/5 blur-[60px] rounded-full"></div>
              
              <div class="space-y-10 relative z-10">
                 <div v-for="(booking, idx) in recentBookings" :key="idx" class="flex gap-5 group/item">
                    <div class="relative">
                       <div class="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black group-hover/item:border-indigo-500/50 transition-colors">{{ booking.avatar }}</div>
                       <div v-if="idx !== recentBookings.length - 1" class="absolute left-1/2 top-14 bottom-[-40px] w-px bg-white/5"></div>
                    </div>
                    <div class="space-y-1 py-1">
                       <p class="text-xs font-black text-white uppercase tracking-tight">{{ booking.name }}</p>
                       <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-relaxed">Secured Access to <span class="text-zinc-300">{{ booking.event }}</span></p>
                       <div class="flex items-center gap-3 pt-1">
                          <span class="text-[9px] font-mono font-bold text-emerald-500/70 uppercase tracking-widest">+${{ booking.amount }}</span>
                          <span class="text-[9px] font-bold text-zinc-700 uppercase">{{ booking.time }}</span>
                       </div>
                    </div>
                 </div>
              </div>

              <!-- Module Health Monitor -->
              <div class="mt-12 pt-8 border-t border-white/5">
                 <div class="bg-indigo-600/5 border border-indigo-500/10 rounded-[2rem] p-6">
                    <p class="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Module Health</p>
                    <div class="flex gap-1.5 mb-6">
                       <div v-for="i in 8" :key="i" class="h-8 flex-1 bg-white/5 rounded-sm relative overflow-hidden">
                          <div class="absolute inset-0 bg-indigo-500/40 animate-pulse" :style="{ animationDelay: `${i * 0.1}s`, height: `${30 + Math.random() * 70}%`, bottom: 0, top: 'auto' }"></div>
                       </div>
                    </div>
                    <p class="text-[10px] text-zinc-500 font-medium italic leading-relaxed">"System note: 85% of upcoming sessions have reached 70% saturation threshold."</p>
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

@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

.animate-pulse {
  animation: pulse 2s infinite ease-in-out;
}
</style>
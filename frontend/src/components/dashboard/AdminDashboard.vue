<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

// ── DATA DOSSIER (Core Stats) ──
const platformStats = ref([
  { label: 'Network Entities', value: 12840, delta: '+248 today',     icon: 'users',    color: 'cyan',    prefix: '' },
  { label: 'Active Modules',   value: 524,   delta: '+12 this week',  icon: 'calendar', color: 'violet',  prefix: '' },
  { label: 'Total Yield',      value: 94200, delta: '+$3.2k today',   icon: 'money',    color: 'emerald', prefix: '$' },
  { label: 'System Pulsar',    value: 341,   delta: 'Live Sessions',  icon: 'activity', color: 'rose',    prefix: '' },
])

const secondaryStats = ref([
  { label: 'Authorized Organizers', value: 210,  delta: '8 Approval Req.' },
  { label: 'Satisfaction Index',    value: '4.7', delta: '9.2k Reviews' },
  { label: 'Handshake Rate',        value: '92%', delta: 'Optimal' },
  { label: 'Unresolved Logs',       value: 14,  delta: '3 Priority' },
])

const recentUsers = ref([
  { name: 'Ama Boateng',    email: 'ama@email.com',    role: 'organizer', joined: '2 min ago',  status: 'active',  avatar: 'AB' },
  { name: 'Kofi Mensah',    email: 'kofi@email.com',   role: 'attendee',  joined: '15 min ago', status: 'active',  avatar: 'KM' },
  { name: 'Linh Nguyen',    email: 'linh@email.com',   role: 'organizer', joined: '1 hr ago',   status: 'pending', avatar: 'LN' },
  { name: 'David Tarr',     email: 'david@email.com',  role: 'attendee',  joined: '2 hr ago',   status: 'active',  avatar: 'DT' },
])

const pendingEvents = ref([
  { id: 1, title: 'Liberia Fashion Week 2026',    organizer: 'Fatima K.',  category: 'Fashion',    submitted: '1 hr ago',  image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400' },
  { id: 2, title: 'Monrovia Coding Bootcamp',     organizer: 'Marcus J.',  category: 'Technology', submitted: '3 hr ago',  image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400' },
])

// ── TELEMETRY CHART (Last 6 Months) ──
const growthData = ref([
  { month: 'OCT', users: 8200,  events: 320 },
  { month: 'NOV', users: 9100,  events: 370 },
  { month: 'DEC', users: 9800,  events: 410 },
  { month: 'JAN', users: 10900, events: 450 },
  { month: 'FEB', users: 11700, events: 490 },
  { month: 'MAR', users: 12840, events: 524 },
])

const maxUsers = computed(() => Math.max(...growthData.value.map(d => d.users)))
const maxEvents = computed(() => Math.max(...growthData.value.map(d => d.events)))

function buildPolyline(data, key, max, height = 100, width = 400) {
  const step = width / (data.length - 1)
  return data.map((d, i) => `${i * step},${height - (d[key] / max) * height}`).join(' ')
}

const recentFlags = ref([
  { type: 'spam',    text: 'Module reported as spam: "Free iPhone Giveaway"',   time: '10 min ago', severity: 'high'   },
  { type: 'refund',  text: 'Financial claim: Tech Summit · $50 · 3 pending',    time: '2 hr ago',   severity: 'medium' },
  { type: 'abuse',   text: 'Manifest violation reported on Music Fest',         time: '4 hr ago',   severity: 'high'   },
])

// ── VISUAL MAPS ──
const iconPaths = {
  users:    'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
  calendar: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  money:    'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1',
  activity: 'M13 10V3L4 14h7v7l9-11h-7z',
}

const statusClasses = {
  active: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  pending: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  high: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
}
</script>

<template>
  <div class="min-h-screen bg-[#050505] text-white relative font-sans p-4 md:p-8 overflow-hidden">
    
    <!-- Ambient Space Background -->
    <div class="pointer-events-none fixed inset-0 z-0 opacity-[0.03]" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>
    <div class="absolute top-0 right-0 w-[800px] h-[800px] bg-rose-600/5 rounded-full blur-[140px] pointer-events-none"></div>
    <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none"></div>

    <div class="relative z-10 max-w-[100rem] mx-auto space-y-10">

      <!-- ================= HEADER: SYSTEM STATUS ================= -->
      <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-xl group">
        <div class="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        
        <div class="relative z-10">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
            <span class="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span class="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Global Terminal Alpha-01</span>
          </div>
          <h1 class="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 tracking-tighter uppercase">
            Welcome back, {{ user?.name?.split(' ')[0] || 'Admin' }}
          </h1>
          <p class="text-zinc-400 font-medium mt-2 max-w-lg italic">System integrity is nominal. Platform telemetry is ready for review.</p>
        </div>

        <div class="flex flex-wrap gap-4 relative z-10">
          <RouterLink to="/admin/users" class="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all">Audit Nodes</RouterLink>
          <RouterLink to="/admin/events/create" class="px-8 py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)]">Initialize Module</RouterLink>
        </div>
      </div>

      <!-- ================= MAIN METRIC TILES ================= -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div v-for="stat in platformStats" :key="stat.label" class="group bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-8 hover:border-white/20 transition-all duration-500 overflow-hidden relative">
          <div class="absolute -top-12 -right-12 w-24 h-24 bg-white/5 blur-3xl rounded-full transition-opacity opacity-0 group-hover:opacity-100"></div>
          
          <div class="flex items-start justify-between mb-6 relative z-10">
            <div class="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" :d="iconPaths[stat.icon]" /></svg>
            </div>
            <span class="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{{ stat.delta }}</span>
          </div>
          <p class="text-4xl font-black text-white leading-none relative z-10">{{ stat.prefix }}{{ stat.value.toLocaleString() }}</p>
          <p class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mt-4 relative z-10">{{ stat.label }}</p>
        </div>
      </div>

      <!-- ================= DATA CENTER (CHARTS & LOGS) ================= -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- Oscilloscope Chart (Growth) -->
        <div class="lg:col-span-8 bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden">
          <div class="flex items-center justify-between mb-12">
            <div>
              <h2 class="text-sm font-black text-zinc-400 uppercase tracking-[0.4em]">Network Growth Telemetry</h2>
              <p class="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-1">6-Month Node Analysis</p>
            </div>
            <div class="flex gap-4">
              <div class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-rose-500"></span><span class="text-[9px] font-black uppercase text-zinc-500">Entities</span></div>
              <div class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-cyan-500"></span><span class="text-[9px] font-black uppercase text-zinc-500">Modules</span></div>
            </div>
          </div>

          <div class="relative h-64 w-full">
            <svg class="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
              <!-- User Line -->
              <polyline fill="none" stroke="#f43f5e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" :points="buildPolyline(growthData, 'users', maxUsers)" />
              <!-- Event Line -->
              <polyline fill="none" stroke="#06b6d4" stroke-width="2.5" stroke-dasharray="4" :points="buildPolyline(growthData, 'events', maxEvents)" />
            </svg>
            <div class="flex justify-between mt-8">
              <span v-for="d in growthData" :key="d.month" class="text-[9px] font-black text-zinc-700 uppercase">{{ d.month }}</span>
            </div>
          </div>
        </div>

        <!-- Moderation Log (Flags) -->
        <div class="lg:col-span-4 bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-10">
          <h2 class="text-sm font-black text-rose-500 uppercase tracking-[0.4em] mb-8">System Violation Log</h2>
          <div class="space-y-6">
            <div v-for="flag in recentFlags" :key="flag.text" class="group flex gap-4 relative">
              <div class="w-1 h-auto bg-white/5 rounded-full overflow-hidden shrink-0">
                <div class="h-1/2 w-full bg-rose-500 transition-all" :class="flag.severity === 'high' ? 'h-full' : 'h-1/3'"></div>
              </div>
              <div class="space-y-1">
                <p class="text-xs font-bold text-zinc-300 group-hover:text-white transition-colors leading-relaxed uppercase tracking-tight">{{ flag.text }}</p>
                <div class="flex items-center gap-3">
                  <span class="text-[9px] font-mono text-zinc-600">{{ flag.time }}</span>
                  <span class="text-[8px] font-black uppercase text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">Priority: {{ flag.severity }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ================= LIST CENTER (NODES & MODULES) ================= -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <!-- Pending Module Queue -->
        <div class="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden">
          <div class="p-8 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
            <h2 class="text-xs font-black text-white uppercase tracking-[0.3em]">Module Deployment Buffer</h2>
            <span class="px-3 py-1 bg-amber-500/10 text-amber-500 text-[9px] font-black rounded-lg border border-amber-500/20 uppercase tracking-widest">Verification Req.</span>
          </div>
          <div class="divide-y divide-white/5">
            <div v-for="event in pendingEvents" :key="event.id" class="p-8 flex items-center gap-6 group hover:bg-white/[0.01] transition-all">
              <img :src="event.image" class="w-20 h-14 rounded-xl object-cover border border-white/5 grayscale group-hover:grayscale-0 transition-all duration-500" />
              <div class="flex-1 min-w-0">
                <h3 class="font-black text-white tracking-tight truncate uppercase text-sm mb-1">{{ event.title }}</h3>
                <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Origin: {{ event.organizer }} · {{ event.submitted }}</p>
              </div>
              <div class="flex gap-2">
                <button class="p-3 bg-white/5 rounded-xl text-zinc-500 hover:text-emerald-400 transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke-width="3"/></svg></button>
                <button class="p-3 bg-white/5 rounded-xl text-zinc-500 hover:text-rose-400 transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-width="3"/></svg></button>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Node Identites -->
        <div class="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden">
          <div class="p-8 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
            <h2 class="text-xs font-black text-white uppercase tracking-[0.3em]">New Node Initializations</h2>
            <RouterLink to="/admin/users" class="text-[9px] font-black text-zinc-500 hover:text-white uppercase tracking-widest">Full Directory</RouterLink>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 divide-x divide-y divide-white/5">
            <div v-for="node in recentUsers" :key="node.email" class="p-8 flex items-center gap-5 group hover:bg-white/[0.01] transition-all">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center text-xs font-black group-hover:scale-110 transition-transform">{{ node.avatar }}</div>
              <div class="min-w-0">
                <p class="font-black text-white text-xs truncate uppercase tracking-tighter">{{ node.name }}</p>
                <p class="text-[9px] font-mono text-zinc-600 truncate">{{ node.email }}</p>
                <span :class="statusClasses[node.status] || 'text-zinc-500'" class="text-[8px] font-black uppercase px-2 py-0.5 rounded mt-2 inline-block border">{{ node.status }}</span>
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

polyline {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: draw 3s forwards ease-in-out;
}

@keyframes draw {
  to { stroke-dashoffset: 0; }
}
</style>
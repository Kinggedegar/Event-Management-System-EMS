<template>
  <div class="min-h-screen bg-[#050505] text-white relative font-sans p-4 md:p-8 overflow-x-hidden">
    
    <!-- Global Decorative Elements -->
    <div class="pointer-events-none fixed inset-0 z-0 opacity-[0.03]" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>
    <div class="absolute top-0 left-0 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
    <div class="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

    <div class="relative z-10 max-w-[90rem] mx-auto space-y-8">
      
      <!-- 1. LOADING STATE -->
      <div v-if="loading" class="py-60 flex flex-col items-center justify-center">
        <LoadingSpinner size="lg" />
        <p class="mt-4 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 animate-pulse">Synchronizing Logs...</p>
      </div>

      <!-- 2. ERROR / NOT FOUND STATE -->
      <div v-else-if="error || !event" class="py-40 text-center flex flex-col items-center justify-center bg-[#0a0a0a] border border-white/5 rounded-[3rem]">
        <div class="w-20 h-20 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(244,63,94,0.1)]">
          <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-width="2.5"/></svg>
        </div>
        <h2 class="text-3xl font-black text-white uppercase tracking-tighter mb-2">Module Access Failure</h2>
        <p class="text-zinc-500 mb-8 max-w-sm">The event module you are trying to access is either restricted or does not exist in current registry.</p>
        <router-link to="/organizer/events" class="px-8 py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">Return to Ledger</router-link>
      </div>
      
      <!-- 3. MAIN DOSSIER CONTENT -->
      <template v-else>
        <!-- HEADER -->
        <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl">
          <div>
            <div class="flex items-center gap-4 mb-4">
              <router-link to="/organizer/events" class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" /></svg>
              </router-link>
              <span :class="getStatusClass(event.status)" class="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] border backdrop-blur-md shadow-lg">
                {{ event.status }}
              </span>
            </div>
            <h1 class="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 tracking-tighter">
              {{ event.title }}
            </h1>
            <div class="flex items-center gap-3 mt-2 text-zinc-500 font-bold uppercase text-[10px] tracking-widest">
              <span>{{ formatDate(event.event_date) }}</span>
              <span class="w-1 h-1 rounded-full bg-zinc-800"></span>
              <span>{{ event.location }}</span>
            </div>
          </div>

          <div class="flex flex-wrap gap-3">
            <router-link :to="`/organizer/events/${event.id}/edit`" 
                         class="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              Modify Unit
            </router-link>
            <router-link :to="`/events/${event.id}`" target="_blank"
                         class="px-6 py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              Public Feed
            </router-link>
          </div>
        </div>

        <!-- ANALYTICS STRIP -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div v-for="(stat, key) in statConfig" :key="key" class="group bg-[#0a0a0a] border border-white/10 rounded-[2.2rem] p-6 hover:border-white/20 transition-all shadow-2xl relative overflow-hidden">
             <div class="absolute -top-12 -right-12 w-24 h-24 bg-white/5 blur-3xl rounded-full"></div>
            <p class="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">{{ stat.label }}</p>
            <p class="text-3xl font-black text-white group-hover:text-emerald-400 transition-colors">
              {{ key === 'revenue' ? '$' : '' }}{{ stat.value }}
            </p>
          </div>
        </div>

        <!-- TABS NAVIGATION -->
        <div class="flex p-1 bg-white/[0.03] border border-white/5 rounded-2xl w-fit backdrop-blur-md">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-500',
              activeTab === tab.id 
                ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
                : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
            ]"
          >
            {{ tab.name }}
          </button>
        </div>

        <!-- TAB CONTENT AREA -->
        <Transition name="fade" mode="out-in">
          <!-- Logistics Tab -->
          <div v-if="activeTab === 'registrations'" key="reg" class="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div class="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
              <h2 class="text-sm font-black text-white uppercase tracking-[0.3em]">Access Handshake Logs</h2>
              <button @click="exportRegistrations" class="px-5 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all">
                Export Audit (CSV)
              </button>
            </div>
            
            <div class="overflow-x-auto">
              <table class="w-full text-left">
                <thead>
                  <tr class="text-[10px] font-black text-zinc-600 uppercase tracking-widest bg-white/[0.02]">
                    <th class="px-8 py-5">Attendee Identity</th>
                    <th class="px-8 py-5">Access Level</th>
                    <th class="px-8 py-5 text-center">Units</th>
                    <th class="px-8 py-5">Yield</th>
                    <th class="px-8 py-5">Status</th>
                    <th class="px-8 py-5 text-right">Operations</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-white/5">
                  <tr v-for="reg in registrations" :key="reg.id" class="hover:bg-white/[0.02] transition-colors group">
                    <td class="px-8 py-5">
                      <p class="font-black text-white text-sm tracking-tight">{{ reg.user_name }}</p>
                      <p class="text-[10px] text-zinc-600 font-mono tracking-tighter">{{ reg.user_email }}</p>
                    </td>
                    <td class="px-8 py-5">
                      <span class="text-[10px] font-black text-zinc-400 uppercase tracking-widest border border-white/10 px-2 py-1 rounded bg-white/5">{{ reg.ticket_name }}</span>
                    </td>
                    <td class="px-8 py-5 text-center">
                      <span class="font-mono text-white font-black">{{ reg.quantity }}</span>
                    </td>
                    <td class="px-8 py-5">
                      <span class="font-black text-emerald-400/80 tracking-tighter">${{ reg.total_amount?.toFixed(2) }}</span>
                    </td>
                    <td class="px-8 py-5">
                      <span :class="getRegStatusClass(reg.status)" class="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm">
                        {{ reg.status }}
                      </span>
                    </td>
                    <td class="px-8 py-5 text-right">
                      <button 
                        v-if="reg.status === 'confirmed'"
                        @click="checkInAttendee(reg.id)"
                        class="p-2 bg-cyan-500 text-black rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                      >
                        Check In
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-if="registrations.length === 0" class="py-32 text-center text-zinc-700 font-black italic uppercase tracking-[0.2em]">
                Registry Empty: No handshakes detected.
              </div>
            </div>
          </div>

          <!-- Tickets Tab -->
          <div v-else-if="activeTab === 'tickets'" key="tkt" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="ticket in (event.tickets || [])" :key="ticket.id" 
                 class="p-8 bg-[#0a0a0a] border border-white/10 rounded-[3rem] relative overflow-hidden group hover:border-white/30 transition-all duration-500">
              <div class="absolute -top-12 -right-12 w-24 h-24 bg-white/5 blur-3xl rounded-full"></div>
              
              <div class="flex justify-between items-start mb-10">
                <div>
                  <h3 class="text-2xl font-black text-white tracking-tighter uppercase mb-1">{{ ticket.name }}</h3>
                  <p class="text-xs text-zinc-500 font-medium leading-relaxed max-w-[200px]">{{ ticket.description || 'Module Access Authorization' }}</p>
                </div>
                <p class="text-2xl font-black text-emerald-400 tracking-tighter">${{ ticket.price?.toFixed(2) }}</p>
              </div>

              <div class="space-y-3">
                <div class="flex justify-between items-end text-[10px] font-black uppercase tracking-widest">
                  <span class="text-zinc-600">Inventory Saturation</span>
                  <span class="text-white">{{ ticket.sold || 0 }} / {{ ticket.quantity }}</span>
                </div>
                <div class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-violet-600 to-cyan-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(139,92,246,0.3)]" 
                       :style="{ width: `${((ticket.sold || 0) / (ticket.quantity || 1)) * 100}%` }"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Reviews Tab -->
          <div v-else-if="activeTab === 'reviews'" key="rev" class="space-y-4">
            <div v-if="reviews.length === 0" class="py-40 text-center bg-[#0a0a0a] border border-white/10 rounded-[3rem] text-zinc-700 font-black italic uppercase tracking-widest">
              Satisfaction Telemetry: No Data Points Found.
            </div>
            <div v-else class="grid grid-cols-1 gap-4">
              <div v-for="review in reviews" :key="review.id" class="p-10 bg-[#0a0a0a] border border-white/10 rounded-[3rem] hover:border-violet-500/30 transition-all group">
                <div class="flex items-center justify-between mb-8">
                  <div class="flex items-center gap-5">
                    <div class="w-12 h-12 rounded-[1rem] bg-gradient-to-tr from-cyan-500 to-purple-500 flex items-center justify-center text-xs font-black shadow-lg">
                      {{ review.user_name?.[0] }}
                    </div>
                    <div>
                      <p class="font-black text-white uppercase tracking-widest text-sm">{{ review.user_name }}</p>
                      <p class="text-[9px] text-zinc-600 font-mono font-bold uppercase">{{ formatDate(review.created_at) }}</p>
                    </div>
                  </div>
                  <div class="flex gap-1.5 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                    <svg v-for="i in 5" :key="i" 
                         :class="i <= review.rating ? 'text-amber-400 fill-current shadow-lg' : 'text-zinc-800'"
                         class="w-4 h-4 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                </div>
                <p class="text-zinc-400 font-medium text-lg leading-relaxed italic max-w-4xl">"{{ review.comment }}"</p>
              </div>
            </div>
          </div>
        </Transition>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const route = useRoute()

const loading = ref(true)
const error = ref(null)
const event = ref(null)
const registrations = ref([])
const reviews = ref([])
const activeTab = ref('registrations')

const tabs = [
  { id: 'registrations', name: 'Logistics' },
  { id: 'tickets', name: 'Tiers' },
  { id: 'reviews', name: 'Feedback' }
]

const stats = ref({
  totalRegistrations: 0,
  ticketsSold: 0,
  revenue: 0,
  checkedIn: 0
})

const statConfig = computed(() => ({
  total: { label: 'Logistics Volume', value: stats.value.totalRegistrations },
  sold: { label: 'Units Allocated', value: stats.value.ticketsSold },
  revenue: { label: 'Yield Total', value: stats.value.revenue.toLocaleString(undefined, {minimumFractionDigits: 2}) },
  checkin: { label: 'Active Sessions', value: stats.value.checkedIn }
}))

const formatDate = (date) => {
  if(!date) return 'TBA'
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  }).toUpperCase()
}

const getStatusClass = (status) => {
  const classes = {
    published: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_20px_rgba(52,211,153,0.1)]',
    active: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_20px_rgba(52,211,153,0.1)]',
    draft: 'text-zinc-500 border-white/10 bg-white/5',
    cancelled: 'text-rose-400 border-rose-500/30 bg-rose-500/10'
  }
  return classes[status] || 'text-zinc-400 border-zinc-500/30 bg-zinc-500/10'
}

const getRegStatusClass = (status) => {
  const classes = {
    confirmed: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
    pending: 'text-amber-400 border-amber-500/20 bg-amber-500/5',
    cancelled: 'text-rose-400 border-rose-500/20 bg-rose-500/5',
    checked_in: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5'
  }
  return classes[status] || 'text-zinc-500 border-white/5'
}

const checkInAttendee = async (registrationId) => {
  try {
    await api.post(`/registrations/${registrationId}/check-in`)
    const reg = registrations.value.find(r => r.id === registrationId)
    if (reg) reg.status = 'checked_in'
    stats.value.checkedIn++
  } catch (err) {
    alert(err.response?.data?.error || 'System Auth Failure')
  }
}

const exportRegistrations = () => {
  if(!registrations.value.length) return
  const csv = [
    ['Name', 'Email', 'Ticket', 'Quantity', 'Amount', 'Status'].join(','),
    ...registrations.value.map(r => [
      r.user_name, r.user_email, r.ticket_name, r.quantity, r.total_amount, r.status
    ].join(','))
  ].join('\n')
  
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `audit-log-${event.value.id}.csv`
  a.click()
}

// FALLBACK MOCK DATA (In case API is failing during design)
const loadFallback = () => {
  event.value = { id: 1, title: 'SYNTH_WAVE_SUMMIT_2026', status: 'published', location: 'SECTOR_7_G', event_date: new Date(), tickets: [{name: 'ELITE_PASS', price: 299, sold: 42, quantity: 100}] }
  registrations.value = [{id: 1, user_name: 'RETR0', user_email: 'admin@system.io', ticket_name: 'ELITE_PASS', quantity: 1, total_amount: 299, status: 'confirmed'}]
  stats.value = { totalRegistrations: 1, ticketsSold: 1, revenue: 299, checkedIn: 0 }
}

const fetchData = async () => {
  error.value = null
  loading.value = true
  try {
    const eventId = route.params.id
    if(!eventId) throw new Error('ID_MISSING')

    const [eventRes, regsRes, reviewsRes] = await Promise.all([
      api.get(`/events/${eventId}`),
      api.get(`/registrations/event/${eventId}`),
      api.get(`/reviews/event/${eventId}`)
    ])
    
    event.value = eventRes.data.event || eventRes.data
    registrations.value = regsRes.data.registrations || []
    reviews.value = reviewsRes.data.reviews || []
    
    stats.value = {
      totalRegistrations: registrations.value.length,
      ticketsSold: registrations.value.reduce((sum, r) => sum + r.quantity, 0),
      revenue: registrations.value.reduce((sum, r) => sum + (Number(r.total_amount) || 0), 0),
      checkedIn: registrations.value.filter(r => r.status === 'checked_in').length
    }
  } catch (err) {
    console.warn('Backend link severed. Utilizing local buffer.')
    // loadFallback() // Uncomment if you want to see data while backend is broken
    error.value = "PROTOCOL_TIMEOUT"
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1); }
.fade-enter-from { opacity: 0; transform: translateY(10px); }
.fade-leave-to { opacity: 0; transform: translateY(-10px); }

h1, h2, h3, p, span, button, th, td {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
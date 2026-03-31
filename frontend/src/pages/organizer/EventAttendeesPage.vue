<template>
  <div class="min-h-screen bg-[#050505] text-white relative font-sans p-4 md:p-8 overflow-x-hidden">
    
    <!-- Global Decorative Elements -->
    <div class="pointer-events-none fixed inset-0 z-0 opacity-[0.03]" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>
    <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

    <div class="relative z-10 max-w-[90rem] mx-auto space-y-8">
      
      <!-- ================= HEADER ================= -->
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl">
        <div>
          <div class="flex items-center gap-3 mb-4">
            <router-link :to="`/organizer/events/${$route.params.id}`" class="text-zinc-500 hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" /></svg>
            </router-link>
            <span class="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Registry Dossier</span>
          </div>
          <h1 class="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 tracking-tighter">
            Attendee Manifest
          </h1>
          <p class="text-zinc-500 font-medium mt-1 uppercase text-[10px] tracking-widest">{{ event.title }} // {{ formatDate(event.event_date) }}</p>
        </div>

        <div class="flex gap-3">
          <button @click="exportManifest" class="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
            Export CSV
          </button>
          <router-link :to="`/organizer/events/${$route.params.id}/edit`"
                       class="px-6 py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)]">
            Modify Module
          </router-link>
        </div>
      </div>

      <!-- ================= TELEMETRY CARDS ================= -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div class="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-6 relative overflow-hidden group">
          <p class="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Saturation Level</p>
          <div class="flex items-end gap-2">
            <p class="text-3xl font-black text-white">{{ attendees.length }}</p>
            <p class="text-zinc-600 font-bold mb-1">/ {{ event.capacity || '∞' }}</p>
          </div>
          <div class="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div class="h-full bg-cyan-500 transition-all duration-1000" :style="{ width: `${(attendees.length / (event.capacity || 100)) * 100}%` }"></div>
          </div>
        </div>

        <div class="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-6">
          <p class="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Verified Entries</p>
          <p class="text-3xl font-black text-emerald-400">{{ checkedInCount }}</p>
          <p class="text-[10px] text-zinc-500 font-bold mt-1 uppercase tracking-tighter">Check-in Rate: {{ ((checkedInCount / (attendees.length || 1)) * 100).toFixed(1) }}%</p>
        </div>

        <div class="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-6">
          <p class="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Ticket Yield</p>
          <p class="text-3xl font-black text-white">{{ totalTickets }} <span class="text-sm text-zinc-600 uppercase">Units</span></p>
          <p class="text-[10px] text-zinc-500 font-bold mt-1 uppercase tracking-tighter">Avg. Quantity: {{ (totalTickets / (attendees.length || 1)).toFixed(1) }}</p>
        </div>
      </div>

      <!-- ================= FILTERS ================= -->
      <div class="bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-4 relative z-10">
        <div class="flex-1 relative group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-4.35-4.35m1.6-4.15a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="SEARCH BY NAME OR ADDRESS..."
            class="w-full pl-11 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-zinc-700 focus:outline-none focus:border-cyan-400/50 transition-all font-mono text-sm"
          />
        </div>
        <select v-model="statusFilter" class="bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 outline-none appearance-none cursor-pointer hover:border-white/20">
          <option value="">All Statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Voided</option>
        </select>
      </div>

      <!-- ================= MANIFEST TABLE ================= -->
      <div class="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden">
        <LoadingSpinner v-if="loading" class="py-20" />
        
        <div v-else-if="filteredAttendees.length === 0" class="py-20 text-center">
          <p class="text-zinc-600 font-black uppercase tracking-[0.2em] italic">Manifest Empty: No matching entities found.</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-white/[0.02] border-b border-white/5">
                <th class="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Entity Identity</th>
                <th class="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Access Units</th>
                <th class="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Timestamp</th>
                <th class="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Status</th>
                <th class="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Operations</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr v-for="attendee in filteredAttendees" :key="attendee.id" class="hover:bg-white/[0.01] transition-colors group">
                <td class="px-8 py-5">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
                      <span class="text-xs font-black text-white">{{ attendee.name.charAt(0).toUpperCase() }}</span>
                    </div>
                    <div>
                      <p class="text-sm font-black text-white tracking-tight uppercase">{{ attendee.name }}</p>
                      <p class="text-[10px] font-mono text-zinc-600">{{ attendee.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-8 py-5">
                  <span class="font-mono text-white text-sm bg-white/5 px-2 py-1 rounded border border-white/5">
                    {{ attendee.quantity.toString().padStart(2, '0') }}
                  </span>
                </td>
                <td class="px-8 py-5">
                  <p class="text-[10px] font-bold text-zinc-400">{{ formatDate(attendee.registration_date) }}</p>
                </td>
                <td class="px-8 py-5">
                  <span :class="getStatusClass(attendee.status)" class="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border backdrop-blur-md">
                    {{ attendee.status }}
                  </span>
                </td>
                <td class="px-8 py-5 text-right">
                  <button v-if="attendee.status !== 'confirmed' && attendee.status !== 'checked_in'"
                          @click="checkInAttendee(attendee.id)"
                          class="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all">
                    Validate Entry
                  </button>
                  <span v-else class="text-zinc-700 text-[8px] font-black uppercase tracking-widest">Handshake Complete</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const route = useRoute()
const event = ref({})
const attendees = ref([])
const loading = ref(true)
const searchQuery = ref('')
const statusFilter = ref('')

// --- Computed Metrics ---
const filteredAttendees = computed(() => {
  return attendees.value.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                         a.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = !statusFilter.value || a.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

const checkedInCount = computed(() => attendees.value.filter(a => a.status === 'checked_in' || a.status === 'confirmed').length)
const totalTickets = computed(() => attendees.value.reduce((acc, curr) => acc + (curr.quantity || 1), 0))

// --- Methods ---
const formatDate = (dateString) => {
  if (!dateString) return 'PENDING'
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
  }).toUpperCase()
}

const getStatusClass = (status) => {
  const classes = {
    confirmed: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5 shadow-[0_0_10px_rgba(52,211,153,0.1)]',
    checked_in: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/5 shadow-[0_0_10px_rgba(34,211,238,0.1)]',
    pending: 'text-amber-400 border-amber-500/30 bg-amber-500/5',
    cancelled: 'text-rose-400 border-rose-500/30 bg-rose-500/5'
  }
  return classes[status] || 'text-zinc-500 border-white/10'
}

const checkInAttendee = async (registrationId) => {
  try {
    // Optimistic UI update
    const attendee = attendees.value.find(a => a.id === registrationId)
    if (attendee) attendee.status = 'confirmed'

    await axios.put(`/api/registrations/${registrationId}/checkin`)
    await fetchAttendees() // Refresh to sync exact server state
  } catch (error) {
    console.error('Handshake Failure:', error)
    alert('Failed to validate entity access.')
  }
}

const exportManifest = () => {
  const csvContent = [
    ['Name', 'Email', 'Quantity', 'Date', 'Status'].join(','),
    ...attendees.value.map(a => [a.name, a.email, a.quantity, a.registration_date, a.status].join(','))
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.setAttribute('href', url)
  a.setAttribute('download', `manifest-${event.value.title || 'event'}.csv`)
  a.click()
}

const fetchEvent = async () => {
  try {
    const response = await axios.get(`/api/events/${route.params.id}`)
    event.value = response.data
  } catch (e) { console.error('Module Fetch Error') }
}

const fetchAttendees = async () => {
  try {
    loading.value = true
    const response = await axios.get(`/api/events/${route.params.id}/attendees`)
    attendees.value = response.data
  } catch (e) { console.error('Manifest Fetch Error') } 
  finally { loading.value = false }
}

onMounted(() => {
  fetchEvent()
  fetchAttendees()
})
</script>

<style scoped>
h1, h2, h3, p, span, button, th, td {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1.25rem center;
  background-size: 0.8rem;
}
</style>
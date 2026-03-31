<template>
  <div class="min-h-screen bg-[#050505] text-white relative font-sans p-4 md:p-8 overflow-x-hidden">
    
    <!-- Global Decorative Elements -->
    <div class="pointer-events-none fixed inset-0 z-0 opacity-[0.03]" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>
    <div class="absolute top-0 left-0 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
    <div class="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

    <div class="relative z-10 max-w-[90rem] mx-auto space-y-8">
      
      <!-- ================= HEADER & SUMMARY ================= -->
      <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-xl">
        <div class="space-y-4">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
              <span class="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
              <span class="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Operational Ledger</span>
            </div>
            <h1 class="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 tracking-tighter">
              My Event Modules
            </h1>
            <p class="text-zinc-400 font-medium mt-1">Audit and manage your deployed platform experiences.</p>
          </div>

          <!-- Mini Status Stats -->
          <div class="flex flex-wrap gap-6 pt-2">
            <div class="flex flex-col">
              <span class="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Active Units</span>
              <span class="text-xl font-black text-emerald-400">{{ summary.live }}</span>
            </div>
            <div class="w-px h-8 bg-white/5 hidden sm:block"></div>
            <div class="flex flex-col">
              <span class="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Draft Buffer</span>
              <span class="text-xl font-black text-amber-400">{{ summary.draft }}</span>
            </div>
            <div class="w-px h-8 bg-white/5 hidden sm:block"></div>
            <div class="flex flex-col">
              <span class="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Total Yield</span>
              <span class="text-xl font-black text-white">${{ summary.revenue.toLocaleString() }}</span>
            </div>
          </div>
        </div>

        <router-link to="/organizer/events/create" 
                     class="px-10 py-5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center gap-3">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" /></svg>
          Initialize New Module
        </router-link>
      </div>

      <!-- ================= FILTERS ================= -->
      <div class="bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-4 relative z-10">
        <div class="flex-1 relative group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-4.35-4.35m1.6-4.15a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by module title..."
            class="w-full pl-11 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-all font-medium"
          />
        </div>
        
        <div class="flex gap-4">
          <select v-model="statusFilter" class="w-full md:w-48 px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-zinc-300 outline-none focus:border-violet-400 transition-all cursor-pointer font-medium appearance-none">
            <option value="">All Deployments</option>
            <option value="draft">Draft Buffer</option>
            <option value="published">Live Status</option>
            <option value="cancelled">Terminated</option>
          </select>
          
          <button v-if="searchQuery || statusFilter" @click="clearFilters" class="px-4 text-[10px] font-black text-zinc-500 uppercase hover:text-white transition-colors">
            Reset
          </button>
        </div>
      </div>

      <LoadingSpinner v-if="loading" class="py-40" />
      
      <!-- ================= STATES ================= -->
      
      <!-- State A: No Events Created Yet -->
      <div v-else-if="events.length === 0" class="text-center py-32 bg-[#0a0a0a] border border-dashed border-white/10 rounded-[3rem]">
        <div class="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </div>
        <h3 class="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Zero Modules Detected</h3>
        <p class="text-zinc-500 font-medium mb-8">Your deployment pipeline is empty. Launch your first event.</p>
        <router-link to="/organizer/events/create" 
                     class="px-10 py-5 bg-violet-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-violet-500 transition-all shadow-xl">
          Deploy First Module
        </router-link>
      </div>

      <!-- State B: No Search Matches -->
      <div v-else-if="filteredEvents.length === 0" class="text-center py-32 bg-[#0a0a0a] border border-white/5 rounded-[3rem]">
        <h3 class="text-xl font-black text-zinc-400 uppercase">Query returned null</h3>
        <p class="text-zinc-600 font-medium mt-2">Adjust your filters to locate the module.</p>
        <button @click="clearFilters" class="mt-6 text-xs font-black text-cyan-500 uppercase tracking-widest">Clear All Parameters</button>
      </div>

      <!-- State C: The List -->
      <div v-else class="space-y-6">
        <TransitionGroup name="list">
          <div v-for="event in filteredEvents" :key="event.id" 
               class="group relative bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-white/20 transition-all duration-500">
            
            <div class="flex flex-col lg:flex-row">
              <!-- Left: Visual & Status -->
              <div class="lg:w-80 h-56 lg:h-auto relative overflow-hidden shrink-0">
                <img 
                  :src="event.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'" 
                  class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 grayscale-[0.5] group-hover:grayscale-0"
                />
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0a0a0a] hidden lg:block"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent lg:hidden block"></div>
                
                <div class="absolute top-6 left-6">
                  <span :class="getStatusClass(event.status)" class="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] border backdrop-blur-md">
                    {{ event.status }}
                  </span>
                </div>
              </div>

              <!-- Right: Content & Data -->
              <div class="flex-1 p-8 md:p-10 flex flex-col justify-between">
                <div>
                  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 class="text-2xl md:text-3xl font-black text-white tracking-tighter group-hover:text-cyan-400 transition-colors">{{ event.title }}</h3>
                      <p class="text-sm text-zinc-500 font-medium italic line-clamp-1 mt-1 max-w-xl">{{ event.description }}</p>
                    </div>
                    <span class="text-[10px] font-bold text-zinc-700 font-mono tracking-tighter uppercase whitespace-nowrap px-3 py-1 bg-white/5 rounded-lg border border-white/5">
                      ID_{{ event.id.toString().padStart(4, '0') }}
                    </span>
                  </div>
                  
                  <!-- Metrics Data Grid -->
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-8 p-6 bg-white/[0.02] border border-white/5 rounded-3xl mb-8">
                    <div>
                      <p class="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-1">Schedule</p>
                      <p class="font-bold text-zinc-200 text-sm tracking-tight">{{ formatDate(event.event_date) }}</p>
                    </div>
                    <div>
                      <p class="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-1">Deployment Vector</p>
                      <p class="font-bold text-zinc-200 text-sm tracking-tight truncate">{{ event.location || 'Remote Node' }}</p>
                    </div>
                    <div>
                      <p class="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-1">Registry</p>
                      <p class="font-bold text-zinc-200 text-sm tracking-tight">{{ event.registration_count || 0 }} Registered</p>
                    </div>
                    <div>
                      <p class="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-1">Financial Yield</p>
                      <p class="font-black text-emerald-400 text-sm tracking-tight">${{ (event.revenue || 0).toFixed(2) }}</p>
                    </div>
                  </div>
                </div>
                
                <!-- Command Cluster -->
                <div class="flex flex-wrap items-center gap-3">
                  <router-link 
                    :to="`/organizer/events/${event.id}`"
                    class="px-6 py-2.5 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center gap-2"
                  >
                    Dossier
                  </router-link>
                  
                  <router-link 
                    :to="`/organizer/events/${event.id}/edit`"
                    class="px-6 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"
                  >
                    Modify
                  </router-link>
                  
                  <button 
                    v-if="event.status === 'draft'"
                    @click="publishEvent(event.id)"
                    class="px-6 py-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all"
                  >
                    Activate Module
                  </button>
                  
                  <div class="ml-auto">
                    <button 
                      v-if="event.status !== 'cancelled'"
                      @click="handleCancel(event.id)"
                      class="px-6 py-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
                    >
                      Terminate
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

// --- State ---
const loading = ref(true)
const events = ref([])
const searchQuery = ref('')
const statusFilter = ref('')

// --- Computed ---

// Summarize event list for the header stats
const summary = computed(() => {
  return {
    live: events.value.filter(e => e.status === 'published').length,
    draft: events.value.filter(e => e.status === 'draft').length,
    revenue: events.value.reduce((acc, curr) => acc + (Number(curr.revenue) || 0), 0)
  }
})

// Filter logic (runs reactively when search or status changes)
const filteredEvents = computed(() => {
  return events.value.filter(event => {
    const matchesSearch = !searchQuery.value || 
      event.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = !statusFilter.value || event.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

// --- Methods ---

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
}

const formatDate = (date) => {
  if (!date) return 'TBA'
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  }).toUpperCase()
}

const getStatusClass = (status) => {
  const classes = {
    published: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_15px_rgba(52,211,153,0.1)]',
    draft: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    cancelled: 'text-rose-400 border-rose-500/30 bg-rose-500/10'
  }
  return classes[status] || 'text-zinc-500 border-zinc-500/30 bg-zinc-500/10'
}

// Logic: Activate a draft module
const publishEvent = async (eventId) => {
  try {
    // Optimistic Update: Change status locally first for immediate UI response
    const eventIndex = events.value.findIndex(e => e.id === eventId)
    if (eventIndex !== -1) events.value[eventIndex].status = 'published'

    await api.put(`/events/${eventId}`, { status: 'published' })
  } catch (error) {
    // Rollback if server fails
    fetchEvents()
    alert(error.response?.data?.error || 'Authorization Failed: Protocol rejected publication.')
  }
}

// Logic: Cancel/Terminate a module
const handleCancel = async (eventId) => {
  if (!confirm('SYSTEM WARNING: Authorize permanent termination of this module?')) return
  
  try {
    const eventIndex = events.value.findIndex(e => e.id === eventId)
    if (eventIndex !== -1) events.value[eventIndex].status = 'cancelled'

    await api.put(`/events/${eventId}`, { status: 'cancelled' })
  } catch (error) {
    fetchEvents()
    alert(error.response?.data?.error || 'Termination Refused: Access denied.')
  }
}

const fetchEvents = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/events/my-events')
    events.value = data.events || []
  } catch (error) {
    console.error('Handshake error: Failed to fetch module ledger.')
  } finally {
    loading.value = false
  }
}

onMounted(fetchEvents)
</script>

<style scoped>
/* List Transitions */
.list-enter-active, .list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from, .list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1.25rem center;
  background-size: 0.8rem;
}

h1, h2, h3, p, span, button {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
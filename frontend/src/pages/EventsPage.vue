<template>
  <div class="min-h-screen bg-[#050505] text-white relative font-sans overflow-x-hidden">
    
    <!-- ══════════════════════════════════════════ -->
    <!-- GLOBAL ATMOSPHERE                         -->
    <!-- ══════════════════════════════════════════ -->
    <div class="pointer-events-none fixed inset-0 z-0 opacity-[0.03]" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>
    <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
    <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

    <!-- ══════════════════════════════════════════ -->
    <!-- PAGE HEADER                               -->
    <!-- ══════════════════════════════════════════ -->
    <div class="relative pt-32 pb-12 z-10">
      <div class="max-w-[90rem] mx-auto px-6 md:px-12">
        <div class="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-8">
          <router-link to="/" class="hover:text-white transition-colors">Origin</router-link>
          <span class="w-1 h-1 rounded-full bg-zinc-800"></span>
          <span class="text-zinc-300">Module Registry</span>
        </div>

        <div class="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
              <span class="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
              <span class="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Live Discovery Stream</span>
            </div>
            <h1 class="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 tracking-tighter uppercase">
              {{ route.query.featured === 'true' ? 'Priority Access' : 'All Modules' }}
            </h1>
            <p class="text-zinc-400 mt-4 text-lg font-medium max-w-xl italic">Querying global database for active operational modules and summits.</p>
          </div>

          <div v-if="!loading" class="bg-white/[0.03] border border-white/10 rounded-3xl p-6 backdrop-blur-xl group">
            <p class="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1 group-hover:text-cyan-400 transition-colors">Registry Count</p>
            <p class="text-3xl font-black text-white">
              {{ eventsStore.pagination.total?.toLocaleString() || 0 }} <span class="text-sm font-medium text-zinc-600">UNITS</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- New Events Notification -->
    <Transition name="slide-down">
      <div v-if="newEventsAvailable" class="sticky top-24 z-[100] flex justify-center px-6 pointer-events-none">
        <button @click="refreshNow" class="pointer-events-auto flex items-center gap-3 px-6 py-3 rounded-2xl bg-cyan-500 text-black shadow-[0_20px_40px_rgba(34,211,238,0.3)] hover:scale-105 transition-all">
          <span class="text-xs font-black uppercase tracking-widest">{{ newEventsCount }} New Handshakes Detected</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </button>
      </div>
    </Transition>

    <!-- ══════════════════════════════════════════ -->
    <!-- COMMAND CONSOLE (STIKY FILTERS)           -->
    <!-- ══════════════════════════════════════════ -->
    <div class="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-xl border-y border-white/5 shadow-2xl">
      <div class="max-w-[90rem] mx-auto px-6 md:px-12 py-5">
        <div class="flex flex-col lg:flex-row gap-4">

          <!-- Deep Search -->
          <div class="flex-1 relative group">
            <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-cyan-500 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="SEARCH BY IDENTIFIER OR VENUE..."
              class="w-full pl-14 pr-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-white placeholder-zinc-700 outline-none focus:border-cyan-500/50 focus:bg-white/[0.05] transition-all"
              @keyup.enter="updateFilters"
            />
          </div>

          <!-- Dynamic Parameter Hub -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 lg:w-[60%]">
            <select v-model="selectedCategory" @change="updateFilters" class="terminal-select">
              <option value="">ALL SECTORS</option>
              <option v-for="cat in eventsStore.categories" :key="cat.id" :value="cat.id">{{ cat.name.toUpperCase() }}</option>
            </select>

            <input v-model="selectedCity" @keyup.enter="updateFilters" placeholder="LOC_VECTOR" class="terminal-input text-center" />

            <select v-model="sortBy" @change="updateFilters" class="terminal-select">
              <option value="date">CHRONOLOGICAL</option>
              <option value="title">ALPHABETICAL</option>
              <option value="created_at">RECENT LOGS</option>
            </select>

            <div class="flex p-1 bg-white/[0.03] border border-white/10 rounded-2xl">
              <button @click="viewMode = 'grid'" :class="viewMode === 'grid' ? 'bg-white text-black' : 'text-zinc-500'" class="flex-1 flex items-center justify-center rounded-xl transition-all">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              </button>
              <button @click="viewMode = 'list'" :class="viewMode === 'list' ? 'bg-white text-black' : 'text-zinc-500'" class="flex-1 flex items-center justify-center rounded-xl transition-all">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Active Filter Telemetry -->
        <div v-if="hasActiveFilters" class="flex items-center gap-3 mt-5 flex-wrap">
          <span class="text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em]">Telemetry Filters:</span>
          <button v-if="searchQuery" @click="removeFilter('search')" class="chip">"{{ searchQuery }}" ✕</button>
          <button v-if="selectedCategory" @click="removeFilter('category')" class="chip">{{ selectedCategoryName }} ✕</button>
          <button v-if="route.query.featured === 'true'" @click="removeFilter('featured')" class="chip bg-violet-500/10 text-violet-400 border-violet-500/20">PRIORITY ONLY ✕</button>
          <button @click="clearFilters" class="text-[9px] font-black text-rose-500 uppercase tracking-widest hover:text-white ml-2 transition-colors">Terminate All</button>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════ -->
    <!-- MAIN DOSSIER AREA                         -->
    <!-- ══════════════════════════════════════════ -->
    <div class="max-w-[90rem] mx-auto px-6 md:px-12 py-12 relative z-10 min-h-[60vh]">

      <div v-if="loading" class="py-40 flex flex-col items-center justify-center">
        <LoadingSpinner size="lg" />
        <p class="mt-6 text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600 animate-pulse">Syncing Registry...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="eventsStore.events.length === 0" class="text-center py-40 bg-[#0a0a0a] border border-white/5 rounded-[4rem] border-dashed">
        <div class="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-8 shadow-2xl">
          <svg class="w-10 h-10 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <h3 class="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Null Result</h3>
        <p class="text-zinc-500 font-medium mb-10">System could not locate modules matching your current cipher.</p>
        <button @click="clearFilters" class="px-8 py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all">Reset Console</button>
      </div>

      <!-- Grid view -->
      <template v-else>
        <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="event in eventsStore.events" :key="event.id"
            class="group relative bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-white/20 hover:-translate-y-2 transition-all duration-500">
            
            <div class="relative h-60 overflow-hidden">
              <img :src="event.image_url || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800'" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-70 grayscale-[0.3] group-hover:grayscale-0" />
              <div class="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent"></div>
              
              <!-- Indicators -->
              <div class="absolute top-5 left-5 flex gap-2">
                <span v-if="event.featured" class="px-3 py-1 bg-violet-600 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">Priority</span>
                <span v-if="event.price_cents === 0" class="px-3 py-1 bg-emerald-600 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">Open</span>
              </div>
              
              <div class="absolute bottom-5 right-5 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col items-center">
                 <span class="text-[10px] font-black text-zinc-300 uppercase">{{ new Date(event.event_date).toLocaleDateString('en-US', { month: 'short' }) }}</span>
                 <span class="text-xl font-black text-white leading-none">{{ new Date(event.event_date).getDate() }}</span>
              </div>
            </div>

            <div class="p-8">
              <div class="flex items-center gap-3 mb-4">
                <span class="text-[9px] font-black text-cyan-400 uppercase tracking-widest bg-cyan-400/5 border border-cyan-400/10 px-2 py-1 rounded-lg">
                  {{ event.category_name || 'General' }}
                </span>
              </div>

              <h3 class="text-xl font-black text-white mb-6 line-clamp-2 leading-tight uppercase group-hover:text-cyan-400 transition-colors">
                {{ event.title }}
              </h3>

              <div class="flex items-center justify-between pt-6 border-t border-white/5">
                <p class="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke-width="3"/></svg>
                  {{ event.location || 'Remote' }}
                </p>
                <router-link :to="`/events/${event.id}`" class="text-[10px] font-black text-white hover:text-cyan-400 uppercase flex items-center gap-2 group/btn">
                  Dossier
                  <svg class="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke-width="3"/></svg>
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- List view -->
        <div v-else class="flex flex-col gap-4">
          <div v-for="event in eventsStore.events" :key="event.id"
            class="group flex flex-col md:flex-row items-center gap-8 p-6 rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 hover:border-cyan-500/30 transition-all duration-500">
            <div class="w-full md:w-48 h-32 rounded-2xl overflow-hidden shrink-0">
              <img :src="event.image_url || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400'" class="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
            </div>
            <div class="flex-1 w-full">
              <span class="text-[9px] font-black text-cyan-500 uppercase tracking-[0.3em]">{{ event.category_name }}</span>
              <h3 class="text-2xl font-black text-white mt-1 mb-2 uppercase tracking-tight group-hover:text-cyan-400 transition-colors">{{ event.title }}</h3>
              <p class="text-zinc-500 text-[10px] font-black uppercase tracking-widest">{{ formatDate(event.event_date) }} • {{ event.location }}</p>
            </div>
            <div class="flex items-center gap-8 border-t md:border-none border-white/5 pt-6 md:pt-0 w-full md:w-auto justify-between">
              <span class="text-2xl font-black text-white tracking-tighter">{{ event.price_cents > 0 ? `$${(event.price_cents/100).toFixed(0)}` : 'FREE' }}</span>
              <RouterLink :to="`/events/${event.id}`" class="px-8 py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-cyan-400 transition-all">
                Initialize
              </RouterLink>
            </div>
          </div>
        </div>

        <!-- Pagination (Industrial) -->
        <div v-if="eventsStore.pagination.pages > 1" class="mt-24 flex flex-col md:flex-row items-center justify-between gap-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-6">
          <p class="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
            Page {{ eventsStore.pagination.page }} of {{ eventsStore.pagination.pages }} // Total entries: {{ eventsStore.pagination.total }}
          </p>

          <div class="flex items-center gap-3">
            <button @click="changePage(eventsStore.pagination.page - 1)" :disabled="eventsStore.pagination.page === 1" class="p-4 rounded-2xl bg-white/5 border border-white/10 disabled:opacity-10 hover:bg-white/10 transition-all">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke-width="3"/></svg>
            </button>
            <button v-for="page in pageWindow" :key="page" @click="page !== '...' && changePage(page)"
                :class="['w-12 h-12 rounded-2xl text-[10px] font-black transition-all', page === eventsStore.pagination.page ? 'bg-white text-black scale-110 shadow-xl' : 'bg-white/5 border border-white/10 text-zinc-500 hover:text-white hover:bg-white/10']">
              {{ page }}
            </button>
            <button @click="changePage(eventsStore.pagination.page + 1)" :disabled="eventsStore.pagination.page === eventsStore.pagination.pages" class="p-4 rounded-2xl bg-white/5 border border-white/10 disabled:opacity-10 hover:bg-white/10 transition-all">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke-width="3"/></svg>
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, computed, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEventsStore } from '../stores/events'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()
const eventsStore = useEventsStore()

const loading = ref(true)
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedCity = ref('')
const sortBy = ref('date')
const viewMode = ref('grid')

let pollId = null
let lastTotal = 0
const newEventsAvailable = ref(false)
const newEventsCount = ref(0)

onMounted(async () => {
  // Sync URL params to local state
  searchQuery.value = route.query.search || ''
  selectedCategory.value = route.query.category || ''
  selectedCity.value = route.query.city || ''
  sortBy.value = route.query.sort || 'date'

  await eventsStore.fetchCategories()
  await fetchEvents(1)
  
  lastTotal = eventsStore.pagination.total || 0
  pollId = setInterval(async () => {
    try {
      const p = buildParams(eventsStore.pagination.page || 1)
      await eventsStore.fetchEvents(p, true) // Silent fetch support in store?
      const newTotal = eventsStore.pagination.total || 0
      if (newTotal > lastTotal) {
        newEventsAvailable.value = true
        newEventsCount.value = newTotal - lastTotal
      }
      lastTotal = newTotal
    } catch (e) { /* ignore */ }
  }, 30000)
})

onUnmounted(() => { if (pollId) clearInterval(pollId) })

// Logic: Build standard parameter object
function buildParams(page) {
  return {
    search: searchQuery.value || undefined,
    category: selectedCategory.value || undefined,
    city: selectedCity.value || undefined,
    sort: sortBy.value,
    page: page,
    limit: 12,
    // FIX: Perfect Featured Logic
    featured: route.query.featured === 'true' || route.query.feature === 'true' ? true : undefined
  }
}

async function fetchEvents(page = 1) {
  loading.value = true
  try {
    await eventsStore.fetchEvents(buildParams(page))
  } finally {
    loading.value = false
  }
}

// Logic: Reactive Filter Update
function updateFilters() {
  const query = { ...route.query }
  if (searchQuery.value) query.search = searchQuery.value; else delete query.search
  if (selectedCategory.value) query.category = selectedCategory.value; else delete query.category
  if (selectedCity.value) query.city = selectedCity.value; else delete query.city
  if (sortBy.value !== 'date') query.sort = sortBy.value; else delete query.sort
  
  router.push({ query })
  fetchEvents(1)
}

function clearFilters() {
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedCity.value = ''
  sortBy.value = 'date'
  router.push({ query: {} })
  fetchEvents(1)
}

function removeFilter(type) {
  if (type === 'search') searchQuery.value = ''
  if (type === 'category') selectedCategory.value = ''
  if (type === 'featured') {
      const q = { ...route.query }
      delete q.featured; delete q.feature
      router.push({ query: q })
  }
  updateFilters()
}

// Watch URL changes (Back button / Home links)
watch(() => route.query, () => {
    // Sync state if coming from home
    if (route.query.featured === 'true') fetchEvents(1)
}, { deep: true })

function changePage(page) { fetchEvents(page); window.scrollTo({ top: 0, behavior: 'smooth' }) }
function refreshNow() { newEventsAvailable.value = false; newEventsCount.value = 0; fetchEvents(1) }

const hasActiveFilters = computed(() => searchQuery.value || selectedCategory.value || selectedCity.value || route.query.featured)
const selectedCategoryName = computed(() => eventsStore.categories.find(c => c.id == selectedCategory.value)?.name || '')
const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()

const pageWindow = computed(() => {
  const total = eventsStore.pagination.pages
  const current = eventsStore.pagination.page
  const range = []
  for (let i = Math.max(2, current - 2); i <= Math.min(total - 1, current + 2); i++) range.push(i)
  if (current - 2 > 2) range.unshift('...')
  if (current + 2 < total - 1) range.push('...')
  if (total > 1) { range.unshift(1); range.push(total) } else if (total === 1) { range.unshift(1) }
  return range
})
</script>

<style scoped>
.terminal-input, .terminal-select {
  @apply bg-white/[0.03] border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-300 outline-none hover:border-white/20 transition-all py-4 px-6 appearance-none;
}
.terminal-select { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 1rem center; background-size: 0.8rem; }
.chip { @apply flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[9px] font-black uppercase text-cyan-400 hover:bg-cyan-500/20 transition-all; }
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.slide-down-enter-from, .slide-down-leave-to { transform: translateY(-50px); opacity: 0; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
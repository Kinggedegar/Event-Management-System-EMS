<script setup>
import { onMounted, ref, watch, computed, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEventsStore } from '../stores/events'
import EventCard from '../components/EventCard.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()
const eventsStore = useEventsStore()

const loading = ref(true)
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedCity = ref('')
const sortBy = ref('date')
const viewMode = ref('grid') // 'grid' | 'list'

// Initialize filters from URL
onMounted(async () => {
  searchQuery.value = route.query.search || ''
  selectedCategory.value = route.query.category || ''
  selectedCity.value = route.query.city || ''
  sortBy.value = route.query.sort || 'date'

  await eventsStore.fetchCategories()
  await fetchEvents()
  // start polling for new events
  lastTotal = eventsStore.pagination.total || 0
  pollId = setInterval(async () => {
    try {
      await eventsStore.fetchEvents({
        search: searchQuery.value || undefined,
        category: selectedCategory.value || undefined,
        city: selectedCity.value || undefined,
        sort: sortBy.value,
        featured: route.query.featured || undefined,
        page: eventsStore.pagination.page || 1,
        limit: 12
      })
      const newTotal = eventsStore.pagination.total || 0
      if (newTotal > lastTotal) {
        newEventsAvailable.value = true
        newEventsCount.value = newTotal - lastTotal
      }
      lastTotal = newTotal
    } catch (e) {
      // ignore polling errors
    }
  }, 10000)
})

onUnmounted(() => {
  if (pollId) clearInterval(pollId)
})

async function fetchEvents(page = 1) {
  loading.value = true
  try {
    await eventsStore.fetchEvents({
      search: searchQuery.value || undefined,
      category: selectedCategory.value || undefined,
      city: selectedCity.value || undefined,
      sort: sortBy.value,
      featured: route.query.featured || undefined,
      page,
      limit: 12
    })
  } finally {
    loading.value = false
  }
}

function updateFilters() {
  const query = {}
  if (searchQuery.value) query.search = searchQuery.value
  if (selectedCategory.value) query.category = selectedCategory.value
  if (selectedCity.value) query.city = selectedCity.value
  if (sortBy.value !== 'date') query.sort = sortBy.value

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
  if (type === 'city') selectedCity.value = ''
  if (type === 'sort') sortBy.value = 'date'
  updateFilters()
}

function changePage(page) {
  fetchEvents(page)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const hasActiveFilters = computed(() => {
  return searchQuery.value || selectedCategory.value || selectedCity.value || sortBy.value !== 'date'
})

const activeFilterCount = computed(() => {
  let count = 0
  if (searchQuery.value) count++
  if (selectedCategory.value) count++
  if (selectedCity.value) count++
  if (sortBy.value !== 'date') count++
  return count
})

const selectedCategoryName = computed(() => {
  return eventsStore.categories.find(c => c.id == selectedCategory.value)?.name || ''
})

// Polling state for new events
let pollId = null
let lastTotal = 0
const newEventsAvailable = ref(false)
const newEventsCount = ref(0)

function refreshNow() {
  newEventsAvailable.value = false
  newEventsCount.value = 0
  fetchEvents(1)
}

// Pagination window
const pageWindow = computed(() => {
  const total = eventsStore.pagination.pages
  const current = eventsStore.pagination.page
  const delta = 2
  const range = []

  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.push(i)
  }

  if (current - delta > 2) range.unshift('...')
  if (current + delta < total - 1) range.push('...')

  if (total > 1) {
    range.unshift(1)
    range.push(total)
  } else if (total === 1) {
    range.unshift(1)
  }

  return range
})
</script>

<template>
  <div class="min-h-screen bg-gray-950">

    <!-- ══════════════════════════════════════════ -->
    <!-- PAGE HEADER                               -->
    <!-- ══════════════════════════════════════════ -->
    <div class="relative pt-28 pb-14 overflow-hidden">
      <!-- Background orbs -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-0 left-1/3 w-[500px] h-[300px] bg-violet-600/10 rounded-full blur-[100px]"></div>
        <div class="absolute top-0 right-1/4 w-[400px] h-[250px] bg-indigo-600/8 rounded-full blur-[80px]"></div>
        <!-- Dot grid -->
        <div class="absolute inset-0 opacity-[0.025]"
          style="background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 36px 36px;"></div>
      </div>

      <div class="relative max-w-7xl mx-auto px-6">
        <!-- Breadcrumb -->
        <div class="flex items-center gap-2 text-xs text-gray-600 mb-6">
          <router-link to="/" class="hover:text-gray-400 transition-colors">Home</router-link>
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          <span class="text-gray-500">Events</span>
        </div>

        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div class="inline-flex items-center gap-2 mb-3">
              <div class="w-5 h-px bg-violet-500"></div>
              <span class="text-xs font-semibold text-violet-400 uppercase tracking-widest">Discover</span>
            </div>
            <h1 class="text-4xl md:text-5xl font-black text-white tracking-tight">All Events</h1>
            <p class="text-gray-500 mt-2 text-base">Find amazing experiences happening around you</p>
          </div>

          <!-- Results summary pill -->
          <div v-if="!loading && eventsStore.events.length > 0"
            class="flex items-center gap-2 px-4 py-2 rounded-full border border-white/8 bg-white/3 backdrop-blur-sm w-fit">
            <div class="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse"></div>
            <span class="text-sm font-medium text-gray-300">
              {{ eventsStore.pagination.total?.toLocaleString() }} events found
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- New events banner -->
    <div v-if="newEventsAvailable" class="max-w-7xl mx-auto px-6 mt-4">
      <div class="flex items-center justify-center gap-3 p-3 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg">
        <span class="text-sm font-semibold">{{ newEventsCount }} new {{ newEventsCount > 1 ? 'events' : 'event' }} available</span>
        <button @click="refreshNow" class="ml-3 px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-sm">Refresh</button>
      </div>
    </div>

    <!-- ══════════════════════════════════════════ -->
    <!-- STICKY FILTER BAR                         -->
    <!-- ══════════════════════════════════════════ -->
    <div class="sticky top-[72px] z-30">
      <!-- Glass filter bar -->
      <div class="border-y border-white/5 bg-gray-950/85 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <div class="max-w-7xl mx-auto px-6 py-3">
          <div class="flex flex-col lg:flex-row gap-3">

            <!-- Search input -->
            <div class="flex-1 relative">
              <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search events, venues, organizers..."
                class="w-full pl-10 pr-4 py-2.5 bg-white/4 border border-white/8 rounded-xl text-sm text-white placeholder-gray-600 outline-none focus:border-violet-500/50 focus:bg-white/6 transition-all duration-200"
                @keyup.enter="updateFilters"
              />
            </div>

            <!-- Category -->
            <div class="relative w-full lg:w-44">
              <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
              <select
                v-model="selectedCategory"
                class="w-full pl-10 pr-4 py-2.5 bg-white/4 border border-white/8 rounded-xl text-sm text-gray-300 outline-none focus:border-violet-500/50 focus:bg-white/6 transition-all duration-200 appearance-none cursor-pointer"
                @change="updateFilters"
              >
                <option value="" class="bg-gray-900">All Categories</option>
                <option v-for="cat in eventsStore.categories" :key="cat.id" :value="cat.id" class="bg-gray-900">{{ cat.name }}</option>
              </select>
            </div>

            <!-- City -->
            <div class="relative w-full lg:w-40">
              <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <input
                v-model="selectedCity"
                type="text"
                placeholder="City"
                class="w-full pl-10 pr-4 py-2.5 bg-white/4 border border-white/8 rounded-xl text-sm text-white placeholder-gray-600 outline-none focus:border-violet-500/50 focus:bg-white/6 transition-all duration-200"
                @keyup.enter="updateFilters"
              />
            </div>

            <!-- Sort -->
            <div class="relative w-full lg:w-44">
              <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              <select
                v-model="sortBy"
                class="w-full pl-10 pr-4 py-2.5 bg-white/4 border border-white/8 rounded-xl text-sm text-gray-300 outline-none focus:border-violet-500/50 focus:bg-white/6 transition-all duration-200 appearance-none cursor-pointer"
                @change="updateFilters"
              >
                <option value="date" class="bg-gray-900">Sort: Date</option>
                <option value="title" class="bg-gray-900">Sort: Name</option>
                <option value="created_at" class="bg-gray-900">Sort: Recent</option>
              </select>
            </div>

            <!-- Divider -->
            <div class="hidden lg:block w-px bg-white/5 my-1"></div>

            <!-- Search button -->
            <button
              @click="updateFilters"
              class="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-all duration-300 hover:scale-[1.02] whitespace-nowrap"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </button>

            <!-- View toggle -->
            <div class="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-white/4 border border-white/8">
              <button
                @click="viewMode = 'grid'"
                :class="viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-600 hover:text-gray-400'"
                class="p-1.5 rounded-lg transition-all duration-200"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              </button>
              <button
                @click="viewMode = 'list'"
                :class="viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-600 hover:text-gray-400'"
                class="p-1.5 rounded-lg transition-all duration-200"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
              </button>
            </div>
          </div>

          <!-- Active filter chips -->
          <div v-if="hasActiveFilters" class="flex items-center gap-2 mt-3 flex-wrap">
            <span class="text-xs text-gray-600">Filters:</span>

            <button
              v-if="searchQuery"
              @click="removeFilter('search')"
              class="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-violet-500/15 text-violet-300 border border-violet-500/20 hover:bg-violet-500/25 transition-all duration-200"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              "{{ searchQuery }}"
              <svg class="w-3 h-3 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <button
              v-if="selectedCategory"
              @click="removeFilter('category')"
              class="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/25 transition-all duration-200"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
              {{ selectedCategoryName }}
              <svg class="w-3 h-3 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <button
              v-if="selectedCity"
              @click="removeFilter('city')"
              class="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/25 transition-all duration-200"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
              {{ selectedCity }}
              <svg class="w-3 h-3 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <button
              @click="clearFilters"
              class="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-400 ml-1 transition-colors duration-200"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              Clear all
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════ -->
    <!-- EVENTS CONTENT                            -->
    <!-- ══════════════════════════════════════════ -->
    <div class="max-w-7xl mx-auto px-6 py-10">

      <!-- New events banner -->
      <div v-if="newEventsAvailable" class="mb-6 max-w-3xl mx-auto">
        <div class="flex items-center justify-between gap-3 p-3 rounded-xl bg-gradient-to-r from-violet-800/40 to-indigo-800/30 border border-white/6">
          <div class="text-sm text-gray-200">{{ newEventsCount }} new event{{ newEventsCount > 1 ? 's' : '' }} available</div>
          <div class="flex items-center gap-2">
            <button @click="refreshNow" class="px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold">Refresh</button>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-32 gap-4">
        <LoadingSpinner size="lg" />
        <p class="text-sm text-gray-600 animate-pulse">Finding events for you...</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="eventsStore.events.length === 0" class="text-center py-32">
        <div class="w-20 h-20 rounded-2xl bg-white/3 border border-white/8 flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-white mb-2">No events found</h3>
        <p class="text-gray-500 text-sm max-w-sm mx-auto mb-8">
          We couldn't find any events matching your criteria. Try adjusting your filters.
        </p>
        <button
          @click="clearFilters"
          class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-violet-500/20 transition-all duration-300 hover:scale-[1.02]"
        >
          Clear all filters
        </button>
      </div>

      <!-- Results -->
      <template v-else>

        <!-- Grid view -->
        <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div
            v-for="event in eventsStore.events"
            :key="event.id"
            class="group rounded-2xl border border-white/5 bg-gray-900/40 hover:border-white/12 hover:bg-gray-900/60 overflow-hidden transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:scale-[1.01]"
          >
            <!-- Image -->
            <div class="relative h-48 overflow-hidden">
              <img
                v-if="event.image"
                :src="event.image"
                :alt="event.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div v-else class="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <svg class="w-10 h-10 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-gray-950/80 to-transparent"></div>
              <!-- Top badges -->
              <div class="absolute top-3 left-3 flex gap-1.5">
                <span v-if="event.is_featured" class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-500/30 text-violet-200 border border-violet-500/30 backdrop-blur-sm">Featured</span>
                <span v-if="event.is_free" class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/30 text-emerald-200 border border-emerald-500/30 backdrop-blur-sm">Free</span>
              </div>
              <!-- Date badge -->
              <div class="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-gray-950/70 backdrop-blur-sm border border-white/8">
                <span class="text-[10px] font-semibold text-gray-300">
                  {{ new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}
                </span>
              </div>
            </div>

            <!-- Content -->
            <div class="p-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-[10px] font-medium text-violet-400 bg-violet-500/10 border border-violet-500/15 px-2 py-0.5 rounded-full">
                  {{ event.category?.name || 'General' }}
                </span>
              </div>
              <h3 class="text-sm font-bold text-white mb-2 line-clamp-2 group-hover:text-violet-200 transition-colors duration-200">
                {{ event.title }}
              </h3>
              <div class="flex items-center gap-1.5 text-gray-600 text-xs mb-4">
                <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                <span class="truncate">{{ event.location || 'Online' }}</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex -space-x-1.5">
                  <div v-for="i in Math.min(4, event.attendee_count || 3)" :key="i"
                    class="w-6 h-6 rounded-full border border-gray-900 bg-gradient-to-br from-violet-400 to-indigo-500 text-white text-[8px] flex items-center justify-center font-bold">{{ i }}</div>
                </div>
                <span class="text-sm font-bold text-white">
                  {{ event.price > 0 ? `$${event.price}` : 'Free' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- List view -->
        <div v-else class="flex flex-col gap-3">
          <div
            v-for="event in eventsStore.events"
            :key="event.id"
            class="group flex gap-5 rounded-2xl border border-white/5 bg-gray-900/40 hover:border-white/12 hover:bg-gray-900/60 overflow-hidden transition-all duration-300 hover:scale-[1.005] shadow-[0_2px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.4)] p-4"
          >
            <!-- Thumbnail -->
            <div class="relative w-28 h-20 flex-shrink-0 rounded-xl overflow-hidden">
              <img v-if="event.image" :src="event.image" :alt="event.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div v-else class="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900"></div>
              <div class="absolute inset-0 bg-gradient-to-t from-gray-950/40 to-transparent"></div>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0 flex flex-col justify-center">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-[10px] font-medium text-violet-400 bg-violet-500/10 border border-violet-500/15 px-2 py-0.5 rounded-full">{{ event.category?.name || 'General' }}</span>
                <span v-if="event.is_featured" class="text-[10px] font-medium text-violet-400 bg-violet-500/10 border border-violet-500/15 px-2 py-0.5 rounded-full">Featured</span>
                <span v-if="event.is_free" class="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/15 px-2 py-0.5 rounded-full">Free</span>
              </div>
              <h3 class="text-sm font-bold text-white line-clamp-1 group-hover:text-violet-200 transition-colors duration-200 mb-1">{{ event.title }}</h3>
              <div class="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                <span class="flex items-center gap-1">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  {{ new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}
                </span>
                <span class="flex items-center gap-1">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                  {{ event.location || 'Online' }}
                </span>
              </div>
            </div>

            <!-- Right: Price + CTA -->
            <div class="flex-shrink-0 flex flex-col items-end justify-center gap-2">
              <span class="text-base font-black text-white">{{ event.price > 0 ? `$${event.price}` : 'Free' }}</span>
              <router-link
                :to="`/events/${event.id}`"
                class="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-white/5 border border-white/8 hover:bg-white/10 hover:border-white/15 transition-all duration-200"
              >
                View
              </router-link>
            </div>
          </div>
        </div>

        <!-- ══════════════════════════════════════ -->
        <!-- PAGINATION                            -->
        <!-- ══════════════════════════════════════ -->
        <div v-if="eventsStore.pagination.pages > 1" class="flex items-center justify-center gap-2 mt-14">
          <!-- Prev -->
          <button
            :disabled="eventsStore.pagination.page === 1"
            @click="changePage(eventsStore.pagination.page - 1)"
            class="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-white/8 bg-white/3 text-gray-400 hover:text-white hover:bg-white/8 hover:border-white/15 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
            Prev
          </button>

          <!-- Page numbers -->
          <template v-for="(page, idx) in pageWindow" :key="idx">
            <span v-if="page === '...'" class="px-1 text-gray-700 text-sm select-none">···</span>
            <button
              v-else
              @click="changePage(page)"
              :class="[
                'min-w-[38px] h-[38px] rounded-xl text-sm font-semibold transition-all duration-200',
                page === eventsStore.pagination.page
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20'
                  : 'border border-white/8 bg-white/3 text-gray-400 hover:text-white hover:bg-white/8 hover:border-white/15'
              ]"
            >
              {{ page }}
            </button>
          </template>

          <!-- Next -->
          <button
            :disabled="eventsStore.pagination.page === eventsStore.pagination.pages"
            @click="changePage(eventsStore.pagination.page + 1)"
            class="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-white/8 bg-white/3 text-gray-400 hover:text-white hover:bg-white/8 hover:border-white/15 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
          >
            Next
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

      </template>
    </div>
  </div>
</template>
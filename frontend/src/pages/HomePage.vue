<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useEventsStore } from '../stores/events'
import EventCard from '../components/EventCard.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const eventsStore = useEventsStore()
const loading = ref(true)
const searchQuery = ref('')
const selectedCategory = ref('')
const heroImageIndex = ref(0)

// Static "past/hosted" events to show on the home page
const pastEvents = ref([
  {
    id: 'past-1',
    title: 'Monrovia Tech Summit 2025',
    date: 'November 12, 2025',
    location: 'Capitol Hill Hotel, Monrovia',
    category: 'Technology',
    attendees: 840,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop',
    badge: 'Past',
    badgeColor: 'bg-gray-500/20 text-gray-300 border-gray-500/20',
  },
  {
    id: 'past-2',
    title: 'West Africa Music Festival',
    date: 'October 5, 2025',
    location: 'Sinkor Beachfront, Monrovia',
    category: 'Music',
    attendees: 3200,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop',
    badge: 'Past',
    badgeColor: 'bg-gray-500/20 text-gray-300 border-gray-500/20',
  },
  {
    id: 'past-3',
    title: 'Pan-African Startup Pitch Night',
    date: 'September 20, 2025',
    location: 'Mamba Point Hotel, Monrovia',
    category: 'Business',
    attendees: 560,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=500&fit=crop',
    badge: 'Past',
    badgeColor: 'bg-gray-500/20 text-gray-300 border-gray-500/20',
  },
])

// Hero floating cards data
const heroCards = ref([
  { title: 'Tech Summit 2026', date: 'Mar 28', attendees: '1.2k', color: 'from-violet-500/20 to-indigo-500/20' },
  { title: 'Design Week', date: 'Apr 5', attendees: '840', color: 'from-pink-500/20 to-rose-500/20' },
  { title: 'Music Festival', date: 'Apr 12', attendees: '5.4k', color: 'from-violet-500/20 to-indigo-500/20' },
])

onMounted(async () => {
  try {
    await Promise.all([
      eventsStore.fetchFeaturedEvents(),
      eventsStore.fetchUpcomingEvents(6),
      eventsStore.fetchCategories()
    ])
  } finally {
    loading.value = false
  }

  setInterval(() => {
    heroImageIndex.value = (heroImageIndex.value + 1) % 5
  }, 5000)
})

const categoryIcons = {
  laptop: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  music: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3',
  briefcase: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  trophy: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
  palette: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01',
  film: 'M7 4v16l13-8L7 4z',
  default: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
}

function getIconPath(icon) {
  return categoryIcons[icon] || categoryIcons.default
}

const categoryGradients = [
  'from-violet-500/20 to-purple-500/20 border-violet-500/15',
  'from-pink-500/20 to-rose-500/20 border-pink-500/15',
  'from-violet-500/20 to-indigo-500/20 border-violet-500/15',
  'from-emerald-500/20 to-teal-500/20 border-emerald-500/15',
  'from-sky-500/20 to-blue-500/20 border-sky-500/15',
  'from-indigo-500/20 to-violet-500/20 border-indigo-500/15',
  'from-rose-500/20 to-pink-500/20 border-rose-500/15',
  'from-teal-500/20 to-cyan-500/20 border-teal-500/15',
]

const categoryIconColors = [
  'text-violet-400', 'text-pink-400', 'text-violet-400', 'text-emerald-400',
  'text-sky-400', 'text-indigo-400', 'text-rose-400', 'text-teal-400'
]
</script>

<template>
  <div class="bg-gray-950 min-h-screen">

    <!-- HERO SECTION -->
    <section class="relative min-h-screen flex items-center overflow-hidden pt-20">
      <div class="absolute inset-0">
        <div class="absolute inset-0 bg-gray-950"></div>
        <div class="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[120px] animate-pulse"></div>
        <div class="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px]" style="animation: pulse 4s ease-in-out infinite; animation-delay: 1s;"></div>
        <div class="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-violet-800/10 rounded-full blur-[80px]" style="animation: pulse 6s ease-in-out infinite; animation-delay: 2s;"></div>
        <div class="absolute inset-0 opacity-[0.03]"
          style="background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 40px 40px;"></div>
      </div>

      <div class="relative max-w-7xl mx-auto px-6 py-24 w-full">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <!-- Left: Headline + Search -->
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/5 mb-8">
              <div class="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse"></div>
              <span class="text-xs font-medium text-violet-300 tracking-wide">500+ events live now</span>
            </div>

            <h1 class="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6">
              <span class="text-white">Discover</span><br/>
              <span class="bg-gradient-to-r from-violet-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Extraordinary</span><br/>
              <span class="text-white">Events</span>
            </h1>

            <p class="text-gray-400 text-lg leading-relaxed mb-10 max-w-lg">
              From intimate workshops to massive festivals — find events that move you, connect you, and create memories that last.
            </p>

            <!-- Search bar -->
            <div class="relative rounded-2xl border border-white/8 bg-white/3 backdrop-blur-xl p-2 shadow-[0_20px_60px_rgba(0,0,0,0.4)] mb-8">
              <div class="flex gap-2">
                <div class="flex-1 flex items-center gap-3 px-4">
                  <svg class="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Search events..."
                    class="flex-1 bg-transparent text-sm text-white placeholder-gray-600 outline-none py-2"
                  />
                </div>
                <div class="w-px bg-white/8 my-2"></div>
                <div class="flex items-center gap-2 px-4">
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
                  </svg>
                  <select v-model="selectedCategory" class="bg-transparent text-sm text-gray-400 outline-none py-2 cursor-pointer">
                    <option value="">All categories</option>
                    <option v-for="cat in eventsStore.categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                  </select>
                </div>
                <RouterLink
                  :to="`/events?q=${searchQuery}&category=${selectedCategory}`"
                  class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-violet-500/20 whitespace-nowrap"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </RouterLink>
              </div>
            </div>

            <!-- Quick category pills -->
            <div class="flex flex-wrap gap-2">
              <span class="text-xs text-gray-600 mr-1 self-center">Popular:</span>
              <button v-for="tag in ['Music', 'Tech', 'Art', 'Food', 'Sports']" :key="tag"
                class="px-3 py-1 rounded-full text-xs font-medium border border-white/8 bg-white/3 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/8 transition-all duration-200">
                {{ tag }}
              </button>
            </div>
          </div>

          <!-- Right: Floating glass cards -->
          <div class="hidden lg:block relative h-[520px]">
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl"></div>

            <!-- Card 1 -->
            <div class="absolute top-0 left-0 w-64 rounded-2xl border border-white/8 bg-gray-900/70 backdrop-blur-xl p-4 shadow-[0_20px_60px_rgba(0,0,0,0.5)]" style="animation: float 6s ease-in-out infinite;">
              <div class="h-32 rounded-xl overflow-hidden mb-3 bg-gradient-to-br from-violet-600/30 to-indigo-600/30">
                <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop" class="w-full h-full object-cover opacity-60" alt="" />
              </div>
              <div class="flex items-center gap-2 mb-1">
                <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/20">LIVE</span>
                <span class="text-[10px] text-gray-500">Today</span>
              </div>
              <p class="text-sm font-semibold text-white">Tech Summit 2026</p>
              <div class="flex items-center justify-between mt-2">
                <div class="flex -space-x-1">
                  <div v-for="i in 4" :key="i" class="w-5 h-5 rounded-full border border-gray-900 bg-gradient-to-br from-violet-400 to-indigo-400 text-white text-[8px] flex items-center justify-center font-bold">{{ i }}</div>
                </div>
                <span class="text-[10px] text-gray-500">+1.2k attending</span>
              </div>
            </div>

            <!-- Card 2 -->
            <div class="absolute top-24 right-0 w-60 rounded-2xl border border-white/8 bg-gray-900/70 backdrop-blur-xl p-4 shadow-[0_20px_60px_rgba(0,0,0,0.5)]" style="animation: float 8s ease-in-out infinite; animation-delay: 1s;">
              <div class="h-28 rounded-xl overflow-hidden mb-3 bg-gradient-to-br from-pink-600/30 to-rose-600/30">
                <img src="https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=400&h=200&fit=crop" class="w-full h-full object-cover opacity-60" alt="" />
              </div>
              <div class="flex items-center gap-2 mb-1">
                <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-pink-500/20 text-pink-300 border border-pink-500/20">TRENDING</span>
                <span class="text-[10px] text-gray-500">Apr 5</span>
              </div>
              <p class="text-sm font-semibold text-white">Design Week</p>
              <p class="text-[11px] text-gray-500 mt-1">840 spots left</p>
            </div>

            <!-- Card 3 -->
            <div class="absolute bottom-0 left-20 w-56 rounded-2xl border border-white/8 bg-gray-900/70 backdrop-blur-xl p-4 shadow-[0_20px_60px_rgba(0,0,0,0.5)]" style="animation: float 7s ease-in-out infinite; animation-delay: 2s;">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
                </div>
                <div>
                  <p class="text-xs font-semibold text-white">Music Festival</p>
                  <p class="text-[10px] text-gray-500">Apr 12 · Outdoor</p>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/20">FREE</span>
                <span class="text-[10px] text-gray-500">5.4k attending</span>
              </div>
            </div>

            <!-- Stats badge -->
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/8 bg-gray-900/90 backdrop-blur-xl px-5 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
              <div class="flex items-center gap-4 text-center">
                <div><p class="text-xl font-black text-white">500+</p><p class="text-[10px] text-gray-500">Events</p></div>
                <div class="w-px h-8 bg-white/5"></div>
                <div><p class="text-xl font-black text-white">10K+</p><p class="text-[10px] text-gray-500">Attendees</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURED EVENTS -->
    <section class="relative py-24 overflow-hidden">
      <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent"></div>

      <div class="max-w-7xl mx-auto px-6">
        <div class="flex items-end justify-between mb-12">
          <div>
            <div class="inline-flex items-center gap-2 mb-3">
              <div class="w-5 h-px bg-violet-500"></div>
              <span class="text-xs font-semibold text-violet-400 uppercase tracking-widest">Handpicked</span>
            </div>
            <h2 class="text-4xl font-black text-white tracking-tight">Featured Events</h2>
            <p class="text-gray-500 mt-2">Curated experiences you don't want to miss</p>
          </div>
          <RouterLink to="/events?featured=true" class="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200 group">
            View all
            <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </RouterLink>
        </div>

        <div v-if="loading" class="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>

        <div v-else-if="eventsStore.featuredEvents.length === 0" class="text-center py-20">
          <p class="text-gray-600">No featured events at the moment</p>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div v-for="(event, idx) in eventsStore.featuredEvents.slice(0, 3)" :key="event.id"
            :class="idx === 0 ? 'lg:col-span-2 lg:row-span-1' : ''"
            class="group relative rounded-2xl overflow-hidden border border-white/5 bg-gray-900/50 hover:border-white/15 transition-all duration-500 shadow-[0_4px_24px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] hover:scale-[1.01] cursor-pointer"
          >
            <div :class="idx === 0 ? 'h-72' : 'h-48'" class="relative overflow-hidden">
              <img v-if="event.image" :src="event.image" :alt="event.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div v-else class="w-full h-full bg-gradient-to-br from-violet-900/50 to-indigo-900/50"></div>
              <div class="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent"></div>
              <div class="absolute top-4 left-4 flex gap-2">
                <span v-if="event.is_featured" class="px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-500/30 text-violet-200 border border-violet-500/30 backdrop-blur-sm">Featured</span>
                <span v-if="event.is_free" class="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/30 text-emerald-200 border border-emerald-500/30 backdrop-blur-sm">Free</span>
              </div>
            </div>

            <div class="p-5 backdrop-blur-sm">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-xs font-medium text-violet-400 bg-violet-500/10 border border-violet-500/15 px-2 py-0.5 rounded-full">{{ event.category?.name || 'Event' }}</span>
                <span class="text-xs text-gray-600">•</span>
                <span class="text-xs text-gray-500">{{ new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</span>
              </div>
              <h3 class="text-base font-bold text-white mb-1 line-clamp-1 group-hover:text-violet-200 transition-colors duration-200">{{ event.title }}</h3>
              <div class="flex items-center gap-1.5 text-gray-500 text-xs">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {{ event.location || 'Online' }}
              </div>
              <div class="flex items-center justify-between mt-4">
                <div class="flex -space-x-1.5">
                  <div v-for="i in Math.min(4, event.attendee_count || 4)" :key="i" class="w-6 h-6 rounded-full border border-gray-950 bg-gradient-to-br from-violet-400 to-indigo-500 text-white text-[9px] flex items-center justify-center font-bold">{{ i }}</div>
                  <div v-if="event.attendee_count > 4" class="w-6 h-6 rounded-full border border-gray-950 bg-gray-700 text-gray-400 text-[9px] flex items-center justify-center font-medium">+{{ event.attendee_count - 4 }}</div>
                </div>
                <span class="text-xs font-semibold text-white/80">{{ event.price > 0 ? `$${event.price}` : 'Free' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CATEGORIES SECTION -->
    <section class="relative py-24 overflow-hidden">
      <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent"></div>
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-600/5 rounded-full blur-3xl"></div>
      </div>

      <div class="max-w-7xl mx-auto px-6 relative">
        <div class="text-center mb-14">
          <div class="inline-flex items-center gap-2 mb-3">
            <div class="w-5 h-px bg-indigo-500"></div>
            <span class="text-xs font-semibold text-indigo-400 uppercase tracking-widest">Explore</span>
            <div class="w-5 h-px bg-indigo-500"></div>
          </div>
          <h2 class="text-4xl font-black text-white tracking-tight">Browse by Category</h2>
          <p class="text-gray-500 mt-3 max-w-xl mx-auto">Find events that match your passion</p>
        </div>

        <div v-if="loading" class="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>

        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <RouterLink
            v-for="(category, idx) in eventsStore.categories"
            :key="category.id"
            :to="`/events?category=${category.id}`"
            class="group relative rounded-2xl border p-5 hover:scale-[1.03] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] overflow-hidden cursor-pointer"
            :class="`bg-gradient-to-br ${categoryGradients[idx % categoryGradients.length]}`"
          >
            <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/2"></div>
            <div class="relative">
              <div class="w-11 h-11 rounded-xl mb-4 flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-colors duration-300">
                <svg class="w-5 h-5 transition-transform duration-300 group-hover:scale-110" :class="categoryIconColors[idx % categoryIconColors.length]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getIconPath(category.icon)" />
                </svg>
              </div>
              <h3 class="text-sm font-bold text-white mb-1">{{ category.name }}</h3>
              <p class="text-xs text-gray-500">{{ category.event_count || 0 }} events</p>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- UPCOMING EVENTS -->
    <section class="relative py-24 overflow-hidden">
      <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent"></div>

      <div class="max-w-7xl mx-auto px-6">
        <div class="flex items-end justify-between mb-12">
          <div>
            <div class="inline-flex items-center gap-2 mb-3">
              <div class="w-5 h-px bg-emerald-500"></div>
              <span class="text-xs font-semibold text-emerald-400 uppercase tracking-widest">Coming Up</span>
            </div>
            <h2 class="text-4xl font-black text-white tracking-tight">Upcoming Events</h2>
            <p class="text-gray-500 mt-2">Don't miss what's happening next</p>
          </div>
          <RouterLink to="/events" class="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200 group">
            All events
            <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </RouterLink>
        </div>

        <div v-if="loading" class="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>

        <div v-else-if="eventsStore.upcomingEvents.length === 0" class="text-center py-20">
          <p class="text-gray-600">No upcoming events at the moment</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div v-for="event in eventsStore.upcomingEvents" :key="event.id"
            class="group rounded-2xl border border-white/5 bg-gray-900/40 hover:border-white/12 hover:bg-gray-900/60 overflow-hidden transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:scale-[1.01]">
            <div class="relative h-44 overflow-hidden">
              <img v-if="event.image" :src="event.image" :alt="event.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div v-else class="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900"></div>
              <div class="absolute inset-0 bg-gradient-to-t from-gray-950/80 to-transparent"></div>
              <div class="absolute top-3 left-3">
                <span v-if="event.is_free" class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/25 text-emerald-300 border border-emerald-500/25 backdrop-blur-sm">FREE</span>
              </div>
            </div>
            <div class="p-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-[10px] font-medium text-indigo-400">{{ event.category?.name }}</span>
                <span class="text-gray-700">·</span>
                <span class="text-[10px] text-gray-600">{{ new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}</span>
              </div>
              <h3 class="text-sm font-bold text-white mb-2 line-clamp-2 group-hover:text-indigo-200 transition-colors duration-200">{{ event.title }}</h3>
              <div class="flex items-center gap-1 text-gray-600 text-xs mb-4">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                {{ event.location || 'Online' }}
              </div>
              <div class="flex items-center justify-between">
                <RouterLink :to="`/events/${event.id}`" class="text-xs font-semibold text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/15 transition-all duration-200">
                  View Details
                </RouterLink>
                <span class="text-sm font-bold text-white">{{ event.price > 0 ? `$${event.price}` : 'Free' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-10 text-center">
          <RouterLink to="/events"
            class="inline-flex items-center gap-2 px-8 py-3 rounded-xl border border-white/8 bg-white/3 hover:bg-white/8 text-white text-sm font-semibold hover:border-white/15 transition-all duration-300 hover:scale-[1.02]">
            Browse All Events
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- PAST EVENTS -->
    <section class="relative py-24 overflow-hidden">
      <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent"></div>

      <div class="max-w-7xl mx-auto px-6">
        <div class="flex items-end justify-between mb-12">
          <div>
            <div class="inline-flex items-center gap-2 mb-3">
              <div class="w-5 h-px bg-gray-500"></div>
              <span class="text-xs font-semibold text-gray-500 uppercase tracking-widest">Archive</span>
            </div>
            <h2 class="text-4xl font-black text-white tracking-tight">Past Events</h2>
            <p class="text-gray-500 mt-2">Events we've hosted and memories we've made</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div v-for="event in pastEvents" :key="event.id"
            class="group rounded-2xl border border-white/5 bg-gray-900/30 overflow-hidden transition-all duration-300 hover:border-white/10 hover:scale-[1.01] opacity-75 hover:opacity-100">
            <div class="relative h-44 overflow-hidden">
              <img :src="event.image" :alt="event.title" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" />
              <div class="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent"></div>
              <div class="absolute top-3 left-3">
                <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-500/30 text-gray-300 border border-gray-500/30 backdrop-blur-sm">PAST</span>
              </div>
            </div>
            <div class="p-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-[10px] font-medium text-gray-500">{{ event.category }}</span>
                <span class="text-gray-700">·</span>
                <span class="text-[10px] text-gray-600">{{ event.date }}</span>
              </div>
              <h3 class="text-sm font-bold text-gray-300 mb-2">{{ event.title }}</h3>
              <div class="flex items-center gap-1 text-gray-600 text-xs mb-3">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                {{ event.location }}
              </div>
              <div class="flex items-center gap-1.5 text-gray-600 text-xs">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                {{ event.attendees.toLocaleString() }} attended
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA SECTION WITH PLANNERS BUTTON -->
    <section class="relative py-24 overflow-hidden">
      <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent"></div>

      <div class="absolute inset-0">
        <div class="absolute inset-0 bg-gradient-to-br from-violet-950/60 via-gray-950 to-indigo-950/60"></div>
        <div class="absolute top-0 left-1/3 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 right-1/3 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl"></div>
        <div class="absolute inset-0 opacity-[0.025]"
          style="background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 32px 32px;"></div>
      </div>

      <div class="relative max-w-4xl mx-auto px-6 text-center">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/25 bg-violet-500/5 backdrop-blur-sm mb-8">
          <div class="w-1.5 h-1.5 rounded-full bg-violet-400"></div>
          <span class="text-xs font-semibold text-violet-300">Join 200+ organizers</span>
        </div>

        <h2 class="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6 leading-[1.05]">
          Ready to Create Your
          <span class="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent"> Next Event?</span>
        </h2>
        <p class="text-gray-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Join thousands of organizers who trust EventHub. Start creating unforgettable experiences — from intimate workshops to massive festivals.
        </p>

        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <RouterLink to="/auth/register"
            class="relative inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold text-white rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-[0_0_40px_rgba(139,92,246,0.4)] hover:shadow-[0_0_60px_rgba(139,92,246,0.6)] transition-all duration-300 hover:scale-[1.03]">
            <span class="absolute inset-0 rounded-xl border border-white/20"></span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Get Started Free
          </RouterLink>

          <!-- Professional Planners Button -->
          <RouterLink 
            to="/organizer/planners"
            class="group inline-flex items-center gap-3 px-8 py-3.5 text-sm font-semibold text-white rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-violet-500/40 transition-all duration-300 hover:scale-[1.02]">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Find Professional Planners
          </RouterLink>

          <RouterLink to="/events"
            class="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold text-gray-300 hover:text-white rounded-xl border border-white/8 bg-white/3 hover:bg-white/8 hover:border-white/15 transition-all duration-300 hover:scale-[1.02]">
            Explore Events
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </RouterLink>
        </div>

        <div class="flex flex-wrap justify-center gap-6 mt-12">
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
            No credit card required
          </div>
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
            Free plan available
          </div>
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
            Cancel anytime
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
}
</style>
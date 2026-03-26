<script setup>
import { onMounted, ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useEventsStore } from '../stores/events'

const eventsStore = useEventsStore()
const loading = ref(true)
const searchQuery = ref('')
const sortBy = ref('popular')
const searchFocused = ref(false)

onMounted(async () => {
  try {
    await eventsStore.fetchCategories()
  } finally {
    loading.value = false
  }
})

// Create category form state (free creation)
const showCreateForm = ref(false)
const newCategoryName = ref('')
const newCategoryDesc = ref('')
const newCategoryIcon = ref('default')
const newCategoryColor = ref('#7c3aed')
const creatingCategory = ref(false)
const createMessage = ref('')

async function createCategory() {
  if (!newCategoryName.value.trim()) {
    createMessage.value = 'Name is required.'
    return
  }
  creatingCategory.value = true
  createMessage.value = ''
  try {
    await eventsStore.createCategory({
      name: newCategoryName.value.trim(),
      description: newCategoryDesc.value || null,
      icon: newCategoryIcon.value,
      color: newCategoryColor.value
    })
    createMessage.value = 'Category created successfully.'
    // reset
    newCategoryName.value = ''
    newCategoryDesc.value = ''
    newCategoryIcon.value = 'default'
    // refresh categories
    await eventsStore.fetchCategories()
    showCreateForm.value = false
  } catch (err) {
    createMessage.value = err.response?.data?.message || 'Failed to create category'
  } finally {
    creatingCategory.value = false
  }
}

// Icon path map
const iconPaths = {
  laptop: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  music: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3',
  briefcase: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  trophy: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
  palette: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01',
  utensils: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25',
  'graduation-cap': 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222',
  film: 'M7 4v16l13-8L7 4z',
  sparkles: 'M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
  default: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
}

// Gradient palettes per index
const gradientPalettes = [
  { bg: 'from-violet-500/15 to-purple-600/15', border: 'border-violet-500/20', glow: 'rgba(139,92,246,0.15)', icon: 'from-violet-500 to-purple-600', text: 'text-violet-400', badge: 'bg-violet-500/15 text-violet-300 border-violet-500/20' },
  { bg: 'from-pink-500/15 to-rose-600/15', border: 'border-pink-500/20', glow: 'rgba(236,72,153,0.15)', icon: 'from-pink-500 to-rose-600', text: 'text-pink-400', badge: 'bg-pink-500/15 text-pink-300 border-pink-500/20' },
  { bg: 'from-violet-500/15 to-indigo-600/15', border: 'border-violet-500/20', glow: 'rgba(139,92,246,0.15)', icon: 'from-violet-500 to-indigo-600', text: 'text-violet-400', badge: 'bg-violet-500/15 text-violet-300 border-violet-500/20' },
  { bg: 'from-emerald-500/15 to-teal-600/15', border: 'border-emerald-500/20', glow: 'rgba(16,185,129,0.15)', icon: 'from-emerald-500 to-teal-600', text: 'text-emerald-400', badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20' },
  { bg: 'from-sky-500/15 to-blue-600/15', border: 'border-sky-500/20', glow: 'rgba(14,165,233,0.15)', icon: 'from-sky-500 to-blue-600', text: 'text-sky-400', badge: 'bg-sky-500/15 text-sky-300 border-sky-500/20' },
  { bg: 'from-indigo-500/15 to-violet-600/15', border: 'border-indigo-500/20', glow: 'rgba(99,102,241,0.15)', icon: 'from-indigo-500 to-violet-600', text: 'text-indigo-400', badge: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/20' },
  { bg: 'from-rose-500/15 to-pink-600/15', border: 'border-rose-500/20', glow: 'rgba(244,63,94,0.15)', icon: 'from-rose-500 to-pink-600', text: 'text-rose-400', badge: 'bg-rose-500/15 text-rose-300 border-rose-500/20' },
  { bg: 'from-teal-500/15 to-cyan-600/15', border: 'border-teal-500/20', glow: 'rgba(20,184,166,0.15)', icon: 'from-teal-500 to-cyan-600', text: 'text-teal-400', badge: 'bg-teal-500/15 text-teal-300 border-teal-500/20' },
]

function getPalette(idx) {
  return gradientPalettes[idx % gradientPalettes.length]
}

function getIconPath(icon) {
  return iconPaths[icon] || iconPaths.default
}

function isTrending(category) {
  return (category.event_count || 0) >= 5
}

// Filtered + sorted categories
const filteredCategories = computed(() => {
  let cats = [...(eventsStore.categories || [])]

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    cats = cats.filter(c =>
      c.name?.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q)
    )
  }

  if (sortBy.value === 'popular') {
    cats.sort((a, b) => (b.event_count || 0) - (a.event_count || 0))
  } else if (sortBy.value === 'events') {
    cats.sort((a, b) => (b.event_count || 0) - (a.event_count || 0))
  } else if (sortBy.value === 'name') {
    cats.sort((a, b) => a.name.localeCompare(b.name))
  }

  return cats
})

// Featured = top 3 by event count
const featuredCategories = computed(() => {
  return [...(eventsStore.categories || [])]
    .sort((a, b) => (b.event_count || 0) - (a.event_count || 0))
    .slice(0, 3)
})

const regularCategories = computed(() => {
  const featuredIds = new Set(featuredCategories.value.map(c => c.id))
  return filteredCategories.value.filter(c => !featuredIds.has(c.id))
})

const showFeatured = computed(() => !searchQuery.value.trim() && sortBy.value === 'popular')

const totalEvents = computed(() =>
  (eventsStore.categories || []).reduce((sum, c) => sum + (c.event_count || 0), 0)
)
</script>

<template>
  <div class="min-h-screen bg-gray-950">

    <!-- ══════════════════════════════════════════ -->
    <!-- HERO HEADER                               -->
    <!-- ══════════════════════════════════════════ -->
    <div class="relative pt-28 pb-16 overflow-hidden">
      <!-- Background atmosphere -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-0 left-1/4 w-[600px] h-[400px] bg-violet-600/12 rounded-full blur-[120px]"></div>
        <div class="absolute top-10 right-1/4 w-[500px] h-[300px] bg-indigo-600/8 rounded-full blur-[100px]"></div>
        <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-violet-900/10 rounded-full blur-[80px]"></div>
        <!-- Dot grid -->
        <div class="absolute inset-0 opacity-[0.025]"
          style="background-image: radial-gradient(circle, #ffffff 1px, transparent 1px); background-size: 36px 36px;"></div>
        <!-- Bottom fade -->
        <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-950 to-transparent"></div>
      </div>

      <div class="relative max-w-7xl mx-auto px-6">
        <!-- Breadcrumb -->
        <div class="flex items-center gap-2 text-xs text-gray-600 mb-8">
          <RouterLink to="/" class="hover:text-gray-400 transition-colors">Home</RouterLink>
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          <span class="text-gray-500">Categories</span>
        </div>

        <!-- Title block -->
        <div class="text-center mb-12">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/5 mb-6">
            <div class="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse"></div>
            <span class="text-xs font-semibold text-violet-300 tracking-wide">
              {{ eventsStore.categories.length }} categories · {{ totalEvents }} total events
            </span>
          </div>

          <h1 class="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.04] mb-5">
            <span class="text-white">Explore</span>
            <span class="block bg-gradient-to-r from-violet-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Event Categories
            </span>
          </h1>

          <p class="text-gray-500 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Dive into the experiences that move you — from live concerts to startup pitch nights. Your next obsession is one click away.
          </p>

          <!-- Search + Sort bar -->
          <div class="max-w-2xl mx-auto">
            <div class="relative rounded-2xl border border-white/8 bg-white/3 backdrop-blur-xl p-2 shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
              :class="searchFocused ? 'border-violet-500/40 shadow-[0_20px_60px_rgba(139,92,246,0.15)]' : ''"
              style="transition: border-color 0.2s, box-shadow 0.2s;">
              <div class="flex gap-2 items-center">
                <!-- Search input -->
                <div class="flex-1 flex items-center gap-3 px-4">
                  <svg class="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Search categories..."
                    class="flex-1 bg-transparent text-sm text-white placeholder-gray-600 outline-none py-2"
                    @focus="searchFocused = true"
                    @blur="searchFocused = false"
                  />
                  <button v-if="searchQuery" @click="searchQuery = ''" class="text-gray-600 hover:text-gray-400 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                <!-- Divider -->
                <div class="w-px h-6 bg-white/8"></div>

                <!-- Sort select -->
                <select v-model="sortBy"
                  class="bg-transparent text-sm text-gray-400 outline-none py-2 px-3 cursor-pointer appearance-none">
                  <option value="popular" class="bg-gray-900">Most Popular</option>
                  <option value="events" class="bg-gray-900">Most Events</option>
                  <option value="name" class="bg-gray-900">A → Z</option>
                </select>
              </div>
            </div>

            <!-- Results count (when searching) -->
            <div v-if="searchQuery" class="mt-3 text-sm text-gray-600">
              <span class="text-white font-semibold">{{ filteredCategories.length }}</span> categor{{ filteredCategories.length === 1 ? 'y' : 'ies' }} matching
              <span class="text-violet-400">"{{ searchQuery }}"</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="max-w-7xl mx-auto px-6 pb-24">

      <!-- ══════════════════════════════════════ -->
      <!-- SKELETON LOADERS                      -->
      <!-- ══════════════════════════════════════ -->
      <div v-if="loading">
        <!-- Featured skeleton -->
        <div class="mb-14">
          <div class="h-5 w-36 bg-white/5 rounded-full mb-6 animate-pulse"></div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div v-for="i in 3" :key="i" class="rounded-2xl border border-white/5 bg-white/2 overflow-hidden animate-pulse">
              <div class="h-40 bg-white/4"></div>
              <div class="p-5 space-y-3">
                <div class="h-3 bg-white/5 rounded-full w-16"></div>
                <div class="h-5 bg-white/5 rounded-full w-3/4"></div>
                <div class="h-3 bg-white/5 rounded-full w-full"></div>
                <div class="h-3 bg-white/5 rounded-full w-2/3"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Grid skeleton -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="i in 8" :key="i" class="rounded-2xl border border-white/5 bg-white/2 p-5 animate-pulse">
            <div class="w-12 h-12 rounded-xl bg-white/5 mb-4"></div>
            <div class="h-4 bg-white/5 rounded-full w-3/4 mb-2"></div>
            <div class="h-3 bg-white/5 rounded-full w-full mb-1"></div>
            <div class="h-3 bg-white/5 rounded-full w-2/3 mb-4"></div>
            <div class="h-3 bg-white/5 rounded-full w-1/3"></div>
          </div>
        </div>
      </div>

      <!-- ══════════════════════════════════════ -->
      <!-- EMPTY STATE                           -->
      <!-- ══════════════════════════════════════ -->
      <div v-else-if="filteredCategories.length === 0" class="text-center py-32">
        <div class="w-20 h-20 rounded-2xl border border-white/8 bg-white/3 flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-white mb-2">No categories found</h3>
        <p class="text-gray-500 text-sm mb-8 max-w-xs mx-auto">
          No categories match <span class="text-violet-400">"{{ searchQuery }}"</span>. Try a different search.
        </p>
        <button @click="searchQuery = ''"
          class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-violet-500/20 transition-all duration-300 hover:scale-[1.02]">
          Clear search
        </button>
      </div>

      <!-- ══════════════════════════════════════ -->
      <!-- CONTENT                               -->
      <!-- ══════════════════════════════════════ -->
      <template v-else>

        <!-- Create category (public / free) -->
        <div class="max-w-3xl mx-auto mb-8">
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-sm font-semibold text-gray-300">Create a new category (Free)</h4>
            <button @click="showCreateForm = !showCreateForm" class="text-sm text-violet-300 hover:underline">{{ showCreateForm ? 'Cancel' : 'Create Category' }}</button>
          </div>

          <div v-if="showCreateForm" class="rounded-2xl border border-white/6 bg-gray-900/40 p-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <input v-model="newCategoryName" placeholder="Name" class="col-span-2 px-3 py-2 rounded-lg bg-white/4 outline-none text-white" />
              <input v-model="newCategoryColor" type="color" class="w-full h-10 p-0 rounded-lg border-0" />
            </div>
            <textarea v-model="newCategoryDesc" placeholder="Short description (optional)" rows="2" class="w-full px-3 py-2 rounded-lg bg-white/4 outline-none text-white mb-3"></textarea>
            <div class="flex items-center gap-3">
              <select v-model="newCategoryIcon" class="px-3 py-2 rounded-lg bg-white/4 outline-none text-white">
                <option value="default">Default</option>
                <option value="music">Music</option>
                <option value="laptop">Tech</option>
                <option value="trophy">Sports</option>
                <option value="film">Film</option>
                <option value="palette">Art</option>
              </select>
              <button @click="createCategory" :disabled="creatingCategory" class="ml-auto px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold">
                {{ creatingCategory ? 'Creating...' : 'Create' }}
              </button>
            </div>
            <p v-if="createMessage" class="text-sm mt-3 text-gray-400">{{ createMessage }}</p>
          </div>
        </div>

        <!-- ── FEATURED SECTION ── -->
        <div v-if="showFeatured && featuredCategories.length > 0" class="mb-16">
          <div class="flex items-center gap-3 mb-7">
            <div class="w-5 h-px bg-violet-500"></div>
            <span class="text-xs font-bold text-violet-400 uppercase tracking-widest">Top Categories</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-500/10 text-violet-300 border border-violet-500/20">Featured</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <RouterLink
              v-for="(category, idx) in featuredCategories"
              :key="category.id"
              :to="`/events?category=${category.id}`"
              class="group relative rounded-2xl border overflow-hidden transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              :class="`bg-gradient-to-br ${getPalette(idx).bg} ${getPalette(idx).border}`"
              :style="`box-shadow: 0 4px 24px rgba(0,0,0,0.3); transition: box-shadow 0.3s, transform 0.3s;`"
              @mouseenter="e => e.currentTarget.style.boxShadow = `0 12px 40px ${getPalette(idx).glow}, 0 4px 24px rgba(0,0,0,0.3)`"
              @mouseleave="e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.3)'"
            >
              <!-- Top pattern -->
              <div class="absolute inset-0 opacity-[0.03]"
                style="background-image: radial-gradient(circle, #ffffff 1px, transparent 1px); background-size: 20px 20px;"></div>

              <!-- Top: Icon + badges -->
              <div class="relative p-6 pb-0">
                <div class="flex items-start justify-between mb-5">
                  <!-- Icon -->
                  <div :class="`w-14 h-14 rounded-2xl bg-gradient-to-br ${getPalette(idx).icon} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`">
                    <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getIconPath(category.icon)" />
                    </svg>
                  </div>
                  <!-- Trending badge -->
                  <div v-if="isTrending(category)" class="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-violet-500/15 text-violet-300 border border-violet-500/20">
                    🔥 Trending
                  </div>
                </div>

                <h3 class="text-lg font-black text-white mb-2 group-hover:text-white/90 transition-colors">{{ category.name }}</h3>
                <p class="text-sm text-gray-500 line-clamp-2 mb-5">{{ category.description || 'Explore events in this category and discover amazing experiences.' }}</p>
              </div>

              <!-- Bottom: Stats + CTA -->
              <div class="relative px-6 pb-5 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div>
                    <p class="text-xl font-black text-white">{{ category.event_count || 0 }}</p>
                    <p class="text-[10px] text-gray-600 font-medium">Events</p>
                  </div>
                  <!-- Popularity bar -->
                  <div class="flex gap-0.5 items-end h-6 ml-2">
                    <div v-for="b in 5" :key="b"
                      :class="b <= Math.ceil((category.event_count || 0) / 4) ? `bg-gradient-to-t ${getPalette(idx).icon}` : 'bg-white/8'"
                      :style="`height: ${b * 20}%; width: 3px; border-radius: 2px;`"></div>
                  </div>
                </div>

                <div :class="`flex items-center gap-1 text-xs font-semibold ${getPalette(idx).text} group-hover:gap-2 transition-all duration-200`">
                  Browse
                  <svg class="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" /></svg>
                </div>
              </div>
            </RouterLink>
          </div>
        </div>

        <!-- ── DIVIDER ── -->
        <div v-if="showFeatured" class="flex items-center gap-4 mb-10">
          <div class="flex-1 h-px bg-gradient-to-r from-transparent to-white/5"></div>
          <span class="text-xs font-semibold text-gray-600 uppercase tracking-widest">All Categories</span>
          <div class="flex-1 h-px bg-gradient-to-l from-transparent to-white/5"></div>
        </div>

        <!-- ── REGULAR GRID ── -->
        <div v-if="!searchQuery" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <RouterLink
            v-for="(category, idx) in regularCategories"
            :key="category.id"
            :to="`/events?category=${category.id}`"
            class="group relative rounded-2xl border overflow-hidden transition-all duration-300 hover:scale-[1.03] cursor-pointer p-5"
            :class="`bg-gradient-to-br ${getPalette(idx + 3).bg} ${getPalette(idx + 3).border}`"
            :style="`box-shadow: 0 2px 12px rgba(0,0,0,0.25);`"
            @mouseenter="e => e.currentTarget.style.boxShadow = `0 10px 32px ${getPalette(idx + 3).glow}, 0 2px 12px rgba(0,0,0,0.25)`"
            @mouseleave="e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.25)'"
          >
            <!-- Hover overlay -->
            <div class="absolute inset-0 bg-white/0 group-hover:bg-white/[0.02] transition-colors duration-300 rounded-2xl"></div>

            <div class="relative">
              <!-- Icon -->
              <div :class="`w-11 h-11 rounded-xl bg-gradient-to-br ${getPalette(idx + 3).icon} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getIconPath(category.icon)" />
                </svg>
              </div>

              <!-- Name + trending -->
              <div class="flex items-start justify-between gap-2 mb-1">
                <h3 class="text-sm font-bold text-white group-hover:text-white/90 transition-colors leading-snug">{{ category.name }}</h3>
                <span v-if="isTrending(category)" class="text-[9px] mt-0.5 flex-shrink-0">🔥</span>
              </div>

              <!-- Description -->
              <p class="text-xs text-gray-600 line-clamp-2 mb-4 leading-relaxed">{{ category.description || 'Explore events and discover amazing experiences.' }}</p>

              <!-- Footer -->
              <div class="flex items-center justify-between">
                <span :class="`text-xs font-semibold px-2 py-0.5 rounded-full border ${getPalette(idx + 3).badge}`">
                  {{ category.event_count || 0 }} events
                </span>
                <svg :class="`w-4 h-4 ${getPalette(idx + 3).text} opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-200`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </RouterLink>
        </div>

        <!-- Search results: flat grid (no featured split) -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <RouterLink
            v-for="(category, idx) in filteredCategories"
            :key="category.id"
            :to="`/events?category=${category.id}`"
            class="group relative rounded-2xl border overflow-hidden transition-all duration-300 hover:scale-[1.03] cursor-pointer p-5"
            :class="`bg-gradient-to-br ${getPalette(idx).bg} ${getPalette(idx).border}`"
            :style="`box-shadow: 0 2px 12px rgba(0,0,0,0.25);`"
            @mouseenter="e => e.currentTarget.style.boxShadow = `0 10px 32px ${getPalette(idx).glow}, 0 2px 12px rgba(0,0,0,0.25)`"
            @mouseleave="e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.25)'"
          >
            <div class="absolute inset-0 bg-white/0 group-hover:bg-white/[0.02] transition-colors duration-300 rounded-2xl"></div>
            <div class="relative">
              <div :class="`w-11 h-11 rounded-xl bg-gradient-to-br ${getPalette(idx).icon} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getIconPath(category.icon)" />
                </svg>
              </div>
              <div class="flex items-start justify-between gap-2 mb-1">
                <h3 class="text-sm font-bold text-white leading-snug">{{ category.name }}</h3>
                <span v-if="isTrending(category)" class="text-[9px] mt-0.5">🔥</span>
              </div>
              <p class="text-xs text-gray-600 line-clamp-2 mb-4 leading-relaxed">{{ category.description || 'Explore events in this category.' }}</p>
              <div class="flex items-center justify-between">
                <span :class="`text-xs font-semibold px-2 py-0.5 rounded-full border ${getPalette(idx).badge}`">
                  {{ category.event_count || 0 }} events
                </span>
                <svg :class="`w-4 h-4 ${getPalette(idx).text} opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </RouterLink>
        </div>

        <!-- ── CTA STRIP ── -->
        <div class="mt-20 relative rounded-3xl border border-white/8 bg-gradient-to-br from-violet-950/40 via-gray-900/30 to-indigo-950/40 backdrop-blur-xl overflow-hidden p-10 text-center">
          <!-- Pattern -->
          <div class="absolute inset-0 opacity-[0.025]"
            style="background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 28px 28px;"></div>
          <div class="absolute top-0 left-1/3 w-64 h-32 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <div class="absolute bottom-0 right-1/3 w-48 h-24 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <div class="relative">
            <h3 class="text-2xl md:text-3xl font-black text-white mb-3">Can't find what you're looking for?</h3>
            <p class="text-gray-500 text-sm mb-7 max-w-md mx-auto">Browse all events across every category, or create your own and reach thousands of attendees.</p>
            <div class="flex flex-col sm:flex-row justify-center gap-3">
              <RouterLink to="/events"
                class="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300 hover:scale-[1.02]">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                Browse All Events
              </RouterLink>
              <RouterLink to="/auth/register"
                class="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-white/8 bg-white/3 hover:bg-white/8 text-white text-sm font-semibold transition-all duration-300 hover:scale-[1.02]">
                Create an Event
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
              </RouterLink>
            </div>
          </div>
        </div>

      </template>
    </div>
  </div>
</template>
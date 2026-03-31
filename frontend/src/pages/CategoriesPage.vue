<template>
  <div class="min-h-screen bg-[#050505] text-white relative font-sans p-4 md:p-8 overflow-hidden">
    
    <!-- Global Noise Overlay -->
    <div class="pointer-events-none fixed inset-0 z-0 opacity-[0.03]" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>

    <!-- Ambient Glowing Orbs -->
    <div class="absolute top-0 left-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
    <div class="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

    <div class="relative z-10 max-w-[90rem] mx-auto space-y-8">
      
      <!-- ================= HEADER ================= -->
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 backdrop-blur-xl">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-3">
            <span class="w-2 h-2 rounded-full bg-violet-500 animate-pulse"></span>
            <span class="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Taxonomy Control</span>
          </div>
          <h1 class="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 tracking-tight">
            Category Architecture
          </h1>
          <p class="text-zinc-400 font-medium mt-1">Organize the platform's event ecosystem and user discovery paths.</p>
        </div>
        <button 
          @click="showCreateForm = !showCreateForm"
          class="px-8 py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:scale-105"
        >
          {{ showCreateForm ? 'Close Editor' : 'Create New Category' }}
        </button>
      </div>

      <!-- ================= QUICK STATS ================= -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div class="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-6">
          <p class="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Active Categories</p>
          <p class="text-3xl font-black text-white">{{ eventsStore.categories.length }}</p>
        </div>
        <div class="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-6">
          <p class="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Total Cataloged Events</p>
          <p class="text-3xl font-black text-white">{{ totalEvents }}</p>
        </div>
        <div class="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-6">
          <p class="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Discovery Reach</p>
          <p class="text-3xl font-black text-emerald-400">High</p>
        </div>
      </div>

      <!-- ================= CREATION FORM (MODULAR) ================= -->
      <Transition
        enter-active-class="transition duration-500 ease-out"
        enter-from-class="opacity-0 -translate-y-8"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-300 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-8"
      >
        <div v-if="showCreateForm" class="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="space-y-6">
              <div>
                <label class="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-3 ml-1">Category Designation</label>
                <input v-model="newCategoryName" type="text" placeholder="e.g. Technology, Nightlife, Wellness..." class="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:border-violet-500 transition-all font-medium" />
              </div>
              <div>
                <label class="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-3 ml-1">Identity Color</label>
                <div class="flex items-center gap-4">
                  <input v-model="newCategoryColor" type="color" class="w-16 h-16 rounded-xl bg-transparent border-none cursor-pointer" />
                  <span class="text-sm font-mono text-zinc-400">{{ newCategoryColor }}</span>
                </div>
              </div>
              <div>
                <label class="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-3 ml-1">Visual Symbol (Icon)</label>
                <select v-model="newCategoryIcon" class="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:border-violet-500 transition-all font-medium appearance-none">
                  <option v-for="(path, key) in iconPaths" :key="key" :value="key">{{ key.replace('-', ' ') }}</option>
                </select>
              </div>
            </div>
            
            <div class="space-y-6">
              <div>
                <label class="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-3 ml-1">Description Brief</label>
                <textarea v-model="newCategoryDesc" rows="5" placeholder="Define the scope of this category..." class="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white outline-none focus:border-violet-500 transition-all font-medium resize-none"></textarea>
              </div>
              <div class="pt-2">
                <button 
                  @click="createCategory" 
                  :disabled="creatingCategory"
                  class="w-full py-5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-[0_10px_40px_rgba(139,92,246,0.3)] disabled:opacity-50"
                >
                  {{ creatingCategory ? 'Compiling Architecture...' : 'Deploy Category' }}
                </button>
                <p v-if="createMessage" class="text-center mt-4 text-xs font-bold text-zinc-500 uppercase tracking-widest">{{ createMessage }}</p>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- ================= SEARCH & SORT ================= -->
      <div class="bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-4 relative z-10">
        <div class="flex-1 relative group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m1.6-4.15a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search categories..."
            class="w-full pl-11 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-all font-medium"
          />
        </div>
        <select v-model="sortBy" class="w-full md:w-48 px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-zinc-300 outline-none focus:border-violet-400 transition-all cursor-pointer font-medium appearance-none">
          <option value="popular">Most Popular</option>
          <option value="events">Most Events</option>
          <option value="name">Alphabetical</option>
        </select>
      </div>

      <!-- ================= CATEGORY GRID ================= -->
      <LoadingSpinner v-if="loading" class="py-20" />
      
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        <div
          v-for="(category, idx) in filteredCategories"
          :key="category.id"
          class="group relative bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 overflow-hidden hover:border-white/20 hover:-translate-y-1 transition-all duration-300"
        >
          <!-- Neon Accents -->
          <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-5 blur-2xl group-hover:opacity-10 transition-opacity" :class="getPalette(idx).icon"></div>

          <div class="relative z-10">
            <!-- Icon Box -->
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-xl border transition-all duration-500 group-hover:scale-110 group-hover:rotate-3" :class="[getPalette(idx).bg, getPalette(idx).border]">
              <svg class="w-7 h-7" :class="getPalette(idx).text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getIconPath(category.icon)" />
              </svg>
            </div>

            <!-- Content -->
            <div class="mb-6">
              <div class="flex items-center gap-2 mb-2">
                <h3 class="text-xl font-black text-white tracking-tight">{{ category.name }}</h3>
                <span v-if="isTrending(category)" class="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-black uppercase tracking-widest">Hot</span>
              </div>
              <p class="text-sm text-zinc-500 line-clamp-2 font-medium leading-relaxed">{{ category.description || 'Global classification for specialized community events.' }}</p>
            </div>

            <!-- Stats -->
            <div class="flex items-center justify-between pt-6 border-t border-white/5">
              <div>
                <p class="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Live Events</p>
                <p class="text-xl font-black text-white">{{ category.event_count || 0 }}</p>
              </div>
              <div class="flex -space-x-2">
                <!-- Visual Decoration for 'Activity' -->
                <div v-for="i in 3" :key="i" class="w-6 h-6 rounded-full border-2 border-[#0a0a0a] bg-zinc-800 flex items-center justify-center">
                  <span class="w-1 h-1 rounded-full bg-zinc-500"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="filteredCategories.length === 0 && !loading" class="text-center py-32">
        <p class="text-zinc-500 font-medium text-lg italic tracking-wide">No discovery paths match your search query.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { useEventsStore } from '../stores/events'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const eventsStore = useEventsStore()
const loading = ref(true)
const searchQuery = ref('')
const sortBy = ref('popular')
const showCreateForm = ref(false)

// Form State
const newCategoryName = ref('')
const newCategoryDesc = ref('')
const newCategoryIcon = ref('default')
const newCategoryColor = ref('#7c3aed')
const creatingCategory = ref(false)
const createMessage = ref('')

onMounted(async () => {
  try {
    await eventsStore.fetchCategories()
  } finally {
    loading.value = false
  }
})

async function createCategory() {
  if (!newCategoryName.value.trim()) {
    createMessage.value = 'Category designation is required.'
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
    createMessage.value = 'Architecture updated successfully.'
    newCategoryName.value = ''
    newCategoryDesc.value = ''
    newCategoryIcon.value = 'default'
    await eventsStore.fetchCategories()
    setTimeout(() => { showCreateForm.value = false; createMessage.value = '' }, 1500)
  } catch (err) {
    createMessage.value = 'System failure during category deployment.'
  } finally {
    creatingCategory.value = false
  }
}

// EXPANDED ICON LIBRARY FOR MORE EVENT TYPES
const iconPaths = {
  'laptop': 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  'music': 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3',
  'briefcase': 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  'trophy': 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
  'palette': 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01',
  'film': 'M7 4v16l13-8L7 4z',
  'graduation-cap': 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222',
  'shopping-bag': 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
  'camera': 'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z',
  'heart': 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  'microphone': 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z',
  'default': 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
}

const gradientPalettes = [
  { bg: 'bg-violet-500/10', border: 'border-violet-500/20', text: 'text-violet-400', icon: 'from-violet-500 to-purple-600' },
  { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400', icon: 'from-cyan-500 to-blue-600' },
  { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', icon: 'from-emerald-500 to-teal-600' },
  { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', icon: 'from-amber-500 to-orange-600' },
  { bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-400', icon: 'from-rose-500 to-pink-600' },
  { bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', text: 'text-indigo-400', icon: 'from-indigo-500 to-blue-700' },
]

function getPalette(idx) { return gradientPalettes[idx % gradientPalettes.length] }
function getIconPath(icon) { return iconPaths[icon] || iconPaths.default }
function isTrending(category) { return (category.event_count || 0) >= 5 }

const filteredCategories = computed(() => {
  let cats = [...(eventsStore.categories || [])]
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    cats = cats.filter(c => c.name?.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q))
  }
  if (sortBy.value === 'popular' || sortBy.value === 'events') {
    cats.sort((a, b) => (b.event_count || 0) - (a.event_count || 0))
  } else {
    cats.sort((a, b) => a.name.localeCompare(b.name))
  }
  return cats
})

const totalEvents = computed(() => (eventsStore.categories || []).reduce((sum, c) => sum + (c.event_count || 0), 0))
</script>

<style scoped>
select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1.5rem center;
  background-size: 1rem;
}
</style>
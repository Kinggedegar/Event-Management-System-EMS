<script setup>
import { onMounted, ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useEventsStore } from '../stores/events'
import { useAuthStore } from '../stores/auth'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const eventsStore = useEventsStore()
const authStore = useAuthStore()
const loading = ref(true)
const searchQuery = ref('')
const selectedCategory = ref('')

// Static "Archives" (Past Events)
const pastEvents = ref([
  {
    id: 'past-1',
    title: 'Monrovia Tech Summit 2025',
    date: 'NOV 12, 2025',
    location: 'CAPITOL HILL',
    category: 'Technology',
    attendees: 840,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
  },
  {
    id: 'past-2',
    title: 'West Africa Music Fest',
    date: 'OCT 05, 2025',
    location: 'SINKOR BEACH',
    category: 'Music',
    attendees: 3200,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  },
])

onMounted(async () => {
  try {
    await Promise.all([
      eventsStore.fetchEvents({ featured: true, limit: 6 }), // Pulling real featured data
      eventsStore.fetchEvents({ limit: 5 }), // For upcoming feed
      eventsStore.fetchCategories()
    ])
  } finally {
    loading.value = false
  }
})

const formatShortDate = (dateStr) => {
  const date = new Date(dateStr)
  return {
    month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    day: date.toLocaleDateString('en-US', { day: '2-digit' })
  }
}
</script>

<template>
  <div class="bg-[#050505] min-h-screen text-white relative font-sans overflow-x-hidden">
    
    <!-- ══════════════════════════════════════════ -->
    <!-- GLOBAL ATMOSPHERE                         -->
    <!-- ══════════════════════════════════════════ -->
    <div class="pointer-events-none fixed inset-0 z-0 opacity-[0.03]" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>
    <div class="absolute top-0 left-1/4 w-[800px] h-[800px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none z-0"></div>
    <div class="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

    <!-- ══════════════════════════════════════════ -->
    <!-- HERO: SYSTEM INITIALIZATION               -->
    <!-- ══════════════════════════════════════════ -->
    <section class="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6 z-10">
      
      <!-- Status Pill -->
      <div class="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-10 group cursor-crosshair">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span class="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] group-hover:text-white transition-colors">Platform Status: Optimal</span>
      </div>

      <h1 class="text-6xl md:text-8xl lg:text-[9rem] font-black tracking-[ -0.05em] text-center leading-[0.85] mb-8 uppercase">
        <span class="text-white">Engineered</span><br />
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-400 to-zinc-800">Experiences</span>
      </h1>
      
      <p class="text-zinc-500 text-lg md:text-xl max-w-2xl text-center mb-16 font-medium leading-relaxed italic">
        Discover world-class summits, industrial workshops, and high-fidelity nightlife modules.
      </p>

      <!-- Command Console (Search) -->
      <div class="w-full max-w-5xl relative group">
        <div class="absolute -inset-1 bg-gradient-to-r from-violet-600/20 to-cyan-600/20 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-700"></div>
        <div class="relative grid grid-cols-1 md:grid-cols-12 items-center bg-[#0a0a0a]/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-3 shadow-2xl">
          
          <div class="md:col-span-5 flex items-center gap-4 px-6 py-4">
            <svg class="w-5 h-5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input v-model="searchQuery" type="text" placeholder="QUERY EVENT KEYWORDS..." class="bg-transparent text-white placeholder-zinc-700 w-full outline-none text-xs font-black uppercase tracking-widest" />
          </div>

          <div class="hidden md:block md:col-span-1 h-8 border-l border-white/10 mx-auto"></div>

          <div class="md:col-span-3 flex items-center gap-4 px-6 py-4">
            <select v-model="selectedCategory" class="bg-transparent text-zinc-400 outline-none w-full text-[10px] font-black uppercase tracking-widest appearance-none cursor-pointer">
              <option value="" class="bg-zinc-900">ALL SECTORS</option>
              <option v-for="cat in eventsStore.categories" :key="cat.id" :value="cat.id" class="bg-zinc-900">{{ cat.name.toUpperCase() }}</option>
            </select>
          </div>

          <div class="md:col-span-3">
             <RouterLink :to="`/events?search=${searchQuery}&category=${selectedCategory}`" class="w-full bg-white text-black py-5 rounded-[1.8rem] font-black text-xs uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3">
               Initialize Discovery
               <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
             </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════ -->
    <!-- BENTO: PRIORITY MODULES                    -->
    <!-- ══════════════════════════════════════════ -->
    <section class="py-32 px-6 max-w-[90rem] mx-auto z-10 relative">
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 px-4">
        <div>
          <h2 class="text-xs font-black text-zinc-600 uppercase tracking-[0.5em] mb-4">Registry // Alpha</h2>
          <h3 class="text-5xl font-black tracking-tighter uppercase">Featured Modules</h3>
        </div>
        <RouterLink to="/events?featured=true" class="group flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all">
          Access Full Archives
          <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7"/></svg>
        </RouterLink>
      </div>

      <div v-if="loading" class="flex justify-center py-40"><LoadingSpinner size="lg" /></div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[700px]">
        <div v-for="(event, idx) in eventsStore.events.filter(e => e.featured).slice(0, 3)" :key="event.id"
          :class="[
            'group relative rounded-[3rem] overflow-hidden border border-white/5 bg-[#0a0a0a] cursor-pointer hover:border-white/20 transition-all duration-700',
            idx === 0 ? 'md:col-span-2 md:row-span-2' : 'md:col-span-2 md:row-span-1'
          ]">
          
          <img :src="event.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'" class="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110 opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-80" />
          <div class="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent"></div>
          
          <!-- Tags -->
          <div class="absolute top-8 left-8 flex gap-3 z-10">
            <span class="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/20 bg-black/40 backdrop-blur-xl">
              {{ event.category_name || 'Priority' }}
            </span>
          </div>

          <!-- Content -->
          <div class="absolute bottom-0 left-0 right-0 p-10 z-10 transform transition-transform duration-700">
            <p class="text-cyan-400 text-[10px] font-black tracking-[0.3em] mb-4 uppercase">
              Initial Date: {{ new Date(event.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) }}
            </p>
            <h3 :class="['font-black text-white leading-tight mb-6 uppercase tracking-tighter', idx === 0 ? 'text-5xl' : 'text-3xl']">{{ event.title }}</h3>
            <div class="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
              <p class="text-zinc-400 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
                <svg class="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                {{ event.location }}
              </p>
              <RouterLink :to="`/events/${event.id}`" class="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center hover:scale-110 transition-transform">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════ -->
    <!-- SECTOR MARQUEE                            -->
    <!-- ══════════════════════════════════════════ -->
    <section class="py-16 border-y border-white/5 bg-white/[0.01] overflow-hidden z-10 relative">
      <div class="flex animate-marquee whitespace-nowrap items-center gap-12">
        <template v-for="i in 4" :key="i">
          <RouterLink v-for="cat in eventsStore.categories" :key="`${i}-${cat.id}`" :to="`/events?category=${cat.id}`" 
            class="group flex items-center gap-4 opacity-40 hover:opacity-100 transition-opacity">
            <span class="text-4xl font-black tracking-tighter uppercase text-zinc-700 group-hover:text-white">{{ cat.name }}</span>
            <span class="text-xs font-mono text-zinc-800 group-hover:text-cyan-500">[{{ cat.event_count || 0 }}]</span>
            <span class="w-2 h-2 rounded-full bg-zinc-800 group-hover:bg-violet-500 group-hover:animate-pulse"></span>
          </RouterLink>
        </template>
      </div>
    </section>

    <!-- ══════════════════════════════════════════ -->
    <!-- UPCOMING PIPELINE                         -->
    <!-- ══════════════════════════════════════════ -->
    <section class="relative py-32 px-6 max-w-[75rem] mx-auto z-10">
      <div class="text-center mb-24">
        <h2 class="text-xs font-black text-zinc-600 uppercase tracking-[0.6em] mb-6">Operational Pipeline</h2>
        <h3 class="text-5xl md:text-7xl font-black tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-700">Imminent Launches</h3>
      </div>

      <div class="space-y-6">
        <div v-for="event in eventsStore.events.slice(0, 5)" :key="event.id"
          class="group relative flex flex-col md:flex-row items-center gap-8 p-6 rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 hover:border-violet-500/30 transition-all duration-500">
          
          <div class="text-center border-r border-white/5 pr-10 hidden md:block">
            <p class="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] mb-1">{{ formatShortDate(event.event_date).month }}</p>
            <p class="text-5xl font-black text-white tracking-tighter leading-none">{{ formatShortDate(event.event_date).day }}</p>
          </div>

          <div class="w-full md:w-40 h-32 rounded-2xl overflow-hidden shrink-0">
            <img :src="event.image_url || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400'" class="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
          </div>

          <div class="flex-1 w-full">
            <span class="text-[9px] font-black text-violet-500 uppercase tracking-[0.3em]">{{ event.category_name }}</span>
            <h3 class="text-2xl md:text-3xl font-black text-white mt-1 mb-2 group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{{ event.title }}</h3>
            <p class="text-zinc-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke-width="2.5"/></svg>
              {{ event.location }}
            </p>
          </div>

          <div class="w-full md:w-auto flex items-center justify-between md:flex-col md:items-end md:justify-center gap-4 border-t md:border-none border-white/5 pt-6 md:pt-0">
            <span class="text-2xl font-black text-white tracking-tighter">{{ event.price_cents > 0 ? `$${(event.price_cents/100).toFixed(0)}` : 'FREE' }}</span>
            <RouterLink :to="`/events/${event.id}`" class="px-8 py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-cyan-400 transition-all">
              Initialize Access
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════ -->
    <!-- ARCHIVE SECTION (HALL OF FAME)            -->
    <!-- ══════════════════════════════════════════ -->
    <section class="relative py-32 px-6 z-10 border-t border-white/5">
      <div class="max-w-[90rem] mx-auto">
        <div class="mb-16">
          <h2 class="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500 mb-4">Historical Data</h2>
          <h3 class="text-4xl font-black uppercase tracking-tighter">Event Archives</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div v-for="event in pastEvents" :key="event.id" class="group relative rounded-[3rem] overflow-hidden aspect-[16/8] bg-[#0a0a0a] border border-white/5">
            <img :src="event.image" class="absolute inset-0 w-full h-full object-cover opacity-20 transition-all duration-1000 group-hover:scale-105 group-hover:opacity-40" />
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            
            <div class="absolute inset-0 p-12 flex flex-col justify-end">
              <span class="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-4">Dossier: Archived</span>
              <h3 class="text-4xl font-black text-white mb-4 uppercase tracking-tighter group-hover:text-rose-500 transition-colors">{{ event.title }}</h3>
              <div class="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                <span>{{ event.date }}</span>
                <span class="w-1 h-1 rounded-full bg-zinc-800"></span>
                <span>{{ event.attendees }} Entities Logged</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════ -->
    <!-- FINAL DEPLOYMENT CALL                      -->
    <!-- ══════════════════════════════════════════ -->
    <section class="relative py-40 px-6 z-10">
      <div class="max-w-[80rem] mx-auto bg-white/[0.02] border border-white/5 rounded-[4rem] p-16 md:p-32 text-center relative overflow-hidden group">
        <div class="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none group-hover:opacity-50 transition-opacity"></div>
        
        <div class="relative z-10">
          <h2 class="text-5xl md:text-8xl font-black mb-10 text-white tracking-tighter leading-[0.85] uppercase">
            Deploy your <br />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Operational Module.</span>
          </h2>
          <p class="text-zinc-500 text-lg md:text-xl max-w-xl mx-auto mb-16 font-medium">
            Join the collective. Host world-class events with verified telemetry and high-end management tools.
          </p>

          <div class="flex flex-col sm:flex-row justify-center items-center gap-6">
            <RouterLink to="/auth/register" class="w-full sm:w-auto px-12 py-5 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-[0_0_50px_rgba(255,255,255,0.2)]">
              Initialize Deployment
            </RouterLink>
            <RouterLink to="/organizer/planners" class="w-full sm:w-auto px-12 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all">
              Audit Personnel
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.animate-marquee {
  animation: marquee 40s linear infinite;
  width: max-content;
}

.animate-marquee:hover {
  animation-play-state: paused;
}

h1, h2, h3, h4, p, span, button {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}
</style>
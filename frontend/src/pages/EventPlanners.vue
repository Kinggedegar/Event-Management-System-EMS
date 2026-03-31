<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'

const planners = ref([
  {
    id: 1,
    name: "Aisha Kamara",
    title: "Senior Event Strategist",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=600&fit=crop",
    rating: 4.9,
    eventsPlanned: 87,
    specialization: "Corporate • Tech Summits • Conferences",
    bio: "Award-winning planner with 8+ years creating unforgettable corporate and tech events across West Africa.",
    location: "Monrovia, Liberia",
    priceRange: "$$$",
    verified: true
  },
  {
    id: 2,
    name: "Kwame Mensah",
    title: "Creative Festival Director",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop",
    rating: 4.8,
    eventsPlanned: 64,
    specialization: "Music Festivals • Cultural Events • Weddings",
    bio: "Known for transforming ordinary spaces into magical experiences.",
    location: "Monrovia & Accra",
    priceRange: "$$",
    verified: true
  },
  {
    id: 3,
    name: "Fatou Sankoh",
    title: "Luxury Wedding & Private Planner",
    image: "https://images.unsplash.com/photo-1580489944761-09be1ec59862?w=600&h=600&fit=crop",
    rating: 5.0,
    eventsPlanned: 42,
    specialization: "Weddings • Private Parties • VIP Events",
    bio: "Creating elegant celebrations with meticulous attention to detail.",
    location: "Monrovia, Liberia",
    priceRange: "$$$$",
    verified: true
  },
  {
    id: 4,
    name: "Mohammed Conteh",
    title: "Community Event Specialist",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=600&fit=crop",
    rating: 4.7,
    eventsPlanned: 119,
    specialization: "Fundraisers • Workshops • Community Events",
    bio: "Helping organizations create meaningful impact through events.",
    location: "Monrovia, Liberia",
    priceRange: "$",
    verified: false
  }
])

const searchQuery = ref('')
const selectedSpecialization = ref('')

const filteredPlanners = computed(() => {
  return planners.value.filter(planner => {
    const query = searchQuery.value.toLowerCase()
    const matchesSearch = planner.name.toLowerCase().includes(query) ||
                         planner.bio.toLowerCase().includes(query) ||
                         planner.location.toLowerCase().includes(query)
    
    const matchesSpec = !selectedSpecialization.value || 
                       planner.specialization.toLowerCase().includes(selectedSpecialization.value.toLowerCase())
    
    return matchesSearch && matchesSpec
  })
})
</script>

<template>
  <div class="min-h-screen bg-[#050505] text-white relative font-sans overflow-x-hidden">
    
    <!-- Global Decorative Elements -->
    <div class="pointer-events-none fixed inset-0 z-0 opacity-[0.03]" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>
    <div class="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
    <div class="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

    <!-- ══════════════════════════════════════════ -->
    <!-- HERO HEADER                               -->
    <!-- ══════════════════════════════════════════ -->
    <div class="relative pt-32 pb-16 z-10">
      <div class="max-w-[90rem] mx-auto px-6 md:px-12 lg:px-20">
        <div class="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
            <span class="w-2 h-2 rounded-full bg-violet-500 animate-pulse"></span>
            <span class="text-[10px] font-black text-zinc-300 uppercase tracking-[0.3em]">Elite Personnel</span>
          </div>
          
          <h1 class="text-5xl md:text-7xl font-black tracking-tighter text-white leading-[0.9] mb-8 uppercase">
            Platform <span class="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-500">Architects</span>
          </h1>
          
          <p class="text-xl text-zinc-400 font-medium leading-relaxed max-w-2xl">
            Connect with the platform's highest-rated event strategists to engineer your next unforgettable experience.
          </p>
        </div>

        <!-- ══════════════════════════════════════════ -->
        <!-- COMMAND CONSOLE (FILTERS)                  -->
        <!-- ══════════════════════════════════════════ -->
        <div class="mt-16 max-w-4xl mx-auto bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-4 flex flex-col md:flex-row gap-4 shadow-2xl backdrop-blur-xl">
          <div class="flex-1 relative group">
            <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-violet-500 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="SEARCH BY NAME, LOCATION OR EXPERTISE..."
              class="w-full pl-14 pr-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-xs font-black tracking-widest text-white placeholder-zinc-700 outline-none focus:border-violet-500/50 focus:bg-white/[0.05] transition-all"
            />
          </div>

          <select 
            v-model="selectedSpecialization"
            class="md:w-64 px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400 outline-none hover:border-white/20 appearance-none cursor-pointer"
          >
            <option value="">ALL SPECIALIZATIONS</option>
            <option value="corporate">CORPORATE & TECH</option>
            <option value="music">MUSIC & FESTIVALS</option>
            <option value="wedding">WEDDINGS & PRIVATE</option>
            <option value="community">COMMUNITY EVENTS</option>
          </select>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════════════ -->
    <!-- PLANNER GRID                               -->
    <!-- ══════════════════════════════════════════ -->
    <div class="max-w-[90rem] mx-auto px-6 md:px-12 lg:px-20 pb-32 relative z-10">
      <div v-if="filteredPlanners.length === 0" class="text-center py-40 bg-white/[0.02] border border-white/5 rounded-[4rem] border-dashed">
         <p class="text-zinc-600 font-black uppercase tracking-widest italic">Query returned zero matching personnel.</p>
         <button @click="searchQuery = ''; selectedSpecialization = ''" class="mt-6 text-xs font-black text-violet-400 hover:text-white transition-colors uppercase tracking-widest">Reset Parameters</button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="planner in filteredPlanners"
          :key="planner.id"
          class="group relative bg-[#0a0a0a] border border-white/10 rounded-[3rem] overflow-hidden hover:border-white/20 hover:-translate-y-2 transition-all duration-500 shadow-2xl"
        >
          <!-- Media Section -->
          <div class="relative h-96 overflow-hidden">
            <img 
              :src="planner.image" 
              :alt="planner.name"
              class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 grayscale-[0.3] group-hover:grayscale-0"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent"></div>
            
            <div v-if="planner.verified" 
              class="absolute top-6 right-6 bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-xl text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Verified
            </div>
          </div>

          <!-- Dossier Section -->
          <div class="p-8 -mt-16 relative z-10">
            <div class="flex justify-between items-end mb-6">
              <div>
                <h3 class="text-3xl font-black text-white tracking-tighter leading-none mb-2">{{ planner.name }}</h3>
                <p class="text-violet-400 text-[10px] font-black uppercase tracking-[0.2em]">{{ planner.title }}</p>
              </div>
              <div class="text-right">
                <div class="flex items-center gap-1.5 text-amber-400 font-black text-lg">
                   <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                   {{ planner.rating }}
                </div>
                <p class="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-1">{{ planner.eventsPlanned }} Missions</p>
              </div>
            </div>

            <p class="text-zinc-500 text-sm font-medium leading-relaxed mb-8 line-clamp-2 italic">
              "{{ planner.bio }}"
            </p>

            <!-- Metadata Strip -->
            <div class="flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-2xl mb-8">
              <div class="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                <svg class="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke-width="2.5"/></svg>
                {{ planner.location }}
              </div>
              <div class="font-mono text-emerald-400 font-black text-xs tracking-widest">{{ planner.priceRange }}</div>
            </div>

            <div class="mb-8">
              <p class="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-3">Field Specialization</p>
              <p class="text-xs text-zinc-300 font-bold tracking-tight">{{ planner.specialization }}</p>
            </div>

            <!-- Action Cluster -->
            <div class="flex gap-3">
              <RouterLink 
                :to="`/planners/${planner.id}`"
                class="flex-1 py-4 text-center bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
              >
                Full Dossier
              </RouterLink>
              
              <button class="flex-1 py-4 text-center bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95">
                Collaborate
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Industrial text smoothing */
h1, h2, h3, p, span, input, select, button {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Custom dropdown arrow for obsidian theme */
select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1.5rem center;
  background-size: 0.8rem;
}
</style>
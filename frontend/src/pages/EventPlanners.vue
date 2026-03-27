<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'

const planners = ref([
  {
    id: 1,
    name: "Aisha Kamara",
    title: "Senior Event Strategist",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
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
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
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
    image: "https://images.unsplash.com/photo-1580489944761-09be1ec59862?w=400&h=400&fit=crop",
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
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
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
    const matchesSearch = planner.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         planner.bio.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesSpec = !selectedSpecialization.value || 
                       planner.specialization.toLowerCase().includes(selectedSpecialization.value.toLowerCase())
    
    return matchesSearch && matchesSpec
  })
})
</script>

<template>
  <div class="min-h-screen bg-gray-950">

    <!-- Hero Header -->
    <div class="relative border-b border-white/10 bg-gray-900/80 backdrop-blur-xl">
      <div class="max-w-7xl mx-auto px-6 py-16">
        <div class="text-center max-w-3xl mx-auto">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/5 mb-6">
            <span class="text-xs font-medium text-violet-400 tracking-widest">FOR ORGANIZERS</span>
          </div>
          
          <h1 class="text-5xl md:text-6xl font-black tracking-tighter text-white leading-none mb-6">
            Meet Our <span class="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Top Planners</span>
          </h1>
          
          <p class="text-xl text-gray-400">
            Connect with experienced event professionals to help plan your next event.
          </p>
        </div>

        <!-- Filters -->
        <div class="mt-12 max-w-2xl mx-auto flex flex-col sm:flex-row gap-4">
          <div class="relative flex-1">
            <svg class="absolute left-4 top-3.5 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search planners by name or expertise..."
              class="w-full bg-gray-900 border border-white/10 rounded-2xl pl-11 py-3.5 text-white placeholder-gray-500 focus:border-violet-500/50 focus:outline-none"
            />
          </div>

          <select 
            v-model="selectedSpecialization"
            class="bg-gray-900 border border-white/10 rounded-2xl px-5 py-3.5 text-gray-300 focus:border-violet-500/50 focus:outline-none"
          >
            <option value="">All Specializations</option>
            <option value="corporate">Corporate & Tech</option>
            <option value="music">Music & Festivals</option>
            <option value="wedding">Weddings & Private</option>
            <option value="community">Community Events</option>
          </select>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="planner in filteredPlanners"
          :key="planner.id"
          class="group bg-gray-900/70 border border-white/10 rounded-3xl overflow-hidden hover:border-violet-500/30 transition-all duration-300 hover:scale-[1.02]"
        >
          <div class="relative h-80 overflow-hidden">
            <img 
              :src="planner.image" 
              :alt="planner.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-transparent"></div>
            
            <div v-if="planner.verified" 
              class="absolute top-5 right-5 bg-emerald-500/90 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
              ✓ Verified
            </div>
          </div>

          <div class="p-7">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-2xl font-bold text-white">{{ planner.name }}</h3>
                <p class="text-violet-400 text-sm">{{ planner.title }}</p>
              </div>
              <div class="text-right">
                <div class="flex items-center gap-1 text-amber-400">★ {{ planner.rating }}</div>
                <p class="text-xs text-gray-500">{{ planner.eventsPlanned }} events</p>
              </div>
            </div>

            <p class="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
              {{ planner.bio }}
            </p>

            <div class="flex items-center justify-between text-xs mb-6">
              <div class="flex items-center gap-1 text-gray-400">
                📍 {{ planner.location }}
              </div>
              <div class="font-mono text-violet-400">{{ planner.priceRange }}</div>
            </div>

            <div class="mb-6">
              <p class="text-xs uppercase tracking-widest text-gray-500 mb-2">Specializes in</p>
              <p class="text-sm text-gray-300">{{ planner.specialization }}</p>
            </div>

            <div class="flex gap-3">
              <RouterLink 
                :to="`/planners/${planner.id}`"
                class="flex-1 py-3.5 text-center bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl text-sm font-medium transition-all"
              >
                View Profile
              </RouterLink>
              
              <button class="flex-1 py-3.5 text-center bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-2xl text-sm font-semibold transition-all shadow-lg shadow-violet-500/30">
                Message Planner
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
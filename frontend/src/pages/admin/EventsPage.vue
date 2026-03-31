<template>
  <div class="min-h-screen bg-[#050505] text-white relative font-sans p-4 md:p-8 overflow-hidden">
    
    <!-- Global Noise Overlay -->
    <div class="pointer-events-none fixed inset-0 z-0 opacity-[0.03]" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>

    <!-- Ambient Glowing Orbs -->
    <div class="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

    <!-- Toast Notification -->
    <Transition name="toast">
      <div v-if="toast.message" 
           :class="[
             'fixed top-8 right-8 z-[100] px-6 py-4 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-center gap-3',
             toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
           ]">
        <div :class="['w-2 h-2 rounded-full animate-pulse', toast.type === 'success' ? 'bg-emerald-400' : 'bg-rose-400']"></div>
        <span class="text-sm font-bold tracking-wide">{{ toast.message }}</span>
      </div>
    </Transition>

    <div class="relative z-10 max-w-[90rem] mx-auto space-y-8">
      
      <!-- ================= HEADER ================= -->
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 backdrop-blur-xl">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-3">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Event Control</span>
          </div>
          <h1 class="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 tracking-tight">
            Event Management
          </h1>
          <p class="text-zinc-400 font-medium mt-1">Review, moderate, and feature community-driven events.</p>
        </div>
      </div>

      <!-- ================= STATS CARDS ================= -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div v-for="stat in stats" :key="stat.label" class="group relative bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-6 hover:-translate-y-1 transition-all duration-300">
          <div class="flex items-center gap-4 relative z-10">
            <div :class="['h-12 w-12 rounded-xl border flex items-center justify-center', stat.colorClass]">
              <component :is="stat.icon" class="w-5 h-5" />
            </div>
            <div>
              <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{{ stat.label }}</p>
              <p class="text-3xl font-black text-white">{{ stat.value }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ================= FILTERS ================= -->
      <div class="bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-4 relative z-10">
        <div class="flex-1 relative group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m1.6-4.15a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search events by title..."
            class="w-full pl-11 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all font-medium"
          />
        </div>
        
        <div class="flex gap-4 w-full md:w-auto">
          <select v-model="statusFilter" class="w-full md:w-40 px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-zinc-300 outline-none focus:border-emerald-400 transition-all cursor-pointer font-medium appearance-none">
            <option value="" class="bg-zinc-900">All Status</option>
            <option value="draft" class="bg-zinc-900">Draft</option>
            <option value="published" class="bg-zinc-900">Published</option>
            <option value="cancelled" class="bg-zinc-900">Cancelled</option>
          </select>
          
          <select v-model="categoryFilter" class="w-full md:w-44 px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-zinc-300 outline-none focus:border-emerald-400 transition-all cursor-pointer font-medium appearance-none">
            <option value="" class="bg-zinc-900">All Categories</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id" class="bg-zinc-900">{{ cat.name }}</option>
          </select>
        </div>
      </div>

      <LoadingSpinner v-if="loading" class="py-20" />

      <!-- ================= EVENTS LIST ================= -->
      <div v-else class="space-y-6">
        <div v-for="event in filteredEvents" :key="event.id" 
             class="group relative bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-white/20 transition-all duration-500">
          
          <div class="flex flex-col lg:flex-row">
            <!-- Image Section -->
            <div class="lg:w-72 h-48 lg:h-auto relative overflow-hidden">
              <img 
                :src="event.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop'" 
                :alt="event.title"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              
              <div class="absolute top-4 left-4 flex gap-2">
                <span :class="[
                  'px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border backdrop-blur-md',
                  event.status === 'published' ? 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30' :
                  event.status === 'draft' ? 'text-amber-400 bg-amber-500/20 border-amber-500/30' :
                  'text-rose-400 bg-rose-500/20 border-rose-500/30'
                ]">
                  {{ event.status }}
                </span>
                <span v-if="event.featured" class="px-3 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                  Featured
                </span>
              </div>
            </div>

            <!-- Content Section -->
            <div class="flex-1 p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 class="text-2xl font-black text-white tracking-tight mb-1 group-hover:text-emerald-400 transition-colors">{{ event.title }}</h3>
                    <p class="text-sm text-zinc-500 font-medium">
                      Organized by <span class="text-zinc-300">{{ event.organizer_name }}</span> 
                      <span class="mx-2 text-zinc-700">•</span> 
                      <span class="text-zinc-500 italic">{{ event.organizer_email }}</span>
                    </p>
                  </div>
                  <div class="flex items-center gap-3">
                     <!-- Action Icons Group -->
                     <router-link :to="`/events/${event.id}`" target="_blank" class="p-3 rounded-2xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all" title="View Live Page">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                     </router-link>
                     <button @click="deleteEvent(event.id)" class="p-3 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all" title="Delete Event">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                     </button>
                  </div>
                </div>

                <!-- Stats Grid -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-6 p-5 bg-white/[0.02] border border-white/5 rounded-3xl mb-6">
                  <div>
                    <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Date</p>
                    <p class="text-sm font-bold text-zinc-200">{{ formatDate(event.event_date) }}</p>
                  </div>
                  <div>
                    <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Location</p>
                    <p class="text-sm font-bold text-zinc-200 truncate">{{ event.location || 'TBA' }}</p>
                  </div>
                  <div>
                    <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Registrations</p>
                    <p class="text-sm font-bold text-zinc-200">{{ event.registration_count || 0 }}</p>
                  </div>
                  <div>
                    <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Revenue</p>
                    <p class="text-sm font-bold text-emerald-400">${{ (event.revenue || 0).toFixed(2) }}</p>
                  </div>
                </div>
              </div>

              <!-- Primary Action Footer -->
              <div class="flex flex-wrap items-center gap-3">
                <button 
                  v-if="event.status === 'draft'"
                  @click="approveEvent(event.id)"
                  class="px-6 py-2 bg-emerald-500 text-black rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-400 transition-colors"
                >
                  Approve & Publish
                </button>

                <button 
                  v-if="!event.featured"
                  @click="featureEvent(event.id)"
                  class="px-6 py-2 bg-purple-600/10 border border-purple-500/30 text-purple-400 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all"
                >
                  Mark as Featured
                </button>
                <button 
                  v-else
                  @click="unfeatureEvent(event.id)"
                  class="px-6 py-2 bg-purple-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-purple-700 transition-all"
                >
                  Unfeature
                </button>

                <button 
                  v-if="event.status === 'published'"
                  @click="cancelEvent(event.id)"
                  class="px-6 py-2 bg-zinc-900 border border-white/10 text-rose-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
                >
                  Cancel Event
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredEvents.length === 0 && !loading" class="text-center py-20 bg-[#0a0a0a] rounded-[3rem] border border-dashed border-white/10">
        <p class="text-zinc-500 font-medium text-lg italic">No events match your current filters.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

// Logic
const loading = ref(true)
const events = ref([])
const categories = ref([])
const searchQuery = ref('')
const statusFilter = ref('')
const categoryFilter = ref('')
const toast = ref({ message: '', type: 'success' })

// Stats calculation
const stats = computed(() => [
  { 
    label: 'Total Events', 
    value: events.value.length, 
    colorClass: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    icon: 'svg-total' // Simplified for demo
  },
  { 
    label: 'Published', 
    value: events.value.filter(e => e.status === 'published').length, 
    colorClass: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    icon: 'svg-published'
  },
  { 
    label: 'Draft/Pending', 
    value: events.value.filter(e => e.status === 'draft').length, 
    colorClass: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    icon: 'svg-draft'
  },
  { 
    label: 'Total Revenue', 
    value: `$${events.value.reduce((acc, curr) => acc + (curr.revenue || 0), 0).toLocaleString()}`, 
    colorClass: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    icon: 'svg-revenue'
  }
])

const showToast = (message, type = 'success', ms = 3000) => {
  toast.value.message = message
  toast.value.type = type
  setTimeout(() => {
    toast.value.message = ''
  }, ms)
}

const filteredEvents = computed(() => {
  return events.value.filter(event => {
    const matchesSearch = !searchQuery.value || 
      event.title?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = !statusFilter.value || event.status === statusFilter.value
    const matchesCategory = !categoryFilter.value || event.category_id === parseInt(categoryFilter.value)
    return matchesSearch && matchesStatus && matchesCategory
  })
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  })
}

const featureEvent = async (eventId) => {
  try {
    await api.put(`/admin/events/${eventId}/feature`, { featured: true })
    const event = events.value.find(e => e.id === eventId)
    if (event) event.featured = true
    showToast('Event featured successfully')
  } catch (error) {
    showToast('Failed to feature event', 'error')
  }
}

const unfeatureEvent = async (eventId) => {
  try {
    await api.put(`/admin/events/${eventId}/feature`, { featured: false })
    const event = events.value.find(e => e.id === eventId)
    if (event) event.featured = false
    showToast('Event unfeatured')
  } catch (error) {
    showToast('Failed to unfeature', 'error')
  }
}

const cancelEvent = async (eventId) => {
  if (!confirm('Are you sure you want to cancel this event?')) return
  try {
    await api.put(`/admin/events/${eventId}/status`, { status: 'cancelled' })
    const event = events.value.find(e => e.id === eventId)
    if (event) event.status = 'cancelled'
    showToast('Event cancelled', 'error')
  } catch (error) {
    showToast('Operation failed', 'error')
  }
}

const approveEvent = async (eventId) => {
  if (!confirm('Approve and publish this event?')) return
  try {
    await api.put(`/admin/events/${eventId}/status`, { status: 'published' })
    showToast('Event approved and published', 'success')
    await fetchData()
  } catch (error) {
    showToast('Failed to approve event', 'error')
  }
}

const deleteEvent = async (eventId) => {
  if (!confirm('Permanent delete? This cannot be undone.')) return
  try {
    await api.delete(`/admin/events/${eventId}`)
    events.value = events.value.filter(e => e.id !== eventId)
    showToast('Event deleted')
  } catch (error) {
    showToast('Delete failed', 'error')
  }
}

const fetchData = async () => {
  try {
    const [eventsRes, catsRes] = await Promise.all([
      api.get('/admin/events'),
      api.get('/categories')
    ])
    events.value = eventsRes.data.events || []
    categories.value = catsRes.data.categories || []
  } catch (error) {
    console.error('Data fetch error')
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>

<style scoped>
.toast-enter-active, .toast-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.9);
}

select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1rem;
}
</style>
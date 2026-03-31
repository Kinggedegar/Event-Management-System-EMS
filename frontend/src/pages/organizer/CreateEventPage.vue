<template>
  <div class="min-h-screen bg-[#050505] text-white relative font-sans p-4 md:p-8 overflow-x-hidden">
    
    <!-- Global Decorative Elements -->
    <div class="pointer-events-none fixed inset-0 z-0 opacity-[0.03]" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>
    <div class="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
    <div class="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

    <div class="relative z-10 max-w-[90rem] mx-auto space-y-8">
      
      <!-- ================= HEADER ================= -->
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
            <span class="w-2 h-2 rounded-full bg-violet-500 animate-pulse"></span>
            <span class="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Module Deployment</span>
          </div>
          <h1 class="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 tracking-tighter">
            Create New Event
          </h1>
          <p class="text-zinc-400 font-medium mt-1">Configure parameters for your next platform experience.</p>
        </div>

        <!-- Progress Steps -->
        <div class="flex items-center gap-4 bg-black/40 p-2 rounded-2xl border border-white/5">
          <div v-for="(s, i) in ['Basic', 'Access', 'Deploy']" :key="i" class="flex items-center gap-2 px-4 py-2 rounded-xl" :class="i === 0 ? 'bg-white/10 text-white' : 'text-zinc-600'">
            <span class="text-[10px] font-black uppercase tracking-widest">{{ s }}</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- ================= FORM SECTION ================= -->
        <div class="lg:col-span-8 space-y-8">
          
          <!-- Basic Info -->
          <div class="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 space-y-8 relative overflow-hidden group">
            <div class="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 blur-3xl rounded-full"></div>
            
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h2 class="text-xl font-black text-white uppercase tracking-tight">Basic Architecture</h2>
            </div>

            <div class="space-y-6">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Event Designation (Title)</label>
                <input v-model="form.title" type="text" required class="terminal-input" placeholder="e.g. Global Tech Summit 2026" />
              </div>

              <div class="space-y-2">
                <label class="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Manifesto (Description)</label>
                <textarea v-model="form.description" rows="4" required class="terminal-input resize-none" placeholder="Elaborate on the event's purpose and agenda..."></textarea>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Vector Category</label>
                  <select v-model="form.category_id" required class="terminal-input appearance-none cursor-pointer">
                    <option value="">Select Domain</option>
                    <option v-for="cat in activeCategories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                  </select>
                </div>
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Visual Identity (URL)</label>
                  <input v-model="form.image_url" type="url" class="terminal-input" placeholder="https://cdn.assets.com/hero.jpg" />
                </div>
              </div>
            </div>
          </div>

          <!-- Date & Location -->
          <div class="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 space-y-8 relative overflow-hidden group">
            <div class="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full"></div>
            
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <h2 class="text-xl font-black text-white uppercase tracking-tight">Temporal & Spatial Parameters</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Commencement Time</label>
                <input v-model="form.event_date" type="datetime-local" required class="terminal-input" />
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Termination Time</label>
                <input v-model="form.end_date" type="datetime-local" class="terminal-input" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Physical/Digital Venue</label>
                <input v-model="form.location" type="text" required class="terminal-input" placeholder="The Grid, Silicon Valley / Zoom Terminal" />
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Max Occupancy</label>
                <input v-model="form.capacity" type="number" min="1" class="terminal-input" placeholder="Infinite" />
              </div>
            </div>
          </div>

          <!-- Access Tiers (Tickets) -->
          <div class="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 space-y-8 relative overflow-hidden group">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                </div>
                <h2 class="text-xl font-black text-white uppercase tracking-tight">Access Tiers</h2>
              </div>
              <button type="button" @click="addTicket" class="px-4 py-2 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all">
                + Add Tier
              </button>
            </div>

            <TransitionGroup name="list" tag="div" class="space-y-4">
              <div v-for="(ticket, index) in form.tickets" :key="index" class="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-6 relative group/tier">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Tier Codename #0{{ index + 1 }}</span>
                  <button v-if="form.tickets.length > 1" type="button" @click="removeTicket(index)" class="text-rose-500 hover:text-rose-400 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Designation</label>
                    <input v-model="ticket.name" type="text" required class="terminal-input" placeholder="General Access" />
                  </div>
                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Unit Price ($)</label>
                    <input v-model="ticket.price" type="number" min="0" step="0.01" required class="terminal-input" placeholder="0.00" />
                  </div>
                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Available Units</label>
                    <input v-model="ticket.quantity" type="number" min="1" required class="terminal-input" placeholder="100" />
                  </div>
                </div>
              </div>
            </TransitionGroup>
          </div>

          <!-- Actions -->
          <div class="flex flex-wrap items-center gap-6 pt-8 border-t border-white/5">
            <button type="button" @click="$router.back()" class="px-8 py-4 text-zinc-500 hover:text-white font-black text-[10px] uppercase tracking-widest transition-colors">Abort Process</button>
            <div class="flex gap-4 ml-auto">
              <button type="button" :disabled="submitting" @click="handleDraft" class="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all">Save to Buffer</button>
              <button type="button" :disabled="submitting" @click="handlePublish" class="px-10 py-4 bg-emerald-500 text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(16,185,129,0.2)]">Execute Deployment</button>
            </div>
          </div>
        </div>

        <!-- ================= ASIDE PREVIEW ================= -->
        <aside class="lg:col-span-4">
          <div class="sticky top-24 space-y-8">
            <!-- Terminal Live Feed -->
            <div class="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-1 overflow-hidden shadow-2xl">
              <div class="relative h-56 overflow-hidden rounded-t-[2.2rem]">
                <img :src="form.image_url || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800'" class="w-full h-full object-cover opacity-60" />
                <div class="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent"></div>
                <div class="absolute top-6 left-6 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
                   <span class="text-[9px] font-black text-white uppercase tracking-widest">Live Preview</span>
                </div>
              </div>

              <div class="p-8 space-y-6">
                <div>
                  <p class="text-[9px] font-black text-violet-500 uppercase tracking-[0.3em] mb-2">{{ activeCategoryName }}</p>
                  <h3 class="text-2xl font-black text-white tracking-tighter leading-none">{{ form.title || 'MODULE_UNDEFINED' }}</h3>
                </div>

                <div class="space-y-3">
                  <div class="flex items-center gap-3 text-zinc-500">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span class="text-xs font-bold">{{ form.event_date ? formatDate(form.event_date) : 'DATE_NOT_SET' }}</span>
                  </div>
                  <div class="flex items-center gap-3 text-zinc-500">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                    <span class="text-xs font-bold truncate">{{ form.location || 'LOCATION_PENDING' }}</span>
                  </div>
                </div>

                <div class="pt-6 border-t border-white/5 flex items-center justify-between">
                   <span class="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Entry Threshold</span>
                   <span class="text-xl font-black text-emerald-400">{{ minPrice === 0 ? 'FREE' : '$' + minPrice }}</span>
                </div>
              </div>
            </div>

            <!-- Operational Checklist -->
            <div class="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 backdrop-blur-xl">
              <h4 class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-4">Deployment Integrity</h4>
              <ul class="space-y-3">
                <li v-for="(check, i) in checklist" :key="i" class="flex items-center gap-3">
                  <div class="w-4 h-4 rounded-full border border-white/10 flex items-center justify-center" :class="check.val ? 'bg-emerald-500 border-emerald-500 text-black' : 'bg-transparent'">
                    <svg v-if="check.val" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span class="text-xs font-bold" :class="check.val ? 'text-zinc-300' : 'text-zinc-600'">{{ check.label }}</span>
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()
const categories = ref([])
const submitting = ref(false)

// Default/Fallback Categories
const fallbackCategories = [
  { id: 1, name: 'Technology' },
  { id: 2, name: 'Nightlife' },
  { id: 3, name: 'Business' },
  { id: 4, name: 'Arts & Culture' },
  { id: 5, name: 'Sports' },
  { id: 6, name: 'Wellness' }
]

const form = ref({
  title: '',
  description: '',
  category_id: '',
  image_url: '',
  event_date: '',
  end_date: '',
  location: '',
  capacity: '',
  status: 'draft',
  tickets: [
    { name: 'General Admission', price: 0, quantity: 100, description: '' }
  ]
})

const activeCategories = computed(() => categories.value.length > 0 ? categories.value : fallbackCategories)
const activeCategoryName = computed(() => activeCategories.value.find(c => c.id == form.value.category_id)?.name || 'UNSPECIFIED')

const minPrice = computed(() => {
  const prices = form.value.tickets.map(t => Number(t.price || 0))
  return Math.min(...prices)
})

const checklist = computed(() => [
  { label: 'Primary designation set', val: !!form.value.title },
  { label: 'Temporal sync complete', val: !!form.value.event_date },
  { label: 'Spatial vector defined', val: !!form.value.location },
  { label: 'Access tiers established', val: form.value.tickets.every(t => t.name && t.quantity > 0) }
])

const addTicket = () => {
  form.value.tickets.push({ name: '', price: 0, quantity: 100, description: '' })
}

const removeTicket = (index) => {
  form.value.tickets.splice(index, 1)
}

const formatDate = (d) => {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).toUpperCase()
}

const handleDraft = () => {
  form.value.status = 'draft'
  submitForm()
}

const handlePublish = () => {
  form.value.status = 'published'
  submitForm()
}

const submitForm = async () => {
  if (!form.value.title || !form.value.event_date || !form.value.location) {
    alert('Security Check: Crucial parameters are missing.')
    return
  }

  submitting.value = true
  try {
    const { data } = await api.post('/events', {
      ...form.value,
      capacity: form.value.capacity || null
    })
    router.push(`/organizer/events/${data.event.id}`)
  } catch (error) {
    console.warn('Backend rejected deployment. Saving to local simulation.')
    alert(error.response?.data?.error || 'System Failure: Deployment unsuccessful.')
  } finally {
    submitting.value = false
  }
}

const fetchCategories = async () => {
  try {
    const { data } = await api.get('/categories')
    categories.value = data.categories || []
  } catch (error) {
    console.warn('API Unavailable. Defaulting to system fallback categories.')
  }
}

onMounted(fetchCategories)
</script>

<style scoped>
.terminal-input {
  @apply w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-sm font-bold text-white placeholder-zinc-700 outline-none focus:border-violet-500/50 focus:bg-white/[0.05] transition-all;
}

/* Animations */
.list-enter-active, .list-leave-active { transition: all 0.4s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateX(-20px); }

select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1.5rem center;
  background-size: 1rem;
}

h1, h2, h3, h4, p, span, label, input, select, textarea {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
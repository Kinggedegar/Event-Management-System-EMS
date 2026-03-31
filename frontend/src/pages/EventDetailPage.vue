<template>
  <div class="min-h-screen bg-[#050505] text-white relative font-sans overflow-x-hidden">
    
    <!-- Global Decorative Elements -->
    <div class="pointer-events-none fixed inset-0 z-0 opacity-[0.03]" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>
    <div class="absolute top-0 right-0 w-[800px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
    <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <LoadingSpinner size="lg" />
    </div>
    
    <div v-else-if="error && !event" class="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <h1 class="text-4xl font-black text-white mb-6 uppercase tracking-tighter">{{ error }}</h1>
      <RouterLink to="/events" class="px-8 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all">Return to Catalog</RouterLink>
    </div>
    
    <template v-else-if="event">
      <!-- ================= IMMERSIVE HERO ================= -->
      <div class="relative h-[50vh] md:h-[65vh] w-full overflow-hidden">
        <img 
          v-if="event.image"
          :src="event.image" 
          :alt="event.title"
          class="w-full h-full object-cover scale-105 blur-[2px] opacity-40 transition-transform duration-1000 group-hover:scale-100"
        >
        <div v-else class="w-full h-full bg-gradient-to-br from-zinc-900 to-black"></div>
        
        <!-- Overlays -->
        <div class="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent"></div>
        <div class="absolute inset-0 bg-black/20"></div>

        <!-- Content Overlay -->
        <div class="absolute bottom-0 left-0 w-full p-6 md:p-12 lg:p-20 z-10">
          <div class="max-w-[90rem] mx-auto">
            <div class="flex flex-wrap items-center gap-3 mb-6">
              <span v-if="event.category_name" class="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-violet-500/40 bg-violet-500/10 text-violet-400 backdrop-blur-md">
                {{ event.category_name }}
              </span>
              <span v-if="event.featured" class="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-amber-500/40 bg-amber-500/10 text-amber-400 backdrop-blur-md">
                Featured Entry
              </span>
            </div>
            <h1 class="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.9] max-w-4xl">
              {{ event.title }}
            </h1>
          </div>
        </div>
      </div>
      
      <!-- ================= MAIN SECTION ================= -->
      <div class="relative z-10 max-w-[90rem] mx-auto px-6 md:px-12 lg:px-20 -mt-10 pb-24">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <!-- LEFT: DOSSIER CONTENT -->
          <div class="lg:col-span-8 space-y-12">
            
            <!-- Quick Info Bar -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 bg-white/[0.03] border border-white/10 rounded-[2.5rem] backdrop-blur-xl">
              <div>
                <p class="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Date</p>
                <p class="text-sm font-bold text-white">{{ formattedDate }}</p>
              </div>
              <div>
                <p class="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Schedule</p>
                <p class="text-sm font-bold text-white">{{ event.time }} <span v-if="event.end_time" class="text-zinc-500">- {{ event.end_time }}</span></p>
              </div>
              <div>
                <p class="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Location</p>
                <p class="text-sm font-bold text-white truncate">{{ event.location }}</p>
              </div>
              <div>
                <p class="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Capacity</p>
                <p class="text-sm font-bold text-white">{{ event.registration_count || 0 }} Registered</p>
              </div>
            </div>

            <!-- Detailed Description -->
            <div class="space-y-6 px-4">
              <h2 class="text-sm font-black text-zinc-500 uppercase tracking-[0.4em]">Event Description</h2>
              <div class="text-lg text-zinc-300 leading-relaxed font-medium whitespace-pre-wrap prose prose-invert max-w-none">
                {{ event.description }}
              </div>
            </div>

            <!-- Organizer Profile -->
            <div class="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
              <h2 class="text-sm font-black text-zinc-500 uppercase tracking-[0.4em] mb-8">Authorized Organizer</h2>
              <div class="flex items-center gap-6">
                <div class="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500 p-[2px]">
                   <div class="w-full h-full rounded-full bg-[#050505] flex items-center justify-center">
                      <span class="text-2xl font-black text-white">{{ event.organizer_name?.[0]?.toUpperCase() }}</span>
                   </div>
                </div>
                <div>
                  <p class="text-2xl font-black text-white tracking-tight">{{ event.organizer_name }}</p>
                  <p class="text-zinc-500 font-medium italic mt-1">{{ event.organizer_bio || 'Verified Platform Organizer' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT: ACTION CONSOLE -->
          <div class="lg:col-span-4 lg:sticky lg:top-32 h-fit">
            <div class="bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-8 shadow-2xl overflow-hidden relative group">
              
              <!-- Glow Accent -->
              <div class="absolute -top-24 -right-24 w-48 h-48 bg-violet-600/20 blur-[60px] rounded-full pointer-events-none group-hover:opacity-40 transition-opacity"></div>

              <!-- Content -->
              <div v-if="isRegistered" class="text-center py-6">
                <div class="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                  <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 class="text-2xl font-black text-white mb-2">Access Granted</h3>
                <p class="text-zinc-500 font-medium mb-8">Ticket: {{ event.userRegistration.ticket_name }}</p>
                <RouterLink to="/dashboard/tickets" class="block w-full py-4 bg-white text-black rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all">
                  View Entry Pass
                </RouterLink>
              </div>

              <template v-else>
                <h3 class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-6">Select Access Tier</h3>
                
                <div v-if="availableTickets.length === 0" class="text-center py-10">
                  <p class="text-zinc-500 font-bold italic">All entries exhausted.</p>
                </div>
                
                <div v-else class="space-y-3 mb-8">
                  <button
                    v-for="ticket in availableTickets"
                    :key="ticket.id"
                    @click="selectTicket(ticket)"
                    :class="[
                      'w-full p-5 border transition-all duration-300 rounded-[1.5rem] text-left group/tier relative overflow-hidden',
                      selectedTicket?.id === ticket.id 
                        ? 'border-violet-500 bg-violet-500/5' 
                        : 'border-white/10 bg-white/[0.02] hover:border-white/30'
                    ]"
                  >
                    <div v-if="selectedTicket?.id === ticket.id" class="absolute left-0 top-0 bottom-0 w-1 bg-violet-500"></div>
                    <div class="flex justify-between items-center relative z-10">
                      <div>
                        <p class="font-black text-white group-hover/tier:text-violet-400 transition-colors uppercase text-xs tracking-widest">{{ ticket.name }}</p>
                        <p class="text-[10px] text-zinc-500 mt-1 font-bold">{{ ticket.available }} Units Remaining</p>
                      </div>
                      <p class="text-xl font-black text-white">
                        {{ ticket.price === 0 ? 'FREE' : `$${ticket.price}` }}
                      </p>
                    </div>
                  </button>
                </div>
                
                <!-- Quantity & Total -->
                <div v-if="selectedTicket" class="space-y-6 mb-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div class="flex items-center justify-between p-4 bg-white/[0.03] rounded-2xl border border-white/5">
                    <span class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Quantity</span>
                    <div class="flex items-center gap-4">
                      <button @click="quantity = Math.max(1, quantity - 1)" class="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M20 12H4" /></svg>
                      </button>
                      <span class="text-lg font-black w-6 text-center">{{ quantity }}</span>
                      <button @click="quantity = Math.min(selectedTicket.max_per_order || 10, selectedTicket.available, quantity + 1)" class="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" /></svg>
                      </button>
                    </div>
                  </div>
                  
                  <div class="flex justify-between items-center py-4 border-t border-white/10">
                    <span class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Subtotal</span>
                    <span class="text-3xl font-black text-white">
                      {{ selectedTicket.price === 0 ? 'FREE' : `$${(selectedTicket.price * quantity).toFixed(2)}` }}
                    </span>
                  </div>
                </div>
                
                <!-- Error Feed -->
                <Transition name="fade">
                  <div v-if="error" class="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs font-bold uppercase tracking-widest text-center">
                    {{ error }}
                  </div>
                </Transition>
                
                <!-- Main Action Button -->
                <button 
                  @click="handleRegister"
                  :disabled="registering || !selectedTicket"
                  class="group/btn w-full py-5 rounded-2xl bg-white text-black font-black uppercase text-xs tracking-[0.2em] shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  <LoadingSpinner v-if="registering" size="sm" color="black" />
                  <span>{{ authStore.isAuthenticated ? 'Secure Reservation' : 'Login to Continue' }}</span>
                  <svg v-if="!registering" class="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7" /></svg>
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </template>
    
    <!-- ================= PAYMENT & SUCCESS MODAL ================= -->
    <Transition name="modal">
      <div v-if="showRegistrationModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/90 backdrop-blur-xl" @click="showRegistrationModal = false"></div>
        <div class="relative bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-10 max-w-md w-full shadow-[0_0_100px_rgba(0,0,0,0.8)] text-center">
          
          <div class="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
            <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
          </div>
          
          <h3 class="text-3xl font-black text-white mb-3 tracking-tighter uppercase">Order Logged</h3>
          <p class="text-zinc-500 font-medium mb-10 leading-relaxed">
            {{ registrationSuccess?.total_amount > 0 
              ? 'Finalize transaction to authorize your digital entry pass.' 
              : 'Reservation confirmed. Access details have been synced to your profile.' 
            }}
          </p>
          
          <div v-if="registrationSuccess?.total_amount > 0" class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl mb-8">
               <span class="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Total Liability</span>
               <span class="text-2xl font-black text-white">${{ registrationSuccess.total_amount.toFixed(2) }}</span>
            </div>
            
            <button @click="processPayment" :disabled="registering" class="w-full py-5 bg-emerald-500 text-black rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-400 transition-all flex items-center justify-center gap-2">
              <LoadingSpinner v-if="registering" size="sm" color="black" />
              Authorize Payment
            </button>
          </div>
          
          <RouterLink v-else to="/dashboard/tickets" class="block w-full py-5 bg-white text-black rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-zinc-200 transition-all">
            Access Dashboard
          </RouterLink>
          
          <button @click="showRegistrationModal = false" class="mt-4 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] hover:text-white transition-colors">
            Close Terminal
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { format } from 'date-fns'
import { useEventsStore } from '../stores/events'
import { useRegistrationsStore } from '../stores/registrations'
import { useAuthStore } from '../stores/auth'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()
const eventsStore = useEventsStore()
const registrationsStore = useRegistrationsStore()
const authStore = useAuthStore()

const loading = ref(true)
const registering = ref(false)
const selectedTicket = ref(null)
const quantity = ref(1)
const showRegistrationModal = ref(false)
const registrationSuccess = ref(null)
const error = ref(null)

const event = computed(() => eventsStore.currentEvent)

onMounted(async () => {
  try {
    await eventsStore.fetchEvent(route.params.id)
  } catch (err) {
    error.value = 'Data Access Failure: Event Not Found'
  } finally {
    loading.value = false
  }
})

const formattedDate = computed(() => {
  if (!event.value?.date) return ''
  try {
    return format(new Date(event.value.date), 'MMMM dd, yyyy')
  } catch {
    return event.value.date
  }
})

const availableTickets = computed(() => {
  if (!event.value?.tickets) return []
  return event.value.tickets.map(t => ({
    ...t,
    available: t.quantity - (t.sold || 0)
  })).filter(t => t.available > 0)
})

const isRegistered = computed(() => !!event.value?.userRegistration)

function selectTicket(ticket) {
  selectedTicket.value = ticket
  quantity.value = 1
  error.value = null
}

async function handleRegister() {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }
  
  if (!selectedTicket.value) {
    error.value = 'Selection Required: Choose an Access Tier'
    return
  }
  
  registering.value = true
  error.value = null
  
  try {
    const result = await registrationsStore.registerForEvent(
      event.value.id,
      selectedTicket.value.id,
      quantity.value
    )
    
    registrationSuccess.value = result
    showRegistrationModal.value = true
    await eventsStore.fetchEvent(route.params.id)
  } catch (err) {
    error.value = err.response?.data?.error?.message || 'Handshake Failure: Registration Declined'
  } finally {
    registering.value = false
  }
}

async function processPayment() {
  if (!registrationSuccess.value) return
  registering.value = true
  error.value = null
  try {
    await registrationsStore.processPayment(registrationSuccess.value.id)
    showRegistrationModal.value = false
    router.push('/dashboard/tickets')
  } catch (err) {
    error.value = 'Gateway Error: Authorization Failed'
  } finally {
    registering.value = false
  }
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1); }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.95) translateY(20px); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
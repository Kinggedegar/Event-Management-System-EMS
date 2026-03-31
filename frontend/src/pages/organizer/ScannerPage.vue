<template>
  <div class="min-h-screen bg-[#050505] text-white relative font-sans p-4 md:p-8 overflow-x-hidden">
    
    <!-- Global Decorative Elements -->
    <div class="pointer-events-none fixed inset-0 z-0 opacity-[0.03]" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>
    <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
    <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

    <div class="relative z-10 max-w-3xl mx-auto space-y-8">
      
      <!-- ================= HEADER ================= -->
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Security Protocol: Active</span>
          </div>
          <h1 class="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 tracking-tighter uppercase">
            Access Validator
          </h1>
          <p class="text-zinc-400 font-medium mt-1">Authorize attendee entries and manage session handshakes.</p>
        </div>
      </div>

      <!-- ================= TARGET SELECTION ================= -->
      <div class="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden group">
        <label class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] block mb-4 ml-1">Target Deployment Module</label>
        <div class="relative group/select">
          <select 
            v-model="selectedEventId"
            class="w-full pl-6 pr-12 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-sm font-black text-white outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all appearance-none cursor-pointer"
          >
            <option value="" class="bg-zinc-900">SELECT EVENT TO INITIALIZE...</option>
            <option v-for="event in events" :key="event.id" :value="event.id" class="bg-zinc-900">
              {{ event.title.toUpperCase() }} — {{ formatDate(event.event_date) }}
            </option>
          </select>
          <svg class="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 pointer-events-none group-focus-within/select:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" /></svg>
        </div>
      </div>

      <!-- ================= TERMINAL INPUT ================= -->
      <div class="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8">
        <h2 class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-6 ml-1">Manual Cipher Handshake</h2>
        <form @submit.prevent="manualCheckIn" class="flex flex-col sm:flex-row gap-4">
          <input 
            v-model="registrationId"
            type="text"
            placeholder="ENTER REGISTERED ID OR PASS-KEY"
            class="flex-1 px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-sm font-mono font-bold text-white placeholder-zinc-700 outline-none focus:border-emerald-500/50 focus:bg-white/[0.05] transition-all"
          />
          <button 
            type="submit"
            :disabled="!selectedEventId || !registrationId || checking"
            class="px-8 py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <LoadingSpinner v-if="checking" size="sm" color="black" />
            {{ checking ? 'Validating...' : 'Authorize' }}
          </button>
        </form>
      </div>

      <!-- ================= AUTHORIZATION RESULT ================= -->
      <Transition name="slide-up">
        <div v-if="scanResult" 
             :class="scanResult.success ? 'bg-emerald-500/5 border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.1)]' : 'bg-rose-500/5 border-rose-500/20 shadow-[0_0_50px_rgba(244,63,94,0.1)]'"
             class="border rounded-[2.5rem] p-8 relative overflow-hidden backdrop-blur-md">
          
          <!-- Animated Barcode Background decoration -->
          <div class="absolute right-0 top-0 h-full w-32 flex gap-1 opacity-[0.05] pointer-events-none">
             <div v-for="i in 10" :key="i" class="h-full bg-current w-1" :style="{ opacity: Math.random() }"></div>
          </div>

          <div class="flex items-start gap-6 relative z-10">
            <div :class="scanResult.success ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'" class="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border border-current/20">
              <svg v-if="scanResult.success" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
              <svg v-else class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" /></svg>
            </div>
            <div class="flex-1">
              <h3 :class="scanResult.success ? 'text-emerald-400' : 'text-rose-400'" class="text-xl font-black uppercase tracking-tighter mb-1">
                {{ scanResult.success ? 'Authorization Confirmed' : 'Access Denied' }}
              </h3>
              <p :class="scanResult.success ? 'text-emerald-500/70' : 'text-rose-500/70'" class="text-xs font-bold uppercase tracking-widest">
                {{ scanResult.message }}
              </p>
              
              <!-- Dossier Breakdown -->
              <div v-if="scanResult.success && scanResult.registration" class="mt-8 grid grid-cols-2 gap-8 p-6 bg-white/[0.03] border border-white/5 rounded-3xl">
                <div>
                  <p class="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Identity</p>
                  <p class="text-sm font-black text-white truncate">{{ scanResult.registration.user_name }}</p>
                </div>
                <div>
                  <p class="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Tier</p>
                  <p class="text-sm font-black text-white uppercase">{{ scanResult.registration.ticket_name }}</p>
                </div>
                <div>
                  <p class="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Units</p>
                  <p class="text-sm font-black text-white">{{ scanResult.registration.quantity }} Pass(es)</p>
                </div>
                <div>
                  <p class="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Auth-Time</p>
                  <p class="text-sm font-black text-emerald-400 font-mono">{{ formatTime(new Date()) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- ================= RECENT SYSTEM LOGS ================= -->
      <div class="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden">
        <div class="p-6 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
          <h2 class="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em]">Live Handshake Log</h2>
          <span class="text-[9px] font-mono text-zinc-600">STREAMS_ACTIVE</span>
        </div>
        <div class="p-4 max-h-80 overflow-y-auto custom-scrollbar">
          <div v-if="recentCheckIns.length === 0" class="text-center py-12">
            <p class="text-[10px] font-black text-zinc-700 uppercase tracking-[0.2em] italic">Waiting for incoming telemetry...</p>
          </div>
          <div v-else class="space-y-3">
            <TransitionGroup name="list">
              <div v-for="checkIn in recentCheckIns" :key="checkIn.id"
                   class="group flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-all">
                <div class="flex items-center gap-4">
                  <div class="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <p class="text-sm font-black text-zinc-200 tracking-tight">{{ checkIn.user_name }}</p>
                    <p class="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{{ checkIn.ticket_name }}</p>
                  </div>
                </div>
                <div class="text-right">
                   <p class="text-[10px] font-mono font-bold text-zinc-500 group-hover:text-emerald-400 transition-colors">{{ checkIn.time }}</p>
                   <p class="text-[8px] font-black text-zinc-800 uppercase tracking-tighter">Verified</p>
                </div>
              </div>
            </TransitionGroup>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const events = ref([])
const selectedEventId = ref('')
const registrationId = ref('')
const checking = ref(false)
const scanResult = ref(null)
const recentCheckIns = ref([])

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).toUpperCase()
}

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}

const manualCheckIn = async () => {
  if (!selectedEventId.value || !registrationId.value) return
  
  checking.value = true
  scanResult.value = null
  
  try {
    const { data } = await api.post('/registrations/check-in', {
      registration_id: registrationId.value,
      event_id: selectedEventId.value
    })
    
    scanResult.value = {
      success: true,
      message: 'ENTRY AUTHORED: Handshake successful. Terminal updated.',
      registration: data.registration
    }
    
    recentCheckIns.value.unshift({
      id: data.registration.id,
      user_name: data.registration.user_name.toUpperCase(),
      ticket_name: data.registration.ticket_name.toUpperCase(),
      time: formatTime(new Date())
    })
    
    registrationId.value = ''
    
    // Auto-clear result after 10 seconds for clean terminal
    setTimeout(() => { scanResult.value = null }, 10000)
    
  } catch (error) {
    scanResult.value = {
      success: false,
      message: error.response?.data?.error?.toUpperCase() || 'PROTOCOL FAILURE: ENTRY DECLINED.'
    }
  } finally {
    checking.value = false
  }
}

const fetchEvents = async () => {
  try {
    const { data } = await api.get('/events/my-events')
    events.value = (data.events || []).filter(e => e.status === 'published')
  } catch (error) {
    console.error('Handshake Failure: Events not found.')
  }
}

onMounted(fetchEvents)
</script>

<style scoped>
/* Technical smoothing */
h1, h2, h3, p, span, input, select, button {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Animations */
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1); }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(20px); opacity: 0; }

.list-enter-active, .list-leave-active { transition: all 0.4s ease; }
.list-enter-from, .list-leave-to { transform: translateX(-10px); opacity: 0; }

/* Custom Terminal Scrollbar */
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }

/* Remove default select arrow */
select {
  background-image: none;
}
</style>
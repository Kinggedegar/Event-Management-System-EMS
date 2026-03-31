<template>
  <div class="relative group rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 overflow-hidden flex flex-col md:flex-row transition-all duration-700 hover:border-white/20 hover:shadow-[0_0_80px_rgba(0,0,0,0.5)]">
    
    <!-- Dynamic Ambient Glow (changes based on status) -->
    <div :class="[
      'absolute -inset-2 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-3xl pointer-events-none',
      registration.status === 'confirmed' ? 'bg-emerald-500/5' : 
      registration.status === 'pending' ? 'bg-amber-500/5' : 'bg-rose-500/5'
    ]"></div>

    <!-- ================= LEFT: EVENT IDENTITY ================= -->
    <div class="flex-1 flex flex-col sm:flex-row relative z-10 overflow-hidden">
      
      <!-- Event Media Hub -->
      <div class="w-full sm:w-64 h-56 sm:h-auto shrink-0 relative overflow-hidden group/img">
        <img 
          :src="registration.event_image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'" 
          :alt="registration.event_title"
          class="w-full h-full object-cover transition-transform duration-1000 group-hover/img:scale-110 opacity-60 grayscale-[0.3] group-hover:grayscale-0"
        />
        <!-- Cinematic Overlays -->
        <div class="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-[#0a0a0a] hidden sm:block"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent sm:hidden block"></div>
        
        <!-- Pass ID Overlay -->
        <div class="absolute top-4 left-4">
           <span class="text-[8px] font-black text-white/40 uppercase tracking-[0.3em] backdrop-blur-md bg-black/40 px-2 py-1 rounded">
             PASS-ID: {{ registration.id }}
           </span>
        </div>
      </div>
      
      <!-- Identity Content -->
      <div class="p-8 sm:pl-4 flex flex-col justify-center flex-1">
        <div class="flex flex-col items-start gap-4 mb-6">
          
          <!-- Industrial Status Indicator -->
          <div :class="getStatusClass(registration.status)" class="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] border backdrop-blur-2xl transition-all duration-500">
            <span class="relative flex h-2 w-2">
              <span v-if="registration.status === 'confirmed'" class="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
            </span>
            {{ formatStatus(registration.status) }}
          </div>
          
          <h3 class="text-3xl sm:text-4xl font-black text-white tracking-tighter leading-none group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-500 transition-all duration-500">
            {{ registration.event_title }}
          </h3>
        </div>
        
        <!-- Metadata Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-zinc-500 group-hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <div>
              <p class="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-0.5">Deployment Date</p>
              <p class="font-bold text-zinc-300 text-sm tracking-tight">{{ formatDate(registration.event_date) }}</p>
            </div>
          </div>
          
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-zinc-500 group-hover:text-white transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
            </div>
            <div>
              <p class="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-0.5">Vector Location</p>
              <p class="font-bold text-zinc-300 text-sm tracking-tight truncate max-w-[140px]">{{ registration.event_location || 'Remote Access' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ================= PHYSICAL PERFORATION ================= -->
    <div class="relative w-full md:w-0 h-0 md:h-auto flex items-center justify-center z-20">
      <!-- Desktop Perforation -->
      <div class="hidden md:block absolute -top-5 -left-4 w-8 h-8 rounded-full bg-[#050505] shadow-[inset_0_-4px_10px_rgba(0,0,0,0.5)]"></div>
      <div class="hidden md:block absolute -bottom-5 -left-4 w-8 h-8 rounded-full bg-[#050505] shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)]"></div>
      
      <!-- Mobile Perforation -->
      <div class="md:hidden absolute -left-5 -top-4 w-8 h-8 rounded-full bg-[#050505]"></div>
      <div class="md:hidden absolute -right-5 -top-4 w-8 h-8 rounded-full bg-[#050505]"></div>
      
      <!-- Dashed Tear-Line -->
      <div class="w-[90%] md:w-px h-px md:h-[80%] border-t-2 md:border-l-2 border-dashed border-white/10"></div>
    </div>

    <!-- ================= RIGHT: TRANSACTION STUB ================= -->
    <div class="w-full md:w-80 bg-white/[0.03] p-8 flex flex-col relative z-10 justify-between backdrop-blur-3xl">
      
      <!-- Premium Stub Header -->
      <div class="space-y-6">
        <div class="flex justify-between items-start">
          <div class="space-y-1">
            <p class="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em]">Access Level</p>
            <p class="font-black text-white text-xl tracking-tighter uppercase">{{ registration.ticket_name }}</p>
          </div>
          <div class="text-right">
            <p class="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em]">Authorization</p>
            <p class="font-black text-emerald-400 text-xl tracking-tighter">${{ registration.total_amount?.toFixed(2) || '0.00' }}</p>
          </div>
        </div>

        <div class="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
          <div class="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            <span>Entry Quantity:</span>
            <span class="text-white">{{ registration.quantity }} Unit(s)</span>
          </div>
        </div>
      </div>

      <!-- Logic-Driven Actions -->
      <div class="flex flex-col gap-3 mt-8">
        
        <!-- Primary QR Action -->
        <button 
          v-if="registration.status === 'confirmed'"
          @click="$emit('view-qr', registration)"
          class="w-full relative group/btn overflow-hidden rounded-2xl bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] py-4 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:scale-[1.03] active:scale-95 transition-all duration-300"
        >
          <div class="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-400 to-cyan-400 opacity-0 group-hover/btn:opacity-20 transition-opacity"></div>
          <div class="flex items-center justify-center gap-2 relative z-10">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
            Initialize QR Pass
          </div>
        </button>

        <!-- Secondary Cluster -->
        <div class="grid grid-cols-2 gap-3">
          <router-link 
            :to="`/events/${registration.event_id}`"
            class="flex items-center justify-center py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
          >
            Dossier
          </router-link>
          
          <button 
            v-if="isPastEvent && registration.status !== 'cancelled'"
            @click="$emit('review', registration)"
            class="flex items-center justify-center py-3 bg-violet-600/10 border border-violet-500/20 rounded-xl text-[9px] font-black uppercase tracking-widest text-violet-400 hover:bg-violet-600 hover:text-white transition-all"
          >
            Log Review
          </button>
          
          <button 
            v-if="canCancel"
            @click="$emit('cancel', registration)"
            class="flex items-center justify-center py-3 bg-rose-600/10 border border-rose-500/20 rounded-xl text-[9px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-600 hover:text-white transition-all col-span-2 mt-1"
          >
            Void Registration
          </button>
        </div>
      </div>

      <!-- High-Resolution Industrial Barcode -->
      <div class="mt-8 flex flex-col gap-2 opacity-30 group-hover:opacity-60 transition-opacity duration-700">
        <div class="flex gap-[2px] h-10 items-end">
          <div v-for="i in 40" :key="i" 
               :class="['bg-white w-[2px]', Math.random() > 0.5 ? 'h-full' : 'h-2/3']"></div>
        </div>
        <div class="flex justify-between items-center font-mono text-[7px] tracking-[0.4em] text-white">
          <span>{{ registration.transaction_id || 'X-GAT-9902' }}</span>
          <span>#{{ registration.id?.toString().padStart(8, '0') }}</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  registration: { type: Object, required: true }
})

defineEmits(['view-qr', 'cancel', 'review'])

const isPastEvent = computed(() => {
  return new Date(props.registration.event_date) < new Date()
})

const canCancel = computed(() => {
  return !isPastEvent.value && 
         props.registration.status !== 'cancelled' && 
         props.registration.status !== 'checked_in'
})

const formatDate = (date) => {
  if (!date) return 'TBA'
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).toUpperCase()
}

const formatStatus = (status) => {
  const labels = {
    pending: 'Handshake Pending',
    confirmed: 'Verified Pass',
    cancelled: 'Invalid / Void',
    checked_in: 'Active Session'
  }
  return labels[status] || status
}

const getStatusClass = (status) => {
  const classes = {
    confirmed: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5',
    pending: 'text-amber-400 border-amber-500/30 bg-amber-500/5',
    cancelled: 'text-rose-400 border-rose-500/30 bg-rose-500/5',
    checked_in: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/5'
  }
  return classes[status] || 'text-zinc-500 border-zinc-500/30 bg-zinc-500/5'
}
</script>

<style scoped>
/* Industrial text smoothing */
h3, p, span {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
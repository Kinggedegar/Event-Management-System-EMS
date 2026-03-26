<template>
  <div class="bg-card border border-border rounded-xl overflow-hidden">
    <div class="flex flex-col md:flex-row">
      <!-- Event Image -->
      <div class="md:w-48 h-32 md:h-auto">
        <img 
          :src="registration.event_image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&h=200&fit=crop'" 
          :alt="registration.event_title"
          class="w-full h-full object-cover"
        />
      </div>
      
      <!-- Ticket Info -->
      <div class="flex-1 p-4">
        <div class="flex items-start justify-between gap-4">
          <div>
            <span :class="getStatusClass(registration.status)" class="px-2 py-0.5 rounded-full text-xs font-medium">
              {{ formatStatus(registration.status) }}
            </span>
            <h3 class="text-lg font-semibold text-foreground mt-2">{{ registration.event_title }}</h3>
          </div>
          <div class="text-right">
            <p class="text-lg font-bold text-foreground">${{ registration.total_amount?.toFixed(2) || '0.00' }}</p>
            <p class="text-xs text-muted-foreground">{{ registration.quantity }} ticket(s)</p>
          </div>
        </div>
        
        <div class="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div>
            <p class="text-muted-foreground">Date</p>
            <p class="font-medium text-foreground">{{ formatDate(registration.event_date) }}</p>
          </div>
          <div>
            <p class="text-muted-foreground">Location</p>
            <p class="font-medium text-foreground truncate">{{ registration.event_location || 'TBA' }}</p>
          </div>
          <div>
            <p class="text-muted-foreground">Ticket Type</p>
            <p class="font-medium text-foreground">{{ registration.ticket_name }}</p>
          </div>
          <div>
            <p class="text-muted-foreground">Registered</p>
            <p class="font-medium text-foreground">{{ formatDate(registration.created_at) }}</p>
          </div>
        </div>
        
        <!-- Actions -->
        <div class="mt-4 flex flex-wrap gap-2">
          <button 
            v-if="registration.status === 'confirmed'"
            @click="$emit('view-qr', registration)"
            class="inline-flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            View QR Code
          </button>
          
          <router-link 
            :to="`/events/${registration.event_id}`"
            class="inline-flex items-center gap-2 px-3 py-1.5 border border-input rounded-lg text-sm hover:bg-muted transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Event
          </router-link>
          
          <button 
            v-if="isPastEvent && registration.status !== 'cancelled'"
            @click="$emit('review', registration)"
            class="inline-flex items-center gap-2 px-3 py-1.5 border border-input rounded-lg text-sm hover:bg-muted transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            Leave Review
          </button>
          
          <button 
            v-if="canCancel"
            @click="$emit('cancel', registration)"
            class="inline-flex items-center gap-2 px-3 py-1.5 text-red-600 border border-red-200 rounded-lg text-sm hover:bg-red-50 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  registration: {
    type: Object,
    required: true
  }
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
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatStatus = (status) => {
  const labels = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    cancelled: 'Cancelled',
    checked_in: 'Checked In'
  }
  return labels[status] || status
}

const getStatusClass = (status) => {
  const classes = {
    confirmed: 'bg-green-500/10 text-green-600',
    pending: 'bg-violet-500/10 text-violet-600',
    cancelled: 'bg-red-500/10 text-red-600',
    checked_in: 'bg-primary/10 text-primary'
  }
  return classes[status] || 'bg-muted text-muted-foreground'
}
</script>

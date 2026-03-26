<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-foreground">My Tickets</h1>
        <p class="text-muted-foreground">View and manage your event registrations</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 border-b border-border">
      <button 
        @click="activeTab = 'upcoming'"
        :class="[
          'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
          activeTab === 'upcoming' 
            ? 'border-primary text-primary' 
            : 'border-transparent text-muted-foreground hover:text-foreground'
        ]"
      >
        Upcoming ({{ upcomingRegistrations.length }})
      </button>
      <button 
        @click="activeTab = 'past'"
        :class="[
          'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
          activeTab === 'past' 
            ? 'border-primary text-primary' 
            : 'border-transparent text-muted-foreground hover:text-foreground'
        ]"
      >
        Past ({{ pastRegistrations.length }})
      </button>
      <button 
        @click="activeTab = 'cancelled'"
        :class="[
          'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
          activeTab === 'cancelled' 
            ? 'border-primary text-primary' 
            : 'border-transparent text-muted-foreground hover:text-foreground'
        ]"
      >
        Cancelled ({{ cancelledRegistrations.length }})
      </button>
    </div>

    <LoadingSpinner v-if="loading" />
    
    <div v-else-if="currentRegistrations.length === 0" class="text-center py-12">
      <svg class="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
      </svg>
      <h3 class="text-lg font-medium text-foreground mb-1">No tickets found</h3>
      <p class="text-muted-foreground mb-4">
        {{ activeTab === 'upcoming' ? "You haven't registered for any upcoming events" : "No tickets in this category" }}
      </p>
      <router-link v-if="activeTab === 'upcoming'" to="/events" 
                   class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
        Browse Events
      </router-link>
    </div>

    <div v-else class="space-y-4">
      <TicketCard 
        v-for="registration in currentRegistrations" 
        :key="registration.id"
        :registration="registration"
        @view-qr="openQRModal"
        @cancel="cancelRegistration"
        @review="openReviewModal"
      />
    </div>

    <!-- QR Code Modal -->
    <div v-if="showQRModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="showQRModal = false">
      <div class="bg-card rounded-xl p-6 max-w-sm w-full">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-foreground">Your Ticket QR Code</h3>
          <button @click="showQRModal = false" class="text-muted-foreground hover:text-foreground">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="bg-white p-4 rounded-lg flex items-center justify-center">
          <QRCode :value="selectedRegistration?.qr_code || selectedRegistration?.id" :size="200" />
        </div>
        <div class="mt-4 text-center">
          <p class="text-sm text-muted-foreground">Show this QR code at the event entrance</p>
          <p class="text-xs text-muted-foreground mt-1">Registration ID: {{ selectedRegistration?.id }}</p>
        </div>
      </div>
    </div>

    <!-- Review Modal -->
    <div v-if="showReviewModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="showReviewModal = false">
      <div class="bg-card rounded-xl p-6 max-w-md w-full">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-foreground">Leave a Review</h3>
          <button @click="showReviewModal = false" class="text-muted-foreground hover:text-foreground">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form @submit.prevent="submitReview" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">Rating</label>
            <div class="flex gap-1">
              <button 
                v-for="star in 5" 
                :key="star"
                type="button"
                @click="reviewForm.rating = star"
                class="text-2xl focus:outline-none"
              >
                <svg 
                  :class="star <= reviewForm.rating ? 'text-violet-400' : 'text-muted-foreground/30'"
                  class="w-8 h-8" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </button>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">Your Review</label>
            <textarea 
              v-model="reviewForm.comment"
              rows="4"
              class="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Share your experience..."
            ></textarea>
          </div>
          <div class="flex gap-3">
            <button type="button" @click="showReviewModal = false" 
                    class="flex-1 px-4 py-2 border border-input rounded-lg hover:bg-muted transition-colors">
              Cancel
            </button>
            <button type="submit" :disabled="submittingReview"
                    class="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
              {{ submittingReview ? 'Submitting...' : 'Submit Review' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRegistrationsStore } from '@/stores/registrations'
import api from '@/services/api'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import TicketCard from '@/components/TicketCard.vue'
import QRCode from '@/components/QRCode.vue'

const registrationsStore = useRegistrationsStore()

const loading = ref(true)
const activeTab = ref('upcoming')
const showQRModal = ref(false)
const showReviewModal = ref(false)
const selectedRegistration = ref(null)
const submittingReview = ref(false)

const reviewForm = ref({
  rating: 5,
  comment: ''
})

const upcomingRegistrations = computed(() => registrationsStore.upcomingRegistrations)
const pastRegistrations = computed(() => registrationsStore.pastRegistrations)
const cancelledRegistrations = computed(() => 
  registrationsStore.registrations.filter(r => r.status === 'cancelled')
)

const currentRegistrations = computed(() => {
  switch (activeTab.value) {
    case 'upcoming': return upcomingRegistrations.value
    case 'past': return pastRegistrations.value
    case 'cancelled': return cancelledRegistrations.value
    default: return []
  }
})

const openQRModal = (registration) => {
  selectedRegistration.value = registration
  showQRModal.value = true
}

const openReviewModal = (registration) => {
  selectedRegistration.value = registration
  reviewForm.value = { rating: 5, comment: '' }
  showReviewModal.value = true
}

const cancelRegistration = async (registration) => {
  if (!confirm('Are you sure you want to cancel this registration?')) return
  
  try {
    await registrationsStore.cancelRegistration(registration.id)
  } catch (error) {
    alert(error.message || 'Failed to cancel registration')
  }
}

const submitReview = async () => {
  if (!reviewForm.value.rating) {
    alert('Please select a rating')
    return
  }
  
  submittingReview.value = true
  try {
    await api.post('/reviews', {
      event_id: selectedRegistration.value.event_id,
      rating: reviewForm.value.rating,
      comment: reviewForm.value.comment
    })
    showReviewModal.value = false
    alert('Review submitted successfully!')
  } catch (error) {
    alert(error.response?.data?.error || 'Failed to submit review')
  } finally {
    submittingReview.value = false
  }
}

onMounted(async () => {
  try {
    await registrationsStore.fetchMyRegistrations()
  } finally {
    loading.value = false
  }
})
</script>

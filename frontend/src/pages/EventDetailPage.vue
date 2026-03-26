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
    error.value = 'Event not found'
  } finally {
    loading.value = false
  }
})

const formattedDate = computed(() => {
  if (!event.value?.date) return ''
  try {
    return format(new Date(event.value.date), 'EEEE, MMMM d, yyyy')
  } catch {
    return event.value.date
  }
})

const formattedEndDate = computed(() => {
  if (!event.value?.end_date) return ''
  try {
    return format(new Date(event.value.end_date), 'EEEE, MMMM d, yyyy')
  } catch {
    return event.value.end_date
  }
})

const isMultiDay = computed(() => {
  return event.value?.end_date && event.value.end_date !== event.value.date
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
}

async function handleRegister() {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }
  
  if (!selectedTicket.value) {
    error.value = 'Please select a ticket type'
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
    
    // Refresh event to update registration status
    await eventsStore.fetchEvent(route.params.id)
  } catch (err) {
    error.value = err.response?.data?.error?.message || 'Registration failed'
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
    error.value = err.response?.data?.error?.message || 'Payment failed'
  } finally {
    registering.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div v-if="loading" class="flex items-center justify-center py-32">
      <LoadingSpinner size="lg" />
    </div>
    
    <div v-else-if="error && !event" class="container-custom py-16 text-center">
      <h1 class="text-2xl font-bold text-gray-900 mb-4">{{ error }}</h1>
      <RouterLink to="/events" class="btn btn-primary">Browse Events</RouterLink>
    </div>
    
    <template v-else-if="event">
      <!-- Hero -->
      <div class="relative h-64 md:h-96 bg-gray-900">
        <img 
          v-if="event.image"
          :src="event.image" 
          :alt="event.title"
          class="w-full h-full object-cover opacity-60"
        >
        <div 
          v-else 
          class="w-full h-full bg-gradient-to-br from-primary-600 to-primary-800"
        ></div>
        <div class="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
      </div>
      
      <div class="container-custom -mt-32 relative z-10 pb-16">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Main Content -->
          <div class="lg:col-span-2">
            <div class="card p-6 md:p-8">
              <!-- Category & Status -->
              <div class="flex items-center gap-3 mb-4">
                <span 
                  v-if="event.category_name"
                  class="badge text-white"
                  :style="{ backgroundColor: event.category_color || '#3b82f6' }"
                >
                  {{ event.category_name }}
                </span>
                <span v-if="event.featured" class="badge badge-warning">Featured</span>
              </div>
              
              <!-- Title -->
              <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {{ event.title }}
              </h1>
              
              <!-- Date & Time -->
              <div class="flex items-start gap-3 mb-4">
                <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ formattedDate }}</p>
                  <p v-if="isMultiDay" class="text-gray-600">to {{ formattedEndDate }}</p>
                  <p class="text-gray-600">
                    {{ event.time }}
                    <span v-if="event.end_time"> - {{ event.end_time }}</span>
                  </p>
                </div>
              </div>
              
              <!-- Location -->
              <div class="flex items-start gap-3 mb-6">
                <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ event.location }}</p>
                  <p v-if="event.address" class="text-gray-600">{{ event.address }}</p>
                  <p v-if="event.city" class="text-gray-600">{{ event.city }}</p>
                </div>
              </div>
              
              <!-- Description -->
              <div class="border-t border-gray-200 pt-6">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">About This Event</h2>
                <div class="prose prose-gray max-w-none">
                  <p class="whitespace-pre-wrap text-gray-600 leading-relaxed">{{ event.description }}</p>
                </div>
              </div>
              
              <!-- Organizer -->
              <div class="border-t border-gray-200 pt-6 mt-6">
                <h2 class="text-lg font-semibold text-gray-900 mb-4">Organizer</h2>
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span class="text-primary-700 font-semibold">
                      {{ event.organizer_name?.[0]?.toUpperCase() || 'O' }}
                    </span>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ event.organizer_name }}</p>
                    <p v-if="event.organizer_bio" class="text-sm text-gray-500 line-clamp-1">{{ event.organizer_bio }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Sidebar -->
          <div class="lg:col-span-1">
            <div class="card p-6 sticky top-24">
              <!-- Already registered -->
              <div v-if="isRegistered" class="text-center">
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">You're Registered!</h3>
                <p class="text-gray-600 mb-4">{{ event.userRegistration.ticket_name }}</p>
                <RouterLink to="/dashboard/tickets" class="btn btn-primary w-full">
                  View Your Tickets
                </RouterLink>
              </div>
              
              <!-- Registration form -->
              <template v-else>
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Select Tickets</h3>
                
                <div v-if="availableTickets.length === 0" class="text-center py-4">
                  <p class="text-gray-500">No tickets available</p>
                </div>
                
                <div v-else class="space-y-3 mb-6">
                  <button
                    v-for="ticket in availableTickets"
                    :key="ticket.id"
                    @click="selectTicket(ticket)"
                    :class="[
                      'w-full p-4 border-2 rounded-lg text-left transition-colors',
                      selectedTicket?.id === ticket.id 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-gray-200 hover:border-primary-300'
                    ]"
                  >
                    <div class="flex justify-between items-start">
                      <div>
                        <p class="font-medium text-gray-900">{{ ticket.name }}</p>
                        <p class="text-sm text-gray-500">{{ ticket.available }} available</p>
                      </div>
                      <p class="font-bold text-gray-900">
                        {{ ticket.price === 0 ? 'Free' : `$${ticket.price}` }}
                      </p>
                    </div>
                  </button>
                </div>
                
                <!-- Quantity -->
                <div v-if="selectedTicket" class="mb-6">
                  <label class="label">Quantity</label>
                  <div class="flex items-center gap-3">
                    <button 
                      @click="quantity = Math.max(1, quantity - 1)"
                      class="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                      </svg>
                    </button>
                    <span class="text-xl font-semibold w-12 text-center">{{ quantity }}</span>
                    <button 
                      @click="quantity = Math.min(selectedTicket.max_per_order || 10, selectedTicket.available, quantity + 1)"
                      class="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <!-- Total -->
                <div v-if="selectedTicket" class="flex justify-between items-center py-4 border-t border-gray-200 mb-6">
                  <span class="text-gray-600">Total</span>
                  <span class="text-2xl font-bold text-gray-900">
                    {{ selectedTicket.price === 0 ? 'Free' : `$${(selectedTicket.price * quantity).toFixed(2)}` }}
                  </span>
                </div>
                
                <!-- Error message -->
                <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {{ error }}
                </div>
                
                <!-- Register button -->
                <button 
                  @click="handleRegister"
                  :disabled="registering || !selectedTicket"
                  class="btn btn-primary w-full btn-lg"
                >
                  <LoadingSpinner v-if="registering" size="sm" color="white" class="mr-2" />
                  {{ authStore.isAuthenticated ? 'Register Now' : 'Sign in to Register' }}
                </button>
              </template>
              
              <!-- Event stats -->
              <div class="mt-6 pt-6 border-t border-gray-200">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-500">Attendees</span>
                  <span class="font-medium text-gray-900">{{ event.registration_count || 0 }}</span>
                </div>
                <div v-if="event.average_rating" class="flex items-center justify-between text-sm mt-2">
                  <span class="text-gray-500">Rating</span>
                  <span class="font-medium text-gray-900 flex items-center gap-1">
                    <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
                    </svg>
                    {{ event.average_rating.toFixed(1) }} ({{ event.review_count }})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    
    <!-- Registration Success Modal -->
    <div v-if="showRegistrationModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/50" @click="showRegistrationModal = false"></div>
      <div class="relative bg-white rounded-2xl p-6 max-w-md w-full">
        <div class="text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Registration Successful!</h3>
          <p class="text-gray-600 mb-6">
            {{ registrationSuccess?.total_amount > 0 
              ? 'Please complete your payment to confirm your registration.' 
              : 'Your registration has been confirmed.' 
            }}
          </p>
          
          <div v-if="registrationSuccess?.total_amount > 0" class="mb-6">
            <p class="text-2xl font-bold text-gray-900">${{ registrationSuccess.total_amount.toFixed(2) }}</p>
            <button @click="processPayment" :disabled="registering" class="btn btn-primary w-full mt-4">
              <LoadingSpinner v-if="registering" size="sm" color="white" class="mr-2" />
              Complete Payment
            </button>
          </div>
          
          <RouterLink 
            v-else 
            to="/dashboard/tickets" 
            class="btn btn-primary w-full"
          >
            View My Tickets
          </RouterLink>
          
          <button @click="showRegistrationModal = false" class="btn btn-ghost w-full mt-2">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

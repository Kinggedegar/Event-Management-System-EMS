import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

export const useRegistrationsStore = defineStore('registrations', () => {
  const registrations = ref([])
  const currentRegistration = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function fetchMyRegistrations() {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get('/registrations/my')
      registrations.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Failed to fetch registrations'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchRegistration(id) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get(`/registrations/${id}`)
      currentRegistration.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Failed to fetch registration'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function registerForEvent(eventId, ticketId, quantity = 1) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/registrations', {
        event_id: eventId,
        ticket_id: ticketId,
        quantity
      })
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Failed to register for event'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function cancelRegistration(id) {
    loading.value = true
    error.value = null
    
    try {
      await api.put(`/registrations/${id}/cancel`)
      registrations.value = registrations.value.map(r => 
        r.id === id ? { ...r, status: 'cancelled' } : r
      )
      return true
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Failed to cancel registration'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function checkinByQR(qrCode, eventId = null) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/registrations/checkin-qr', {
        qr_code: qrCode,
        event_id: eventId
      })
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Check-in failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function processPayment(registrationId, method = 'card', paymentDetails = null) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/payments/process', {
        registration_id: registrationId,
        method,
        payment_details: paymentDetails
      })
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Payment failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Computed properties
  const upcomingRegistrations = computed(() => {
    const now = new Date()
    return registrations.value.filter(reg => {
      const eventDate = new Date(reg.event_date)
      return eventDate > now && reg.status !== 'cancelled'
    })
  })

  const pastRegistrations = computed(() => {
    const now = new Date()
    return registrations.value.filter(reg => {
      const eventDate = new Date(reg.event_date)
      return eventDate <= now && reg.status !== 'cancelled'
    })
  })

  return {
    registrations,
    currentRegistration,
    loading,
    error,
    upcomingRegistrations,
    pastRegistrations,
    fetchMyRegistrations,
    fetchRegistration,
    registerForEvent,
    cancelRegistration,
    checkinByQR,
    processPayment
  }
})

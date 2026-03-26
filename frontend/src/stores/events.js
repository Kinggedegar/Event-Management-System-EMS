import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'

export const useEventsStore = defineStore('events', () => {
  const events = ref([])
  const currentEvent = ref(null)
  const featuredEvents = ref([])
  const upcomingEvents = ref([])
  const categories = ref([])
  const pagination = ref({ page: 1, limit: 12, total: 0, pages: 0 })
  const loading = ref(false)
  const error = ref(null)

  async function fetchEvents(params = {}) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get('/events', { params })
      events.value = response.data.events
      pagination.value = response.data.pagination
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Failed to fetch events'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchFeaturedEvents() {
    try {
      const response = await api.get('/events/featured')
      featuredEvents.value = response.data
      return response.data
    } catch (err) {
      console.error('Failed to fetch featured events:', err)
      return []
    }
  }

  async function fetchUpcomingEvents(limit = 8) {
    try {
      const response = await api.get('/events/upcoming', { params: { limit } })
      upcomingEvents.value = response.data
      return response.data
    } catch (err) {
      console.error('Failed to fetch upcoming events:', err)
      return []
    }
  }

  async function fetchEvent(id) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get(`/events/${id}`)
      currentEvent.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Failed to fetch event'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createEvent(data) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post('/events', data)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Failed to create event'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateEvent(id, data) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.put(`/events/${id}`, data)
      if (currentEvent.value?.id === id) {
        currentEvent.value = { ...currentEvent.value, ...response.data }
      }
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Failed to update event'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteEvent(id) {
    loading.value = true
    error.value = null
    
    try {
      await api.delete(`/events/${id}`)
      events.value = events.value.filter(e => e.id !== id)
      if (currentEvent.value?.id === id) {
        currentEvent.value = null
      }
      return true
    } catch (err) {
      error.value = err.response?.data?.error?.message || 'Failed to delete event'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchEventAttendees(eventId) {
    try {
      const response = await api.get(`/events/${eventId}/attendees`)
      return response.data
    } catch (err) {
      throw err
    }
  }

  async function fetchCategories() {
    try {
      const response = await api.get('/categories')
      categories.value = response.data.categories || []
      return response.data.categories || []
    } catch (err) {
      console.error('Failed to fetch categories:', err)
      return []
    }
  }

  async function createCategory(payload) {
    try {
      const response = await api.post('/categories', payload)
      // append the new category to list
      categories.value = [response.data.category, ...categories.value]
      return response.data.category
    } catch (err) {
      console.error('Failed to create category:', err)
      throw err
    }
  }

  return {
    events,
    currentEvent,
    featuredEvents,
    upcomingEvents,
    categories,
    pagination,
    loading,
    error,
    fetchEvents,
    fetchFeaturedEvents,
    fetchUpcomingEvents,
    fetchEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    fetchEventAttendees,
    fetchCategories
  }
})

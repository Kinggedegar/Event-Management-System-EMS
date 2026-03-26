<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <div class="flex items-center gap-2">
      <router-link to="/organizer/events" class="text-muted-foreground hover:text-foreground">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </router-link>
      <h1 class="text-2xl font-bold text-foreground">Edit Event</h1>
    </div>

    <LoadingSpinner v-if="loading" />

    <form v-else @submit.prevent="submitForm" class="space-y-6">
      <!-- Basic Info -->
      <div class="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 class="text-lg font-semibold text-foreground">Basic Information</h2>
        
        <div>
          <label class="block text-sm font-medium text-foreground mb-1">Event Title *</label>
          <input 
            v-model="form.title"
            type="text"
            required
            class="w-full px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-foreground mb-1">Description *</label>
          <textarea 
            v-model="form.description"
            rows="4"
            required
            class="w-full px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          ></textarea>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-foreground mb-1">Category *</label>
            <select 
              v-model="form.category_id"
              required
              class="w-full px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select category</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-foreground mb-1">Image URL</label>
            <input 
              v-model="form.image_url"
              type="url"
              class="w-full px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      <!-- Date & Location -->
      <div class="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 class="text-lg font-semibold text-foreground">Date & Location</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-foreground mb-1">Event Date *</label>
            <input 
              v-model="form.event_date"
              type="datetime-local"
              required
              class="w-full px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-foreground mb-1">End Date</label>
            <input 
              v-model="form.end_date"
              type="datetime-local"
              class="w-full px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-foreground mb-1">Location *</label>
          <input 
            v-model="form.location"
            type="text"
            required
            class="w-full px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-foreground mb-1">Capacity</label>
          <input 
            v-model="form.capacity"
            type="number"
            min="1"
            class="w-full px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <!-- Status -->
      <div class="bg-card border border-border rounded-xl p-6">
        <h2 class="text-lg font-semibold text-foreground mb-4">Event Status</h2>
        <div class="flex gap-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" v-model="form.status" value="draft" class="text-primary focus:ring-primary" />
            <span class="text-foreground">Draft</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" v-model="form.status" value="published" class="text-primary focus:ring-primary" />
            <span class="text-foreground">Published</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input type="radio" v-model="form.status" value="cancelled" class="text-primary focus:ring-primary" />
            <span class="text-foreground">Cancelled</span>
          </label>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-4">
        <button type="button" @click="$router.back()" 
                class="flex-1 px-4 py-2 border border-input rounded-lg hover:bg-muted transition-colors">
          Cancel
        </button>
        <button type="submit" :disabled="submitting"
                class="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
          {{ submitting ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const submitting = ref(false)
const categories = ref([])

const form = ref({
  title: '',
  description: '',
  category_id: '',
  image_url: '',
  event_date: '',
  end_date: '',
  location: '',
  capacity: '',
  status: 'draft'
})

const formatDateForInput = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toISOString().slice(0, 16)
}

const submitForm = async () => {
  submitting.value = true
  try {
    await api.put(`/events/${route.params.id}`, {
      ...form.value,
      capacity: form.value.capacity || null
    })
    router.push(`/organizer/events/${route.params.id}`)
  } catch (error) {
    alert(error.response?.data?.error || 'Failed to update event')
  } finally {
    submitting.value = false
  }
}

const fetchData = async () => {
  try {
    const [eventRes, catsRes] = await Promise.all([
      api.get(`/events/${route.params.id}`),
      api.get('/categories')
    ])
    
    const event = eventRes.data.event
    form.value = {
      title: event.title,
      description: event.description,
      category_id: event.category_id,
      image_url: event.image_url || '',
      event_date: formatDateForInput(event.event_date),
      end_date: formatDateForInput(event.end_date),
      location: event.location,
      capacity: event.capacity || '',
      status: event.status
    }
    
    categories.value = catsRes.data.categories || []
  } catch (error) {
    console.error('Failed to fetch event:', error)
    alert('Failed to load event data')
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>

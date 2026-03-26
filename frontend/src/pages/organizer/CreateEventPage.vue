<template>
  <div class="space-y-6">
    <div class="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-6 shadow-sm">
      <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-2xl font-bold">Create a New Event</h1>
          <p class="text-white/80">Set up your event details, tickets, and publishing options.</p>
        </div>
        <div class="flex flex-wrap gap-2 text-xs">
          <span class="rounded-full bg-white/15 px-3 py-1">Step 1: Details</span>
          <span class="rounded-full bg-white/10 px-3 py-1">Step 2: Tickets</span>
          <span class="rounded-full bg-white/10 px-3 py-1">Step 3: Publish</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <form @submit.prevent="submitForm" class="lg:col-span-8 space-y-6">
        <!-- Basic Info -->
        <div class="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-foreground">Basic Information</h2>
              <p class="text-sm text-muted-foreground">Give your event a clear title and description.</p>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground mb-1">Event Title *</label>
            <input
              v-model="form.title"
              type="text"
              required
              class="w-full px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
              placeholder="Enter event title"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground mb-1">Description *</label>
            <textarea
              v-model="form.description"
              rows="4"
              required
              class="w-full px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
              placeholder="Describe your event..."
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-foreground mb-1">Category *</label>
              <select
                v-model="form.category_id"
                required
                class="w-full px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
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
                class="w-full px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        </div>

        <!-- Date & Location -->
        <div class="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
          <div>
            <h2 class="text-lg font-semibold text-foreground">Date and Location</h2>
            <p class="text-sm text-muted-foreground">Help attendees plan by sharing the exact time and place.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-foreground mb-1">Event Date *</label>
              <input
                v-model="form.event_date"
                type="datetime-local"
                required
                class="w-full px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground mb-1">End Date</label>
              <input
                v-model="form.end_date"
                type="datetime-local"
                class="w-full px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground mb-1">Location *</label>
            <input
              v-model="form.location"
              type="text"
              required
                class="w-full px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
              placeholder="Event venue or address"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground mb-1">Capacity</label>
            <input
              v-model="form.capacity"
              type="number"
              min="1"
                class="w-full px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
              placeholder="Maximum number of attendees"
            />
          </div>
        </div>

        <!-- Tickets -->
        <div class="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-foreground">Tickets</h2>
              <p class="text-sm text-muted-foreground">Create one or more ticket tiers.</p>
            </div>
            <button type="button" @click="addTicket" class="text-sm text-violet-400 hover:text-violet-300">
              + Add Ticket Type
            </button>
          </div>

          <div v-for="(ticket, index) in form.tickets" :key="index" class="p-4 bg-muted/50 rounded-lg space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="font-medium text-foreground">Ticket #{{ index + 1 }}</h3>
              <button v-if="form.tickets.length > 1" type="button" @click="removeTicket(index)"
                      class="text-red-600 hover:text-red-700 text-sm">
                Remove
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label class="block text-sm font-medium text-foreground mb-1">Name *</label>
                <input
                  v-model="ticket.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
                  placeholder="General Admission"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-foreground mb-1">Price *</label>
                <input
                  v-model="ticket.price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  class="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-foreground mb-1">Quantity *</label>
                <input
                  v-model="ticket.quantity"
                  type="number"
                  min="1"
                  required
                  class="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
                  placeholder="100"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-foreground mb-1">Description</label>
              <input
                v-model="ticket.description"
                type="text"
                class="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-300"
                placeholder="What is included with this ticket?"
              />
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-wrap gap-4">
          <button type="button" @click="$router.back()"
                  class="px-4 py-2 border border-input rounded-lg hover:bg-muted transition-colors">
            Cancel
          </button>
            <button type="submit" :disabled="submitting"
              class="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors disabled:opacity-50"
              @click="form.status = 'draft'">
            {{ submitting ? 'Saving...' : 'Save as Draft' }}
          </button>
            <button type="submit" :disabled="submitting"
              class="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg hover:from-violet-500 hover:to-indigo-500 transition-colors disabled:opacity-50"
              @click="form.status = 'published'">
              {{ submitting ? 'Publishing...' : 'Publish Event' }}
            </button>
        </div>
      </form>

      <aside class="lg:col-span-4 space-y-6">
        <div class="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <h3 class="text-lg font-semibold text-foreground">Live Preview</h3>
          <div class="mt-4 overflow-hidden rounded-xl border border-border">
            <img
              :src="form.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=450&fit=crop'"
              alt="Event preview"
              class="h-40 w-full object-cover"
            />
          </div>
          <div class="mt-4 space-y-2">
            <h4 class="text-base font-semibold text-foreground">{{ form.title || 'Your Event Title' }}</h4>
            <p class="text-sm text-muted-foreground line-clamp-2">
              {{ form.description || 'A short description of your event will appear here.' }}
            </p>
            <div class="text-sm text-muted-foreground">
              <span>{{ form.event_date ? new Date(form.event_date).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Date not set' }}</span>
              <span v-if="form.location"> · {{ form.location }}</span>
            </div>
            <div class="text-sm font-medium text-foreground">
              <span v-if="form.tickets.length && form.tickets[0].price !== ''">
                From ${{ Number(form.tickets[0].price || 0).toFixed(2) }}
              </span>
              <span v-else>Pricing not set</span>
            </div>
          </div>
        </div>

        <div class="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <h3 class="text-lg font-semibold text-foreground">Publish Checklist</h3>
          <ul class="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Title and description are complete.</li>
            <li>Date, time, and location are correct.</li>
            <li>Tickets include price and quantity.</li>
            <li>Event image is optional but recommended.</li>
          </ul>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()

const categories = ref([])
const submitting = ref(false)

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
    { name: '', price: 0, quantity: 100, description: '' }
  ]
})

const addTicket = () => {
  form.value.tickets.push({ name: '', price: 0, quantity: 100, description: '' })
}

const removeTicket = (index) => {
  form.value.tickets.splice(index, 1)
}

const submitForm = async () => {
  submitting.value = true
  try {
    const { data } = await api.post('/events', {
      ...form.value,
      capacity: form.value.capacity || null
    })

    router.push(`/organizer/events/${data.event.id}`)
  } catch (error) {
    alert(error.response?.data?.error || 'Failed to create event')
  } finally {
    submitting.value = false
  }
}

const fetchCategories = async () => {
  try {
    const { data } = await api.get('/categories')
    categories.value = data.categories || []
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
}

onMounted(fetchCategories)
</script>

<script setup>
import { RouterLink } from 'vue-router'
import { computed } from 'vue'
import { format } from 'date-fns'

const props = defineProps({
  event: {
    type: Object,
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  }
})

const formattedDate = computed(() => {
  try {
    return format(new Date(props.event.date), 'EEE, MMM d, yyyy')
  } catch {
    return props.event.date
  }
})

const lowestPrice = computed(() => {
  if (!props.event.tickets || props.event.tickets.length === 0) return null
  const prices = props.event.tickets.map(t => t.price).filter(p => p !== undefined)
  if (prices.length === 0) return null
  const min = Math.min(...prices)
  return min === 0 ? 'Free' : `$${min}`
})
</script>

<template>
  <RouterLink 
    :to="`/events/${event.id}`"
    :class="[
      'card-hover group block',
      featured ? 'md:flex' : ''
    ]"
  >
    <!-- Image -->
    <div 
      :class="[
        'relative overflow-hidden bg-gray-200',
        featured ? 'md:w-2/5 h-48 md:h-auto' : 'h-48'
      ]"
    >
      <img 
        v-if="event.image"
        :src="event.image" 
        :alt="event.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      >
      <div 
        v-else 
        class="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200"
      >
        <svg class="w-12 h-12 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      
      <!-- Category badge -->
      <div 
        v-if="event.category_name"
        class="absolute top-3 left-3"
      >
        <span 
          class="badge text-white text-xs"
          :style="{ backgroundColor: event.category_color || '#3b82f6' }"
        >
          {{ event.category_name }}
        </span>
      </div>
      
      <!-- Featured badge -->
      <div v-if="event.featured" class="absolute top-3 right-3">
        <span class="badge bg-yellow-500 text-white">
          <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
          </svg>
          Featured
        </span>
      </div>
    </div>
    
    <!-- Content -->
    <div :class="['p-5', featured ? 'md:w-3/5 md:flex md:flex-col md:justify-center' : '']">
      <!-- Date & Time -->
      <div class="flex items-center gap-2 text-sm text-primary-600 font-medium mb-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {{ formattedDate }}
        <span v-if="event.time" class="text-gray-400">|</span>
        <span v-if="event.time" class="text-gray-600">{{ event.time }}</span>
      </div>
      
      <!-- Title -->
      <h3 :class="[
        'font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2',
        featured ? 'text-xl md:text-2xl mb-3' : 'text-lg mb-2'
      ]">
        {{ event.title }}
      </h3>
      
      <!-- Description (featured only) -->
      <p v-if="featured && event.short_description" class="text-gray-600 line-clamp-2 mb-4">
        {{ event.short_description }}
      </p>
      
      <!-- Location -->
      <div class="flex items-center gap-2 text-sm text-gray-500 mb-3">
        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span class="truncate">{{ event.location }}</span>
      </div>
      
      <!-- Footer -->
      <div class="flex items-center justify-between pt-3 border-t border-gray-100">
        <div v-if="lowestPrice" class="text-lg font-bold text-gray-900">
          <span v-if="lowestPrice !== 'Free'" class="text-sm text-gray-500 font-normal">from </span>
          {{ lowestPrice }}
        </div>
        <div v-else class="text-sm text-gray-500">
          <span v-if="event.registration_count !== undefined">
            {{ event.registration_count }} attending
          </span>
        </div>
        <div class="flex items-center text-primary-600 text-sm font-medium">
          View Details
          <svg class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  </RouterLink>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import LoadingSpinner from '../../components/LoadingSpinner.vue'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const role = ref('attendee')
const organizationName = ref('')
const organizationWebsite = ref('')
const organizationPhone = ref('')
const organizationDescription = ref('')
const error = ref('')
const loading = ref(false)

async function handleSubmit() {
  if (!name.value || !email.value || !password.value) {
    error.value = 'Please fill in all fields'
    return
  }
  
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }
  
  if (password.value.length < 8) {
    error.value = 'Password must be at least 8 characters'
    return
  }

  const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  if (!strongPassword.test(password.value)) {
    error.value = 'Password must include upper, lower, number, and special character'
    return
  }
  
  if (role.value === 'organizer' && !organizationName.value.trim()) {
    error.value = 'Organization name is required for organizers'
    return
  }

  loading.value = true
  error.value = ''
  
  try {
    const payload = {
      name: name.value,
      email: email.value,
      password: password.value,
      role: role.value
    }

    if (role.value === 'organizer') {
      payload.organizationName = organizationName.value.trim()
      payload.organizationWebsite = organizationWebsite.value.trim() || undefined
      payload.organizationPhone = organizationPhone.value.trim() || undefined
      payload.organizationDescription = organizationDescription.value.trim() || undefined
    }

    const result = await authStore.register(payload)
    
    // Redirect based on role
    const redirectPath = {
      organizer: '/organizer',
      attendee: '/dashboard'
    }
    router.push(redirectPath[result.user.role] || '/dashboard')
  } catch (err) {
    error.value = authStore.error || 'Registration failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900 text-center mb-8">
      Create Your Account
    </h2>
    
    <form @submit.prevent="handleSubmit" class="space-y-5">
      <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
        {{ error }}
      </div>
      
      <div>
        <label for="name" class="label">Full Name</label>
        <input
          id="name"
          v-model="name"
          type="text"
          autocomplete="name"
          required
          class="input"
          placeholder="John Doe"
        >
      </div>
      
      <div>
        <label for="email" class="label">Email Address</label>
        <input
          id="email"
          v-model="email"
          type="email"
          autocomplete="email"
          required
          class="input"
          placeholder="you@example.com"
        >
      </div>
      
      <div>
        <label for="password" class="label">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          autocomplete="new-password"
          required
          class="input"
          placeholder="At least 8 characters"
        >
      </div>
      
      <div>
        <label for="confirmPassword" class="label">Confirm Password</label>
        <input
          id="confirmPassword"
          v-model="confirmPassword"
          type="password"
          autocomplete="new-password"
          required
          class="input"
          placeholder="Confirm your password"
        >
      </div>
      
      <div>
        <label class="label">Account Type</label>
        <div class="grid grid-cols-2 gap-3">
          <button
            type="button"
            @click="role = 'attendee'"
            :class="[
              'p-3 border-2 rounded-lg text-sm font-medium transition-colors',
              role === 'attendee' 
                ? 'border-primary-500 bg-primary-50 text-primary-700' 
                : 'border-gray-200 text-gray-600 hover:border-primary-300'
            ]"
          >
            <svg class="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Attendee
          </button>
          <button
            type="button"
            @click="role = 'organizer'"
            :class="[
              'p-3 border-2 rounded-lg text-sm font-medium transition-colors',
              role === 'organizer' 
                ? 'border-primary-500 bg-primary-50 text-primary-700' 
                : 'border-gray-200 text-gray-600 hover:border-primary-300'
            ]"
          >
            <svg class="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Organizer
          </button>
        </div>
        <p class="text-xs text-gray-500 mt-2">
          {{ role === 'organizer' ? 'Create and manage your own events' : 'Discover and attend events' }}
        </p>
      </div>

      <div
        v-if="role === 'organizer'"
        class="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4"
      >
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold text-gray-900">Organization Information</h3>
          <span class="text-xs text-gray-500">Required</span>
        </div>

        <div>
          <label for="organizationName" class="label">Organization Name</label>
          <input
            id="organizationName"
            v-model="organizationName"
            type="text"
            autocomplete="organization"
            required
            class="input"
            placeholder="Your organization name"
          >
        </div>

        <div>
          <label for="organizationWebsite" class="label">Organization Website</label>
          <input
            id="organizationWebsite"
            v-model="organizationWebsite"
            type="url"
            autocomplete="url"
            class="input"
            placeholder="https://example.org"
          >
        </div>

        <div>
          <label for="organizationPhone" class="label">Organization Phone</label>
          <input
            id="organizationPhone"
            v-model="organizationPhone"
            type="tel"
            autocomplete="tel"
            class="input"
            placeholder="+231 88 000 0000"
          >
        </div>

        <div>
          <label for="organizationDescription" class="label">Organization Description</label>
          <textarea
            id="organizationDescription"
            v-model="organizationDescription"
            rows="3"
            class="input"
            placeholder="Briefly describe your organization"
          ></textarea>
        </div>
      </div>
      
      <button type="submit" :disabled="loading" class="btn btn-primary w-full btn-lg">
        <LoadingSpinner v-if="loading" size="sm" color="white" class="mr-2" />
        Create Account
      </button>
    </form>
    
    <p class="mt-6 text-center text-sm text-gray-600">
      Already have an account?
      <RouterLink to="/auth/login" class="text-primary-600 hover:text-primary-700 font-medium">
        Sign in
      </RouterLink>
    </p>
  </div>
</template>

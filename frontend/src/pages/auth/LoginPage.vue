<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import LoadingSpinner from '../../components/LoadingSpinner.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleSubmit() {
  if (!email.value || !password.value) {
    error.value = 'Please fill in all fields'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    const result = await authStore.login(email.value, password.value)
    
    // Redirect based on role or query param
    const redirect = route.query.redirect
    if (redirect) {
      router.push(redirect)
    } else {
      const redirectPath = {
        admin: '/admin',
        organizer: '/organizer',
        attendee: '/dashboard'
      }
      router.push(redirectPath[result.user.role] || '/dashboard')
    }
  } catch (err) {
    error.value = authStore.error || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900 text-center mb-8">
      Welcome Back
    </h2>
    
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
        {{ error }}
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
          autocomplete="current-password"
          required
          class="input"
          placeholder="Enter your password"
        >
      </div>
      
      <button type="submit" :disabled="loading" class="btn btn-primary w-full btn-lg">
        <LoadingSpinner v-if="loading" size="sm" color="white" class="mr-2" />
        Sign In
      </button>
    </form>
    
    <p class="mt-6 text-center text-sm text-gray-600">
      Don't have an account?
      <RouterLink to="/auth/register" class="text-primary-600 hover:text-primary-700 font-medium">
        Sign up
      </RouterLink>
    </p>
    
    <!-- Demo accounts -->
    <div class="mt-8 pt-6 border-t border-gray-200">
      <p class="text-xs text-gray-500 text-center mb-3">Demo Accounts</p>
      <div class="space-y-2 text-xs text-gray-600">
        <div class="flex justify-between p-2 bg-gray-50 rounded">
          <span>Admin:</span>
          <span class="font-mono">admin@eventhub.com / admin123</span>
        </div>
        <div class="flex justify-between p-2 bg-gray-50 rounded">
          <span>Organizer:</span>
          <span class="font-mono">organizer@eventhub.com / organizer123</span>
        </div>
        <div class="flex justify-between p-2 bg-gray-50 rounded">
          <span>Attendee:</span>
          <span class="font-mono">attendee@eventhub.com / attendee123</span>
        </div>
      </div>
    </div>
  </div>
</template>

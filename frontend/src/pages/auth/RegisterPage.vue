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
const showPassword = ref(false)
const showConfirm = ref(false)

// live password strength
const strengthScore = ref(0)
const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong']
const strengthColor = ['', 'bg-red-500', 'bg-amber-500', 'bg-yellow-400', 'bg-emerald-500']
const strengthText  = ['', 'text-red-400', 'text-amber-400', 'text-yellow-400', 'text-emerald-400']

function calcStrength(p) {
  let s = 0
  if (p.length >= 8) s++
  if (/[A-Z]/.test(p)) s++
  if (/[0-9]/.test(p)) s++
  if (/[^A-Za-z0-9]/.test(p)) s++
  strengthScore.value = s
}

async function handleSubmit() {
  error.value = ''

  if (!name.value.trim() || !email.value.trim() || !password.value) {
    error.value = 'Please fill in all required fields'
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
    error.value = 'Password must include uppercase, lowercase, number, and special character (e.g. Test@1234)'
    return
  }

  if (role.value === 'organizer' && !organizationName.value.trim()) {
    error.value = 'Organization name is required for organizers'
    return
  }

  loading.value = true

  try {
    // Build payload — only include non-empty values to avoid backend strict() rejections
    const payload = {
      name: name.value.trim(),
      email: email.value.trim(),
      password: password.value,
      role: role.value,
    }

    if (role.value === 'organizer') {
      payload.organizationName = organizationName.value.trim()
      if (organizationWebsite.value.trim())
        payload.organizationWebsite = organizationWebsite.value.trim()
      if (organizationPhone.value.trim())
        payload.organizationPhone = organizationPhone.value.trim()
      if (organizationDescription.value.trim())
        payload.organizationDescription = organizationDescription.value.trim()
    }

    const result = await authStore.register(payload)

    const redirectPath = {
      organizer: '/organizer',
      attendee: '/dashboard',
      admin: '/admin',
    }
    router.push(redirectPath[result.user.role] || '/dashboard')
  } catch (err) {
    // authStore.error is already set by the store with the real backend message
    error.value = authStore.error || 'Registration failed. Please try again.'
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
      <!-- Error banner -->
      <div v-if="error"
        class="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
        <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>{{ error }}</span>
      </div>

      <!-- Full Name -->
      <div>
        <label for="name" class="label">Full Name</label>
        <input id="name" v-model="name" type="text" autocomplete="name" required class="input"
          placeholder="John Doe" />
      </div>

      <!-- Email -->
      <div>
        <label for="email" class="label">Email Address</label>
        <input id="email" v-model="email" type="email" autocomplete="email" required class="input"
          placeholder="you@example.com" />
      </div>

      <!-- Password -->
      <div>
        <label for="password" class="label">Password</label>
        <div class="relative">
          <input id="password" v-model="password" :type="showPassword ? 'text' : 'password'"
            autocomplete="new-password" required class="input pr-11" placeholder="Min 8 chars, e.g. Test@1234"
            @input="calcStrength(password)" />
          <button type="button" @click="showPassword = !showPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path v-if="!showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              <path v-if="showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          </button>
        </div>
        <!-- Strength bar -->
        <div v-if="password" class="mt-2">
          <div class="flex gap-1 mb-1">
            <div v-for="i in 4" :key="i" class="flex-1 h-1 rounded-full transition-all duration-300"
              :class="i <= strengthScore ? strengthColor[strengthScore] : 'bg-gray-200'"></div>
          </div>
          <p class="text-xs" :class="strengthText[strengthScore]">{{ strengthLabel[strengthScore] }}</p>
        </div>
        <p class="text-xs text-gray-400 mt-1">Must include uppercase, lowercase, number & special character</p>
      </div>

      <!-- Confirm Password -->
      <div>
        <label for="confirmPassword" class="label">Confirm Password</label>
        <div class="relative">
          <input id="confirmPassword" v-model="confirmPassword" :type="showConfirm ? 'text' : 'password'"
            autocomplete="new-password" required class="input pr-11" placeholder="Repeat your password"
            :class="{ 'border-red-400': confirmPassword && password !== confirmPassword }" />
          <button type="button" @click="showConfirm = !showConfirm"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!showConfirm" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path v-if="!showConfirm" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              <path v-if="showConfirm" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          </button>
        </div>
        <p v-if="confirmPassword && password !== confirmPassword" class="text-xs text-red-500 mt-1">
          Passwords do not match
        </p>
      </div>

      <!-- Role selector -->
      <div>
        <label class="label">Account Type</label>
        <div class="grid grid-cols-2 gap-3">
          <button type="button" @click="role = 'attendee'" :class="[
            'p-3 border-2 rounded-lg text-sm font-medium transition-colors',
            role === 'attendee'
              ? 'border-primary-500 bg-primary-50 text-primary-700'
              : 'border-gray-200 text-gray-600 hover:border-primary-300'
          ]">
            <svg class="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Attendee
          </button>
          <button type="button" @click="role = 'organizer'" :class="[
            'p-3 border-2 rounded-lg text-sm font-medium transition-colors',
            role === 'organizer'
              ? 'border-primary-500 bg-primary-50 text-primary-700'
              : 'border-gray-200 text-gray-600 hover:border-primary-300'
          ]">
            <svg class="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Organizer
          </button>
        </div>
        <p class="text-xs text-gray-500 mt-2">
          {{ role === 'organizer' ? 'Create and manage your own events' : 'Discover and attend events' }}
        </p>
      </div>

      <!-- Organizer fields -->
      <div v-if="role === 'organizer'"
        class="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold text-gray-900">Organization Information</h3>
          <span class="text-xs text-gray-500">Required</span>
        </div>

        <div>
          <label for="organizationName" class="label">Organization Name <span class="text-red-500">*</span></label>
          <input id="organizationName" v-model="organizationName" type="text" autocomplete="organization"
            class="input" placeholder="Your organization name" />
        </div>

        <div>
          <label for="organizationWebsite" class="label">Organization Website <span class="text-gray-400 font-normal">(optional)</span></label>
          <input id="organizationWebsite" v-model="organizationWebsite" type="url" autocomplete="url"
            class="input" placeholder="https://example.org" />
        </div>

        <div>
          <label for="organizationPhone" class="label">Organization Phone <span class="text-gray-400 font-normal">(optional)</span></label>
          <input id="organizationPhone" v-model="organizationPhone" type="tel" autocomplete="tel"
            class="input" placeholder="+231 88 000 0000" />
        </div>

        <div>
          <label for="organizationDescription" class="label">Description <span class="text-gray-400 font-normal">(optional)</span></label>
          <textarea id="organizationDescription" v-model="organizationDescription" rows="3" class="input"
            placeholder="Briefly describe your organization"></textarea>
        </div>
      </div>

      <button type="submit" :disabled="loading" class="btn btn-primary w-full btn-lg">
        <LoadingSpinner v-if="loading" size="sm" color="white" class="mr-2" />
        {{ loading ? 'Creating account...' : 'Create Account' }}
      </button>
    </form>

    <p class="mt-6 text-center text-sm text-gray-600">
      Already have an account?
      <RouterLink to="/auth/login" class="text-primary-600 hover:text-primary-700 font-medium">
        Sign in
      </RouterLink>
    </p>
  </div>
</template>``
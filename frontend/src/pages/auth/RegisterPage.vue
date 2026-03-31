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
const strengthLabel = ['', 'Critical', 'Low', 'Secure', 'Optimal']
const strengthColor = ['', 'bg-rose-500', 'bg-amber-500', 'bg-cyan-500', 'bg-emerald-500']
const strengthText  = ['', 'text-rose-400', 'text-amber-400', 'text-cyan-400', 'text-emerald-400']

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
    error.value = 'Missing Parameters: All required fields must be populated'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Mismatch Detected: Passwords do not align'
    return
  }

  if (password.value.length < 8) {
    error.value = 'Security Breach: Password length insufficient'
    return
  }

  const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  if (!strongPassword.test(password.value)) {
    error.value = 'Complexity Required: Include uppercase, numbers, and symbols'
    return
  }

  if (role.value === 'organizer' && !organizationName.value.trim()) {
    error.value = 'Entity Name Required: Organization identifier is missing'
    return
  }

  loading.value = true

  try {
    const payload = {
      name: name.value.trim(),
      email: email.value.trim(),
      password: password.value,
      role: role.value,
    }

    if (role.value === 'organizer') {
      payload.organizationName = organizationName.value.trim()
      if (organizationWebsite.value.trim()) payload.organizationWebsite = organizationWebsite.value.trim()
      if (organizationPhone.value.trim()) payload.organizationPhone = organizationPhone.value.trim()
      if (organizationDescription.value.trim()) payload.organizationDescription = organizationDescription.value.trim()
    }

    const result = await authStore.register(payload)

    const redirectPath = {
      organizer: '/organizer',
      attendee: '/dashboard',
      admin: '/admin',
    }
    router.push(redirectPath[result.user.role] || '/dashboard')
  } catch (err) {
    error.value = authStore.error || 'Identity Deployment Failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#050505] text-white relative font-sans flex items-center justify-center p-6 overflow-x-hidden">
    
    <!-- Global Decorative Elements -->
    <div class="pointer-events-none fixed inset-0 z-0 opacity-[0.03]" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>
    <div class="absolute top-0 left-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
    <div class="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>

    <div class="relative z-10 w-full max-w-2xl py-12">
      
      <!-- Header -->
      <div class="text-center mb-10">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
          <span class="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
          <span class="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Identity Hub</span>
        </div>
        <h2 class="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase mb-2">Initialize Identity</h2>
        <p class="text-zinc-500 font-medium">Establish your unique platform signature.</p>
      </div>

      <!-- Registration Terminal Card -->
      <div class="bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
        
        <form @submit.prevent="handleSubmit" class="space-y-8 relative z-10">
          
          <!-- Error Feed -->
          <Transition name="shake">
            <div v-if="error" class="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              {{ error }}
            </div>
          </Transition>

          <!-- Core Credentials Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Legal Name</label>
              <input v-model="name" type="text" required class="terminal-input" placeholder="e.g. Alex Mercer" />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Terminal Address</label>
              <input v-model="email" type="email" required class="terminal-input" placeholder="user@vessel.net" />
            </div>
          </div>

          <!-- Security Ciphers Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Access Cipher</label>
              <div class="relative group">
                <input v-model="password" :type="showPassword ? 'text' : 'password'" required class="terminal-input pr-12" placeholder="••••••••" @input="calcStrength(password)" />
                <button type="button" @click="showPassword = !showPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="!showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l18 18" />
                  </svg>
                </button>
              </div>
              <!-- Strength meter UI -->
              <div v-if="password" class="mt-3 px-1">
                <div class="flex gap-1.5 mb-2">
                  <div v-for="i in 4" :key="i" class="flex-1 h-1 rounded-full transition-all duration-500" :class="i <= strengthScore ? strengthColor[strengthScore] : 'bg-white/5'"></div>
                </div>
                <p class="text-[9px] font-black uppercase tracking-widest" :class="strengthText[strengthScore]">Security Level: {{ strengthLabel[strengthScore] }}</p>
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Confirm Cipher</label>
              <div class="relative group">
                <input v-model="confirmPassword" :type="showConfirm ? 'text' : 'password'" required class="terminal-input pr-12" :class="{ 'border-rose-500/50': confirmPassword && password !== confirmPassword }" placeholder="••••••••" />
                <button type="button" @click="showConfirm = !showConfirm" class="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Role selection Console -->
          <div class="space-y-4">
            <label class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Select Privilege Tier</label>
            <div class="grid grid-cols-2 gap-4">
              <button type="button" @click="role = 'attendee'" :class="[
                'p-5 border-2 rounded-[1.5rem] text-left transition-all duration-300 relative group/tier',
                role === 'attendee' ? 'border-purple-500 bg-purple-500/5' : 'border-white/5 bg-white/[0.02] hover:border-white/20'
              ]">
                <div v-if="role === 'attendee'" class="absolute right-4 top-4 w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                <svg class="w-6 h-6 mb-3 transition-colors" :class="role === 'attendee' ? 'text-purple-400' : 'text-zinc-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                <p class="text-xs font-black uppercase tracking-widest text-white">Attendee</p>
                <p class="text-[10px] text-zinc-500 font-bold mt-1">Discover & Acquire Access</p>
              </button>

              <button type="button" @click="role = 'organizer'" :class="[
                'p-5 border-2 rounded-[1.5rem] text-left transition-all duration-300 relative group/tier',
                role === 'organizer' ? 'border-cyan-500 bg-cyan-500/5' : 'border-white/5 bg-white/[0.02] hover:border-white/20'
              ]">
                <div v-if="role === 'organizer'" class="absolute right-4 top-4 w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
                <svg class="w-6 h-6 mb-3 transition-colors" :class="role === 'organizer' ? 'text-cyan-400' : 'text-zinc-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" /></svg>
                <p class="text-xs font-black uppercase tracking-widest text-white">Organizer</p>
                <p class="text-[10px] text-zinc-500 font-bold mt-1">Deploy & Manage Modules</p>
              </button>
            </div>
          </div>

          <!-- Organizer Module (Conditional) -->
          <Transition name="expand">
            <div v-if="role === 'organizer'" class="space-y-6 p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] overflow-hidden">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em]">Organization Dossier</h3>
                <span class="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Verification Pending</span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Entity Name *</label>
                  <input v-model="organizationName" type="text" class="terminal-input" placeholder="Global Events Corp" />
                </div>
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Public Web Address</label>
                  <input v-model="organizationWebsite" type="url" class="terminal-input" placeholder="https://vessel.net" />
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Comms Channel (Phone)</label>
                <input v-model="organizationPhone" type="tel" class="terminal-input" placeholder="+1 (555) 000-0000" />
              </div>

              <div class="space-y-2">
                <label class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Objective Brief</label>
                <textarea v-model="organizationDescription" rows="3" class="terminal-input resize-none" placeholder="Describe your operational scope..."></textarea>
              </div>
            </div>
          </Transition>

          <!-- Submit Button -->
          <div class="pt-6">
            <button 
              type="submit" 
              :disabled="loading" 
              class="w-full py-5 bg-white text-black rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <LoadingSpinner v-if="loading" size="sm" color="black" />
              <span>{{ loading ? 'Initializing Deployment...' : 'Commence Identity Deployment' }}</span>
            </button>
            
            <p class="mt-8 text-center text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">
              Existing Node?
              <RouterLink to="/auth/login" class="text-white hover:text-purple-400 transition-colors ml-2 underline underline-offset-4">
                Sign In
              </RouterLink>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Industrial Terminal Inputs */
.terminal-input {
  @apply w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-sm font-bold placeholder-zinc-700 outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all;
}

/* Expansion Animation for Organizer Module */
.expand-enter-active, .expand-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 800px;
}
.expand-enter-from, .expand-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-20px);
}

/* Error Shake */
.shake-enter-active {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}
@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}

/* Swiss typography smooth */
h2, p, button, label {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
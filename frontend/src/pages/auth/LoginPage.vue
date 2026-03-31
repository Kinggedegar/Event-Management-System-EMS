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
const showPassword = ref(false)

async function handleSubmit() {
  if (!email.value || !password.value) {
    error.value = 'Missing Credentials: All fields required'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    const result = await authStore.login(email.value, password.value)
    
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
    error.value = authStore.error || 'Identity Verification Failed'
  } finally {
    loading.value = false
  }
}

// Quick login helper for demo
const fillDemo = (e, p) => {
  email.value = e
  password.value = p
}
</script>

<template>
  <div class="min-h-screen bg-[#050505] text-white relative font-sans flex items-center justify-center p-6 overflow-hidden">
    
    <!-- Global Decorative Elements -->
    <div class="pointer-events-none fixed inset-0 z-0 opacity-[0.03]" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>
    <div class="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none"></div>
    <div class="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>

    <div class="relative z-10 w-full max-w-md">
      
      <!-- Terminal Header -->
      <div class="text-center mb-10">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
          <span class="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
          <span class="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Identity Portal</span>
        </div>
        <h2 class="text-4xl font-black text-white tracking-tighter uppercase mb-2">Welcome Back</h2>
        <p class="text-zinc-500 font-medium">Initialize session to access your dashboard.</p>
      </div>

      <!-- Authentication Card -->
      <div class="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden group">
        <!-- Glow accent -->
        <div class="absolute -top-24 -right-24 w-48 h-48 bg-white/5 blur-[60px] rounded-full pointer-events-none transition-opacity group-hover:opacity-100 opacity-50"></div>

        <form @submit.prevent="handleSubmit" class="space-y-6 relative z-10">
          
          <!-- Error Alert -->
          <Transition name="shake">
            <div v-if="error" class="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              {{ error }}
            </div>
          </Transition>
          
          <div class="space-y-2">
            <label for="email" class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Terminal Address</label>
            <div class="relative group/input">
               <input
                id="email"
                v-model="email"
                type="email"
                required
                class="w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-sm font-bold placeholder-zinc-700 outline-none focus:border-cyan-500/50 focus:bg-white/[0.05] transition-all"
                placeholder="system_user@vessel.com"
              >
              <svg class="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 group-focus-within/input:text-cyan-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" /></svg>
            </div>
          </div>
          
          <div class="space-y-2">
            <label for="password" class="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Access Cipher</label>
            <div class="relative group/input">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-sm font-bold placeholder-zinc-700 outline-none focus:border-cyan-500/50 focus:bg-white/[0.05] transition-all"
                placeholder="••••••••••••"
              >
              <button type="button" @click="showPassword = !showPassword" class="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-700 hover:text-white transition-colors">
                <svg v-if="!showPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.04m4.066-4.19A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.059 10.059 0 01-1.563 3.04M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18" /></svg>
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            :disabled="loading" 
            class="w-full py-5 bg-white text-black rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <LoadingSpinner v-if="loading" size="sm" color="black" />
            <span>Authorize Session</span>
          </button>
        </form>
        
        <p class="mt-8 text-center text-xs font-bold text-zinc-600 uppercase tracking-widest">
          New to the hub?
          <RouterLink to="/auth/register" class="text-white hover:text-cyan-400 transition-colors ml-1">
            Create Identity
          </RouterLink>
        </p>
      </div>
      
      <!-- System Credentials Console -->
      <div class="mt-8 bg-white/[0.02] border border-white/5 rounded-3xl p-6 backdrop-blur-md">
        <p class="text-[9px] font-black text-zinc-600 text-center uppercase tracking-[0.4em] mb-4">Available System Nodes</p>
        <div class="space-y-2">
          <div 
            v-for="demo in [
              { r: 'Admin', e: 'admin@eventhub.com', p: 'admin123' },
              { r: 'Organizer', e: 'organizer@eventhub.com', p: 'organizer123' },
              { r: 'Attendee', e: 'attendee@eventhub.com', p: 'attendee123' }
            ]" 
            :key="demo.r"
            @click="fillDemo(demo.e, demo.p)"
            class="group/node flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5 hover:border-cyan-500/30 cursor-pointer transition-all"
          >
            <span class="text-[10px] font-black text-zinc-500 uppercase tracking-widest group-hover/node:text-cyan-500 transition-colors">{{ demo.r }}</span>
            <span class="text-[10px] font-mono text-zinc-600 group-hover/node:text-zinc-300 transition-colors">Key: {{ demo.p }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Shake animation for error state */
.shake-enter-active {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}

/* Custom Input Focus State (Inner Shadow) */
input:focus {
  box-shadow: inset 0 0 15px rgba(34, 211, 238, 0.05);
}
</style>
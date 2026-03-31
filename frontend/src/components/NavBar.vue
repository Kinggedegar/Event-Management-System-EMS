<script setup>
import { RouterLink } from 'vue-router'
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const mobileMenuOpen = ref(false)
const userMenuOpen = ref(false)

const dashboardLink = computed(() => {
  if (!authStore.isAuthenticated) return '/auth/login'
  const role = authStore.user?.role
  if (role === 'admin') return '/admin'
  if (role === 'organizer') return '/organizer'
  return '/dashboard'
})

function logout() {
  authStore.logout()
  userMenuOpen.value = false
  window.location.href = '/'
}
</script>

<template>
  <!-- Main Header Wrapper -->
  <header class="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4 pointer-events-none transition-all duration-300">
    
    <!-- Floating Glass Pill -->
    <nav class="pointer-events-auto relative w-full max-w-5xl rounded-full border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all">
      <div class="px-6 py-3.5 flex items-center justify-between">

        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-3 group shrink-0">
          <div class="relative w-9 h-9 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105">
            <div class="absolute inset-0 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 opacity-20 group-hover:opacity-60 transition-opacity duration-500"></div>
            <svg class="w-5 h-5 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span class="text-xl font-black tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-300 group-hover:to-purple-400 transition-all duration-300">
            EventHub
          </span>
        </RouterLink>

        <!-- Desktop Nav Links -->
        <div class="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          <RouterLink to="/" class="px-5 py-2 text-sm font-bold text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-all duration-300">Home</RouterLink>
          <RouterLink to="/events" class="px-5 py-2 text-sm font-bold text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-all duration-300">Events</RouterLink>
          <RouterLink to="/categories" class="px-5 py-2 text-sm font-bold text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-all duration-300">Categories</RouterLink>
        </div>

        <!-- Desktop Auth Actions -->
        <div class="hidden md:flex items-center gap-4 shrink-0">
          <template v-if="authStore.isAuthenticated">
            <div class="relative">
              <button
                @click="userMenuOpen = !userMenuOpen"
                class="flex items-center gap-3 pl-4 pr-1.5 py-1.5 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300 group"
              >
                <span class="text-sm font-bold text-zinc-300 group-hover:text-white">{{ authStore.user?.name || 'User' }}</span>
                <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500 flex items-center justify-center text-white font-black text-xs shadow-inner transition-transform group-hover:rotate-12">
                  {{ authStore.user?.name?.[0]?.toUpperCase() || 'U' }}
                </div>
              </button>

              <!-- Premium User Dropdown -->
              <Transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="opacity-0 translate-y-4 scale-95"
                enter-to-class="opacity-100 translate-y-0 scale-100"
                leave-active-class="transition ease-in duration-150"
                leave-from-class="opacity-100 translate-y-0 scale-100"
                leave-to-class="opacity-0 translate-y-4 scale-95"
              >
                <div v-if="userMenuOpen" class="absolute right-0 top-full mt-4 w-56 rounded-3xl border border-white/10 bg-[#0a0a0a]/95 backdrop-blur-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] p-2 z-50 origin-top-right">
                  <RouterLink
                    :to="dashboardLink"
                    class="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-zinc-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                    @click="userMenuOpen = false"
                  >
                    <svg class="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                    Dashboard
                  </RouterLink>
                  <RouterLink
                    to="/dashboard/profile"
                    class="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-zinc-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                    @click="userMenuOpen = false"
                  >
                    <svg class="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    Profile
                  </RouterLink>
                  <div class="h-px bg-white/10 my-2 mx-2"></div>
                  <button
                    @click="logout"
                    class="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Sign Out
                  </button>
                </div>
              </Transition>
            </div>
          </template>
          <template v-else>
            <RouterLink to="/auth/login" class="px-5 py-2 text-sm font-bold text-zinc-400 hover:text-white transition-colors duration-200">Sign In</RouterLink>
            <RouterLink to="/auth/register" class="px-6 py-2.5 text-sm font-black text-black bg-white hover:bg-zinc-200 rounded-full transition-transform duration-300 hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]">
              Get Started
            </RouterLink>
          </template>
        </div>

        <!-- Mobile Menu Toggle -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all duration-200"
        >
          <svg v-if="!mobileMenuOpen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Mobile Floating Menu -->
      <Transition
        enter-active-class="transition ease-out duration-300"
        enter-from-class="opacity-0 -translate-y-4 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 -translate-y-4 scale-95"
      >
        <div v-if="mobileMenuOpen" class="md:hidden absolute top-full left-0 right-0 mt-4 p-4 rounded-3xl border border-white/10 bg-[#0a0a0a]/95 backdrop-blur-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] origin-top z-50">
          <div class="flex flex-col gap-2">
            <RouterLink to="/" class="px-5 py-4 text-base font-bold text-zinc-300 hover:text-white hover:bg-white/5 rounded-2xl transition-all duration-200" @click="mobileMenuOpen = false">Home</RouterLink>
            <RouterLink to="/events" class="px-5 py-4 text-base font-bold text-zinc-300 hover:text-white hover:bg-white/5 rounded-2xl transition-all duration-200" @click="mobileMenuOpen = false">Events</RouterLink>
            <RouterLink to="/categories" class="px-5 py-4 text-base font-bold text-zinc-300 hover:text-white hover:bg-white/5 rounded-2xl transition-all duration-200" @click="mobileMenuOpen = false">Categories</RouterLink>
            
            <div class="h-px bg-white/10 my-2 mx-2"></div>
            
            <template v-if="authStore.isAuthenticated">
              <RouterLink :to="dashboardLink" class="px-5 py-4 text-base font-bold text-cyan-400 hover:bg-cyan-400/10 rounded-2xl transition-all duration-200" @click="mobileMenuOpen = false">Dashboard</RouterLink>
              <button @click="logout" class="text-left px-5 py-4 text-base font-bold text-red-400 hover:bg-red-500/10 rounded-2xl transition-all duration-200">Sign Out</button>
            </template>
            <template v-else>
              <RouterLink to="/auth/login" class="px-5 py-4 text-base font-bold text-zinc-300 hover:text-white hover:bg-white/5 rounded-2xl transition-all duration-200" @click="mobileMenuOpen = false">Sign In</RouterLink>
              <RouterLink to="/auth/register" class="mt-2 px-5 py-4 text-base font-black text-black text-center rounded-2xl bg-white hover:bg-zinc-200 transition-all duration-200" @click="mobileMenuOpen = false">Get Started</RouterLink>
            </template>
          </div>
        </div>
      </Transition>
    </nav>
  </header>

  <!-- Invisible Backdrop to close Dropdowns when clicking outside -->
  <div v-if="userMenuOpen || mobileMenuOpen" class="fixed inset-0 z-40 bg-transparent" @click="userMenuOpen = false; mobileMenuOpen = false"></div>
</template>

<style scoped>
/* No extra css needed, Vue <Transition> + Tailwind handles the magic */
</style>
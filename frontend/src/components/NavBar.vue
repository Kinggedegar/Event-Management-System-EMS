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
  <header class="fixed top-0 left-0 right-0 z-50">
    <!-- Glass navbar -->
    <nav class="mx-4 mt-3 rounded-2xl border border-white/10 bg-gray-950/70 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
      <div class="px-6">
        <div class="flex items-center justify-between h-14">

          <!-- Logo -->
          <RouterLink to="/" class="flex items-center gap-2.5 group">
            <div class="relative w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-all duration-300">
              <svg class="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div class="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <span class="text-lg font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent tracking-tight">EventHub</span>
          </RouterLink>

          <!-- Desktop Nav Links -->
          <div class="hidden md:flex items-center gap-1">
            <RouterLink to="/" class="px-4 py-1.5 text-sm font-medium text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200">Home</RouterLink>
            <RouterLink to="/events" class="px-4 py-1.5 text-sm font-medium text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200">Events</RouterLink>
            <RouterLink to="/categories" class="px-4 py-1.5 text-sm font-medium text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200">Categories</RouterLink>
          </div>

          <!-- Desktop Auth -->
          <div class="hidden md:flex items-center gap-3">
            <template v-if="authStore.isAuthenticated">
              <div class="relative">
                <button
                  @click="userMenuOpen = !userMenuOpen"
                  class="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-white/5 transition-all duration-200 group"
                >
                  <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-sm">
                    <span class="text-white font-semibold text-xs">
                      {{ authStore.user?.name?.[0]?.toUpperCase() || 'U' }}
                    </span>
                  </div>
                  <span class="text-sm font-medium text-gray-300">{{ authStore.user?.name }}</span>
                  <svg class="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div
                  v-if="userMenuOpen"
                  class="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-gray-900/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] py-1.5 z-50"
                >
                  <RouterLink
                    :to="dashboardLink"
                    class="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-150"
                    @click="userMenuOpen = false"
                  >
                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                    Dashboard
                  </RouterLink>
                  <RouterLink
                    to="/dashboard/profile"
                    class="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-150"
                    @click="userMenuOpen = false"
                  >
                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    Profile
                  </RouterLink>
                  <div class="h-px bg-white/5 my-1.5 mx-4"></div>
                  <button
                    @click="logout"
                    class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all duration-150"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Sign Out
                  </button>
                </div>
              </div>
            </template>
            <template v-else>
              <RouterLink to="/auth/login" class="px-4 py-1.5 text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200">Sign In</RouterLink>
              <RouterLink to="/auth/register" class="relative px-4 py-1.5 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 transition-all duration-300 hover:scale-[1.02]">
                Get Started
              </RouterLink>
            </template>
          </div>

          <!-- Mobile menu toggle -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200"
          >
            <svg v-if="!mobileMenuOpen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Mobile menu -->
        <div v-if="mobileMenuOpen" class="md:hidden border-t border-white/5 py-3 mt-1">
          <div class="flex flex-col gap-1">
            <RouterLink to="/" class="px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200" @click="mobileMenuOpen = false">Home</RouterLink>
            <RouterLink to="/events" class="px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200" @click="mobileMenuOpen = false">Events</RouterLink>
            <RouterLink to="/categories" class="px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200" @click="mobileMenuOpen = false">Categories</RouterLink>
            <div class="h-px bg-white/5 my-1"></div>
            <template v-if="authStore.isAuthenticated">
              <RouterLink :to="dashboardLink" class="px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200" @click="mobileMenuOpen = false">Dashboard</RouterLink>
              <button @click="logout" class="text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/5 rounded-lg transition-all duration-200">Sign Out</button>
            </template>
            <template v-else>
              <RouterLink to="/auth/login" class="px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200" @click="mobileMenuOpen = false">Sign In</RouterLink>
              <RouterLink to="/auth/register" class="px-3 py-2 text-sm font-semibold text-white text-center rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600" @click="mobileMenuOpen = false">Get Started</RouterLink>
            </template>
          </div>
        </div>
      </div>
    </nav>
  </header>

  <!-- Backdrop -->
  <div v-if="userMenuOpen" class="fixed inset-0 z-40" @click="userMenuOpen = false"></div>
</template>
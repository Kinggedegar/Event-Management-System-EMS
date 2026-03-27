<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { computed, ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import NavBar from '../components/NavBar.vue'
import Footer from '../components/Footer.vue'

const authStore = useAuthStore()
const route = useRoute()
const sidebarOpen = ref(false)

const navigation = computed(() => {
  const role = authStore.user?.role
  
  if (role === 'admin') {
    return [
      { name: 'Dashboard', href: '/admin', icon: 'home' },
      { name: 'Users', href: '/admin/users', icon: 'users' },
      { name: 'Events', href: '/admin/events', icon: 'calendar' },
      { name: 'Categories', href: '/admin/categories', icon: 'tag' },
      { name: 'Reviews', href: '/admin/reviews', icon: 'star' },
      { name: 'Payments', href: '/admin/payments', icon: 'credit-card' },
    ]
  } else if (role === 'organizer') {
    return [
      { name: 'Dashboard', href: '/organizer', icon: 'home' },
      { name: 'My Events', href: '/organizer/events', icon: 'calendar' },
      { name: 'Create Event', href: '/organizer/events/create', icon: 'plus' },
      { name: 'QR Scanner', href: '/organizer/scanner', icon: 'qr-code' },
    ]
  } else {
    return [
      { name: 'Dashboard', href: '/dashboard', icon: 'home' },
      { name: 'My Tickets', href: '/dashboard/tickets', icon: 'ticket' },
      { name: 'Profile', href: '/dashboard/profile', icon: 'user' },
    ]
  }
})

const dashboardTitle = computed(() => {
  const role = authStore.user?.role
  if (role === 'admin') return 'Admin Dashboard'
  if (role === 'organizer') return 'Organizer Dashboard'
  return 'My Dashboard'
})

function logout() {
  authStore.logout()
  window.location.href = '/'
}

function isActive(href) {
  if (href === '/admin' || href === '/organizer' || href === '/dashboard') {
    return route.path === href
  }
  return route.path.startsWith(href)
}
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-white">

    <NavBar />

    <!-- Mobile sidebar backdrop -->
    <div 
      v-if="sidebarOpen" 
      class="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-sm"
      @click="sidebarOpen = false"
    ></div>
    
    <!-- Sidebar -->
    <aside 
      :class="[
        'fixed top-0 left-0 z-50 h-full w-72 bg-gray-900/95 border-r border-white/10 backdrop-blur-xl transform transition-transform duration-300 lg:translate-x-0 shadow-2xl',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="flex items-center justify-between h-16 px-6 border-b border-white/10">
          <RouterLink to="/" class="flex items-center gap-3">
            <div class="w-9 h-9 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/30">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span class="font-black text-2xl tracking-tighter bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">EventHub</span>
          </RouterLink>
          <button @click="sidebarOpen = false" class="lg:hidden p-2 text-gray-400 hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- Navigation -->
        <nav class="flex-1 p-6 space-y-2 overflow-y-auto">
          <RouterLink
            v-for="item in navigation"
            :key="item.name"
            :to="item.href"
            :class="[
              'flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 group',
              isActive(item.href)
                ? 'bg-white/10 text-white shadow-inner border border-white/10'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            ]"
            @click="sidebarOpen = false"
          >
            <!-- Icons remain the same -->
            <svg v-if="item.icon === 'home'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <svg v-else-if="item.icon === 'users'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg v-else-if="item.icon === 'calendar'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <svg v-else-if="item.icon === 'tag'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <svg v-else-if="item.icon === 'star'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <svg v-else-if="item.icon === 'credit-card'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <svg v-else-if="item.icon === 'plus'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <svg v-else-if="item.icon === 'qr-code'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            <svg v-else-if="item.icon === 'ticket'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            <svg v-else-if="item.icon === 'user'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {{ item.name }}
          </RouterLink>
        </nav>
        
        <!-- User section -->
        <div class="p-6 border-t border-white/10 mt-auto">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center border border-white/10">
              <span class="text-xl font-semibold text-white">
                {{ authStore.user?.name?.[0]?.toUpperCase() || 'U' }}
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-white truncate">{{ authStore.user?.name }}</p>
              <p class="text-xs text-gray-500 capitalize">{{ authStore.user?.role }}</p>
            </div>
          </div>
          <button
            @click="logout"
            class="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-2xl border border-white/10 transition-all duration-200"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </div>
    </aside>
    
    <!-- Main content -->
    <div class="lg:pl-72 flex-1 bg-gray-950">
      <!-- Top bar -->
      <header class="sticky top-0 z-30 bg-gray-900/95 border-b border-white/10 backdrop-blur-xl">
        <div class="flex items-center justify-between h-16 px-6">
          <div class="flex items-center gap-4">
            <button @click="sidebarOpen = true" class="lg:hidden p-2 text-gray-400 hover:text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 class="text-xl font-semibold text-white">{{ dashboardTitle }}</h1>
          </div>
          <div class="flex items-center gap-3">
            <RouterLink to="/events" 
              class="px-5 py-2 text-sm font-medium text-gray-400 hover:text-white border border-white/10 hover:border-white/20 rounded-2xl transition-all duration-200">
              Browse Events
            </RouterLink>
          </div>
        </div>
      </header>
      
      <!-- Page content -->
      <main class="p-6 lg:p-8 min-h-[calc(100vh-4rem)]">
        <RouterView />
      </main>
    </div>

    <Footer />
  </div>
</template>
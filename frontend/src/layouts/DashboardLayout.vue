<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { computed, ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const route = useRoute()
const sidebarOpen = ref(false)

const navigation = computed(() => {
  const role = authStore.user?.role
  
  if (role === 'admin') {
    return [
      { name: 'Overview', href: '/admin', icon: 'home' },
      { name: 'Users', href: '/admin/users', icon: 'users' },
      { name: 'Events', href: '/admin/events', icon: 'calendar' },
      { name: 'Categories', href: '/admin/categories', icon: 'tag' },
      { name: 'Feedback', href: '/admin/reviews', icon: 'star' },
      { name: 'Financials', href: '/admin/payments', icon: 'credit-card' },
    ]
  } else if (role === 'organizer') {
    return [
      { name: 'Console', href: '/organizer', icon: 'home' },
      { name: 'My Events', href: '/organizer/events', icon: 'calendar' },
      { name: 'Create New', href: '/organizer/events/create', icon: 'plus' },
      { name: 'QR Validator', href: '/organizer/scanner', icon: 'qr-code' },
    ]
  } else {
    return [
      { name: 'Hub', href: '/dashboard', icon: 'home' },
      { name: 'My Tickets', href: '/dashboard/tickets', icon: 'ticket' },
      { name: 'Profile Settings', href: '/dashboard/profile', icon: 'user' },
    ]
  }
})

const dashboardTitle = computed(() => {
  const role = authStore.user?.role
  if (role === 'admin') return 'System Administration'
  if (role === 'organizer') return 'Organizer Console'
  return 'User Dashboard'
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
  <div class="min-h-screen bg-[#050505] text-white relative font-sans">
    
    <!-- Background Elements -->
    <div class="pointer-events-none fixed inset-0 z-0 opacity-[0.03]" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>
    <div class="fixed top-0 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

    <!-- Sidebar -->
    <aside 
      :class="[
        'fixed top-0 left-0 z-50 h-full w-72 bg-[#0a0a0a] border-r border-white/5 backdrop-blur-2xl transform transition-transform duration-500 lg:translate-x-0 shadow-2xl',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="flex items-center justify-between h-24 px-8">
          <RouterLink to="/" class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span class="font-black text-2xl tracking-tighter text-white uppercase">Event<span class="text-zinc-500">Hub</span></span>
          </RouterLink>
          <button @click="sidebarOpen = false" class="lg:hidden p-2 text-zinc-500 hover:text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <!-- Nav -->
        <nav class="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
          <p class="px-4 text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-4">Console</p>
          <RouterLink
            v-for="item in navigation"
            :key="item.name"
            :to="item.href"
            :class="[
              'flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[12px] font-black uppercase tracking-wider transition-all duration-300 relative',
              isActive(item.href) ? 'bg-white/5 text-cyan-400 border border-white/10' : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.03]'
            ]"
            @click="sidebarOpen = false"
          >
            <div v-if="isActive(item.href)" class="absolute left-0 top-1/4 bottom-1/4 w-1 bg-cyan-500 rounded-full"></div>
            <div class="w-5 h-5">
              <!-- Inline SVGs for Icons -->
              <svg v-if="item.icon === 'home'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              <svg v-else-if="item.icon === 'users'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              <svg v-else-if="item.icon === 'calendar'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <svg v-else-if="item.icon === 'tag'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
              <svg v-else-if="item.icon === 'star'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
              <svg v-else-if="item.icon === 'credit-card'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
              <svg v-else-if="item.icon === 'plus'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
              <svg v-else-if="item.icon === 'qr-code'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
              <svg v-else-if="item.icon === 'ticket'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
              <svg v-else-if="item.icon === 'user'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            {{ item.name }}
          </RouterLink>
        </nav>
        
        <!-- User Footer -->
        <div class="p-4 mt-auto">
          <div class="bg-white/[0.03] border border-white/5 rounded-[2rem] p-4">
            <div class="flex items-center gap-3 mb-4 px-2">
              <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500 flex items-center justify-center text-white text-xs font-black">
                {{ authStore.user?.name?.[0]?.toUpperCase() }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-black truncate">{{ authStore.user?.name }}</p>
                <p class="text-[10px] text-cyan-500 font-bold uppercase tracking-widest">{{ authStore.user?.role }}</p>
              </div>
            </div>
            <button @click="logout" class="w-full py-3 text-[10px] font-black uppercase text-rose-500 border border-rose-500/10 rounded-xl hover:bg-rose-500 hover:text-white transition-all">Sign Out</button>
          </div>
        </div>
      </div>
    </aside>
    
    <!-- Main Content -->
    <div class="lg:pl-72 flex flex-col min-h-screen relative z-10">
      <header class="sticky top-0 z-40 bg-[#050505]/80 border-b border-white/5 backdrop-blur-xl h-20 flex items-center justify-between px-8">
        <div class="flex items-center gap-4">
          <button @click="sidebarOpen = true" class="lg:hidden p-2 text-zinc-400 bg-white/5 rounded-xl">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <h1 class="text-xs font-black text-zinc-400 uppercase tracking-[0.3em]">{{ dashboardTitle }}</h1>
        </div>
        <RouterLink to="/events" class="px-6 py-2 text-[10px] font-black uppercase bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">Live Site</RouterLink>
      </header>
      
      <!-- IMPORTANT: Simplified RouterView -->
      <main class="flex-1 p-6 lg:p-10 relative">
        <RouterView />
      </main>
    </div>

    <!-- Mobile Overlay -->
    <div v-if="sidebarOpen" class="fixed inset-0 bg-black/80 backdrop-blur-md z-[45] lg:hidden" @click="sidebarOpen = false"></div>
  </div>
</template>
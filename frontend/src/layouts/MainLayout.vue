<script setup>
import { RouterView } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import NavBar from '../components/NavBar.vue'
import Footer from '../components/Footer.vue'

const authStore = useAuthStore()

// Logic for the Scroll to Top button
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <!-- Main Application Wrapper -->
  <div class="min-h-screen bg-[#050505] text-white relative font-sans flex flex-col overflow-x-hidden">
    
    <!-- ══════════════════════════════════════════ -->
    <!-- GLOBAL VISUAL ARCHITECTURE                -->
    <!-- ══════════════════════════════════════════ -->
    
    <!-- Global Noise Overlay -->
    <div class="pointer-events-none fixed inset-0 z-[1] opacity-[0.03]" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>

    <!-- Ambient Orbs -->
    <div class="fixed top-[-10%] right-[-5%] w-[800px] h-[800px] bg-violet-600/[0.07] rounded-full blur-[120px] pointer-events-none z-0 animate-pulse-slow"></div>
    <div class="fixed bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-cyan-600/[0.05] rounded-full blur-[120px] pointer-events-none z-0"></div>

    <!-- ══════════════════════════════════════════ -->
    <!-- NAVIGATION BAR                            -->
    <!-- ══════════════════════════════════════════ -->
    <header class="relative z-[100]">
      <NavBar />
    </header>

    <!-- ══════════════════════════════════════════ -->
    <!-- MAIN CONTENT VIEW                         -->
    <!-- ══════════════════════════════════════════ -->
    <main class="flex-1 relative z-10">
      <RouterView v-slot="{ Component }">
        <transition 
          name="page-reveal" 
          mode="out-in"
          appear
        >
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>

    <!-- ══════════════════════════════════════════ -->
    <!-- FOOTER                                    -->
    <!-- ══════════════════════════════════════════ -->
    <footer class="relative z-10 border-t border-white/5 bg-[#080808]/50 backdrop-blur-md">
      <Footer />
    </footer>

    <!-- Back to Top Button -->
    <button 
      @click="scrollToTop"
      class="fixed bottom-8 right-8 z-[90] w-12 h-12 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
    >
      <svg class="w-5 h-5 transition-transform group-hover:-translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  </div>
</template>

<style>
/* Global Page Transitions */
.page-reveal-enter-active,
.page-reveal-leave-active {
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
}

.page-reveal-enter-from {
  opacity: 0;
  transform: translateY(15px);
  filter: blur(10px);
}

.page-reveal-leave-to {
  opacity: 0;
  transform: translateY(-15px);
  filter: blur(10px);
}

/* Custom Scrollbar */
html {
  scroll-behavior: smooth;
  background-color: #050505;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #050505;
}

::-webkit-scrollbar-thumb {
  background: #1a1a1a;
  border-radius: 10px;
  border: 2px solid #050505;
}

::-webkit-scrollbar-thumb:hover {
  background: #252525;
}

@keyframes pulse-slow {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}

.animate-pulse-slow {
  animation: pulse-slow 10s infinite ease-in-out;
}

body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
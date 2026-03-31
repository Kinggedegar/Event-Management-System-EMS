<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-[#050505] text-white relative font-sans flex flex-col justify-center items-center p-6 overflow-hidden">
    
    <!-- Global Decorative Elements (Consistency with the Master Theme) -->
    <div class="pointer-events-none fixed inset-0 z-0 opacity-[0.03]" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>
    
    <!-- Large Cinematic Orbs -->
    <div class="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

    <!-- Layout Container -->
    <div class="relative z-10 w-full max-w-[440px] flex flex-col">
      
      <!-- Brand Identity Header -->
      <div class="mb-12 flex justify-center">
        <RouterLink to="/" class="group flex flex-col items-center gap-4">
          <div class="w-16 h-16 bg-white text-black rounded-[2rem] flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.15)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div class="text-center">
            <span class="text-2xl font-black tracking-[0.3em] uppercase text-white">Event<span class="text-zinc-500">Hub</span></span>
            <div class="h-px w-12 bg-zinc-800 mx-auto mt-2 group-hover:w-20 transition-all duration-500"></div>
          </div>
        </RouterLink>
      </div>

      <!-- Main Auth Terminal -->
      <main class="bg-[#0a0a0a]/60 border border-white/10 rounded-[3.5rem] p-8 md:p-12 backdrop-blur-2xl shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden">
        <!-- Inner glow effect -->
        <div class="absolute -top-24 -left-24 w-48 h-48 bg-white/5 blur-[60px] rounded-full pointer-events-none"></div>

        <RouterView v-slot="{ Component }">
          <transition name="auth-fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </RouterView>
      </main>
      
      <!-- Footer Actions -->
      <div class="mt-10 text-center">
        <RouterLink to="/" class="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-all group">
          <svg class="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to System Origin
        </RouterLink>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Industrial smoothness */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Auth Page Transition */
.auth-fade-enter-active,
.auth-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
}

.auth-fade-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}

.auth-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(1.02);
}

/* Subtle background drift animation for orbs */
@keyframes drift {
  0% { transform: translate(0, 0); }
  50% { transform: translate(30px, 20px); }
  100% { transform: translate(0, 0); }
}

.absolute.bg-purple-600\/10 {
  animation: drift 15s infinite ease-in-out;
}

.absolute.bg-cyan-600\/10 {
  animation: drift 20s infinite ease-in-out reverse;
}
</style>

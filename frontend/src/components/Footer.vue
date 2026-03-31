<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <footer class="relative bg-[#050505] pt-24 pb-8 border-t border-white/10 overflow-hidden font-sans text-white">
    
    <!-- Global Noise Overlay -->
    <div class="pointer-events-none absolute inset-0 z-0 opacity-[0.03]" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>

    <!-- Ambient Glows -->
    <div class="absolute inset-0 pointer-events-none z-0">
      <div class="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen"></div>
      <div class="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[100px] mix-blend-screen"></div>
    </div>

    <!-- Massive Background Watermark -->
    <h1 class="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[18vw] font-black text-white/[0.02] whitespace-nowrap pointer-events-none select-none z-0 tracking-tighter">
      EVENTHUB
    </h1>

    <div class="relative z-10 max-w-[80rem] mx-auto px-6">
      
      <!-- Top Section: CTA / Newsletter -->
      <div class="flex flex-col lg:flex-row items-center justify-between gap-10 pb-16 mb-16 border-b border-white/10">
        <div class="max-w-xl text-center lg:text-left">
          <h3 class="text-3xl font-black tracking-tight mb-2">Stay in the Loop.</h3>
          <p class="text-zinc-400 text-lg">Get exclusive access to underground events, early bird tickets, and platform updates.</p>
        </div>
        
        <div class="w-full lg:w-auto relative group">
          <div class="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
          <form @submit.prevent class="relative flex items-center bg-[#0a0a0a] border border-white/10 rounded-full p-1.5 w-full lg:w-[450px]">
            <input type="email" placeholder="Enter your email" class="bg-transparent text-white placeholder-zinc-500 px-5 w-full outline-none font-medium" required />
            <button type="submit" class="bg-white hover:bg-cyan-400 text-black px-6 py-3 rounded-full font-bold transition-colors whitespace-nowrap flex items-center gap-2">
              Subscribe <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </button>
          </form>
        </div>
      </div>

      <!-- Main Footer Grid -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">

        <!-- Brand Column -->
        <div class="md:col-span-5 pr-0 lg:pr-12">
          <RouterLink to="/" class="flex items-center gap-3 mb-6 group w-fit">
            <div class="relative w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-110">
              <div class="absolute inset-0 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 opacity-20 group-hover:opacity-100 transition-opacity duration-500"></div>
              <svg class="w-5 h-5 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span class="text-2xl font-black tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-300 group-hover:to-purple-400 transition-all duration-300">
              EventHub
            </span>
          </RouterLink>

          <p class="text-zinc-400 text-base leading-relaxed mb-8 font-medium">
            The ultimate infrastructure for world-class experiences. Discover, create, and manage events with unmatched elegance and power.
          </p>

          <!-- Social links (Interactive Pills) -->
          <div class="flex items-center gap-4">
            <a href="#" class="group relative w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:border-transparent transition-all duration-300 overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-tr from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <!-- Twitter/X -->
              <svg class="w-4 h-4 relative z-10" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
            </a>
            <a href="#" class="group relative w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:border-transparent transition-all duration-300 overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-tr from-pink-500 via-purple-500 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <!-- Instagram -->
              <svg class="w-5 h-5 relative z-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/></svg>
            </a>
            <a href="#" class="group relative w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:border-transparent transition-all duration-300 overflow-hidden">
              <div class="absolute inset-0 bg-[#0077b5] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <!-- LinkedIn -->
              <svg class="w-4 h-4 relative z-10" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
          </div>
        </div>

        <!-- Links Columns -->
        <div class="md:col-span-2">
          <h4 class="text-sm font-black text-white uppercase tracking-widest mb-6">Platform</h4>
          <ul class="space-y-4">
            <li><RouterLink to="/events" class="group flex items-center text-zinc-400 hover:text-cyan-400 font-medium transition-colors"><span class="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 ease-out text-cyan-400">-</span> Browse Events</RouterLink></li>
            <li><RouterLink to="/categories" class="group flex items-center text-zinc-400 hover:text-cyan-400 font-medium transition-colors"><span class="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 ease-out text-cyan-400">-</span> Categories</RouterLink></li>
            <li><RouterLink to="/auth/register" class="group flex items-center text-zinc-400 hover:text-cyan-400 font-medium transition-colors"><span class="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 ease-out text-cyan-400">-</span> Host an Event</RouterLink></li>
            <li><a href="#" class="group flex items-center text-zinc-400 hover:text-cyan-400 font-medium transition-colors"><span class="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 ease-out text-cyan-400">-</span> Pricing</a></li>
          </ul>
        </div>

        <div class="md:col-span-2">
          <h4 class="text-sm font-black text-white uppercase tracking-widest mb-6">Company</h4>
          <ul class="space-y-4">
            <li><a href="#" class="group flex items-center text-zinc-400 hover:text-purple-400 font-medium transition-colors"><span class="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 ease-out text-purple-400">-</span> About Us</a></li>
            <li><a href="#" class="group flex items-center text-zinc-400 hover:text-purple-400 font-medium transition-colors"><span class="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 ease-out text-purple-400">-</span> Manifesto</a></li>
            <li><a href="#" class="group flex items-center text-zinc-400 hover:text-purple-400 font-medium transition-colors"><span class="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 ease-out text-purple-400">-</span> Careers <span class="ml-2 bg-purple-500/20 text-purple-300 text-[10px] px-2 py-0.5 rounded-full border border-purple-500/20">Hiring</span></a></li>
            <li><a href="#" class="group flex items-center text-zinc-400 hover:text-purple-400 font-medium transition-colors"><span class="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 ease-out text-purple-400">-</span> Press</a></li>
          </ul>
        </div>

        <div class="md:col-span-3">
          <h4 class="text-sm font-black text-white uppercase tracking-widest mb-6">Support</h4>
          <ul class="space-y-4">
            <li><a href="#" class="group flex items-center text-zinc-400 hover:text-pink-400 font-medium transition-colors"><span class="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 ease-out text-pink-400">-</span> Help Center</a></li>
            <li><a href="#" class="group flex items-center text-zinc-400 hover:text-pink-400 font-medium transition-colors"><span class="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 ease-out text-pink-400">-</span> Contact Us</a></li>
            <li><a href="#" class="group flex items-center text-zinc-400 hover:text-pink-400 font-medium transition-colors"><span class="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 ease-out text-pink-400">-</span> Privacy Policy</a></li>
            <li><a href="#" class="group flex items-center text-zinc-400 hover:text-pink-400 font-medium transition-colors"><span class="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 ease-out text-pink-400">-</span> Terms of Service</a></li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-white/10 relative z-10">
        <p class="text-sm text-zinc-500 font-medium">© 2026 EventHub, Inc. Crafted for Creators.</p>
        
        <!-- Live System Status -->
        <div class="flex items-center gap-3 px-4 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-md">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span class="text-xs font-bold text-zinc-300 uppercase tracking-widest">All Systems Normal</span>
        </div>
      </div>
      
    </div>
  </footer>
</template>

<style scoped>
/* Smooth font rendering for dark mode */
.font-sans {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
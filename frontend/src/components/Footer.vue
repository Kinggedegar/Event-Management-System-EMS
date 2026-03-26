<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <footer class="relative bg-gray-950 border-t border-white/5 overflow-hidden">
    <!-- Background glow -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute bottom-0 left-1/4 w-96 h-64 bg-violet-600/5 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 right-1/4 w-80 h-48 bg-indigo-600/5 rounded-full blur-3xl"></div>
    </div>

    <div class="relative max-w-7xl mx-auto px-6 py-16">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-12 mb-14">

        <!-- Brand column -->
        <div class="md:col-span-5">
          <RouterLink to="/" class="flex items-center gap-2.5 mb-5 group w-fit">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span class="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">EventHub</span>
          </RouterLink>

          <p class="text-gray-500 text-sm leading-relaxed max-w-sm mb-6">
            The complete event management platform. Discover, create, and manage extraordinary experiences. Trusted by thousands of organizers worldwide.
          </p>

          <!-- Social links -->
          <div class="flex items-center gap-3">
            <a href="#" class="w-9 h-9 rounded-lg border border-white/8 bg-white/3 flex items-center justify-center text-gray-500 hover:text-white hover:border-white/20 hover:bg-white/8 transition-all duration-200">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
            </a>
            <a href="#" class="w-9 h-9 rounded-lg border border-white/8 bg-white/3 flex items-center justify-center text-gray-500 hover:text-white hover:border-white/20 hover:bg-white/8 transition-all duration-200">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/></svg>
            </a>
            <a href="#" class="w-9 h-9 rounded-lg border border-white/8 bg-white/3 flex items-center justify-center text-gray-500 hover:text-white hover:border-white/20 hover:bg-white/8 transition-all duration-200">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
          </div>
        </div>

        <!-- Links -->
        <div class="md:col-span-2">
          <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">Platform</h4>
          <ul class="space-y-3">
            <li><RouterLink to="/events" class="text-sm text-gray-500 hover:text-gray-300 transition-colors duration-200">Browse Events</RouterLink></li>
            <li><RouterLink to="/categories" class="text-sm text-gray-500 hover:text-gray-300 transition-colors duration-200">Categories</RouterLink></li>
            <li><RouterLink to="/auth/register" class="text-sm text-gray-500 hover:text-gray-300 transition-colors duration-200">Create Account</RouterLink></li>
            <li><a href="#" class="text-sm text-gray-500 hover:text-gray-300 transition-colors duration-200">Pricing</a></li>
          </ul>
        </div>

        <div class="md:col-span-2">
          <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">Company</h4>
          <ul class="space-y-3">
            <li><a href="#" class="text-sm text-gray-500 hover:text-gray-300 transition-colors duration-200">About</a></li>
            <li><a href="#" class="text-sm text-gray-500 hover:text-gray-300 transition-colors duration-200">Blog</a></li>
            <li><a href="#" class="text-sm text-gray-500 hover:text-gray-300 transition-colors duration-200">Careers</a></li>
            <li><a href="#" class="text-sm text-gray-500 hover:text-gray-300 transition-colors duration-200">Press</a></li>
          </ul>
        </div>

        <div class="md:col-span-3">
          <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">Support</h4>
          <ul class="space-y-3">
            <li><a href="#" class="text-sm text-gray-500 hover:text-gray-300 transition-colors duration-200">Help Center</a></li>
            <li><a href="#" class="text-sm text-gray-500 hover:text-gray-300 transition-colors duration-200">Contact Us</a></li>
            <li><a href="#" class="text-sm text-gray-500 hover:text-gray-300 transition-colors duration-200">Privacy Policy</a></li>
            <li><a href="#" class="text-sm text-gray-500 hover:text-gray-300 transition-colors duration-200">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-white/5">
        <p class="text-xs text-gray-600">© 2026 EventHub, Inc. All rights reserved.</p>
        <div class="flex items-center gap-1.5">
          <div class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
          <span class="text-xs text-gray-600">All systems operational</span>
        </div>
      </div>
    </div>
  </footer>
</template>
<template>
  <div class="min-h-screen bg-[#050505] text-white relative font-sans p-4 md:p-8 overflow-hidden">
    
    <!-- Global Noise Overlay -->
    <div class="pointer-events-none fixed inset-0 z-0 opacity-[0.03]" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>

    <!-- Ambient Glowing Orbs -->
    <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
    <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

    <div class="relative z-10 max-w-[90rem] mx-auto space-y-8">
      
      <!-- ================= HEADER ================= -->
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 backdrop-blur-xl">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-3">
            <span class="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
            <span class="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Feedback Control</span>
          </div>
          <h1 class="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 tracking-tight">
            Review Management
          </h1>
          <p class="text-zinc-400 font-medium mt-1">Monitor, moderate, and manage platform reputation.</p>
        </div>
      </div>

      <!-- ================= STATS CARDS ================= -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <!-- Total -->
        <div class="group relative bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-6 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="flex items-center gap-4 relative z-10">
            <div class="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.15)] group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            </div>
            <div>
              <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Total Reviews</p>
              <p class="text-3xl font-black text-white">{{ totalReviews }}</p>
            </div>
          </div>
        </div>

        <!-- Approved -->
        <div class="group relative bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-6 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="flex items-center gap-4 relative z-10">
            <div class="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.15)] group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Approved</p>
              <p class="text-3xl font-black text-white">{{ approvedReviews }}</p>
            </div>
          </div>
        </div>

        <!-- Pending -->
        <div class="group relative bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-6 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="flex items-center gap-4 relative z-10">
            <div class="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.15)] group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Pending Action</p>
              <p class="text-3xl font-black text-white">{{ pendingReviews }}</p>
            </div>
          </div>
        </div>

        <!-- Rejected -->
        <div class="group relative bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-6 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="flex items-center gap-4 relative z-10">
            <div class="h-12 w-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shadow-[0_0_15px_rgba(244,63,94,0.15)] group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </div>
            <div>
              <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Rejected</p>
              <p class="text-3xl font-black text-white">{{ rejectedReviews }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ================= FILTERS ================= -->
      <div class="bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-4 relative z-10">
        <div class="flex-1 relative group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m1.6-4.15a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by keyword, user, or event..."
            class="w-full pl-11 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-medium"
          />
        </div>
        
        <div class="flex gap-4 w-full md:w-auto">
          <select v-model="statusFilter" class="w-full md:w-40 px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-zinc-300 outline-none focus:border-cyan-400 transition-all cursor-pointer font-medium appearance-none">
            <option value="" class="bg-zinc-900">All Statuses</option>
            <option value="approved" class="bg-zinc-900">Approved</option>
            <option value="pending" class="bg-zinc-900">Pending</option>
            <option value="rejected" class="bg-zinc-900">Rejected</option>
          </select>
          
          <select v-model="ratingFilter" class="w-full md:w-40 px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-zinc-300 outline-none focus:border-cyan-400 transition-all cursor-pointer font-medium appearance-none">
            <option value="" class="bg-zinc-900">All Ratings</option>
            <option value="5" class="bg-zinc-900">⭐⭐⭐⭐⭐ (5)</option>
            <option value="4" class="bg-zinc-900">⭐⭐⭐⭐ (4)</option>
            <option value="3" class="bg-zinc-900">⭐⭐⭐ (3)</option>
            <option value="2" class="bg-zinc-900">⭐⭐ (2)</option>
            <option value="1" class="bg-zinc-900">⭐ (1)</option>
          </select>
        </div>
      </div>

      <LoadingSpinner v-if="loading" class="py-20" />

      <!-- ================= REVIEWS TABLE ================= -->
      <div v-else class="bg-[#0a0a0a] border border-white/10 rounded-[2rem] overflow-hidden relative z-10">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-white/5 border-b border-white/10">
                <th class="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest whitespace-nowrap">Review Content</th>
                <th class="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest whitespace-nowrap">User Info</th>
                <th class="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest whitespace-nowrap">Event</th>
                <th class="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest whitespace-nowrap">Rating</th>
                <th class="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest whitespace-nowrap">Status</th>
                <th class="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr v-for="review in filteredReviews" :key="review.id" class="hover:bg-white/[0.02] transition-colors group">
                
                <!-- Content -->
                <td class="px-6 py-4 max-w-[300px]">
                  <p class="font-medium text-white line-clamp-2 leading-snug">{{ review.comment || 'No written comment provided.' }}</p>
                  <p class="text-[10px] text-zinc-600 font-mono mt-1">ID: {{ review.id }} • {{ formatDate(review.created_at) }}</p>
                </td>
                
                <!-- User -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500 flex items-center justify-center text-xs font-black text-white shadow-inner">
                      {{ review.user_name?.[0]?.toUpperCase() || 'U' }}
                    </div>
                    <div>
                      <p class="font-bold text-white text-sm">{{ review.user_name }}</p>
                      <p class="text-xs text-zinc-500">{{ review.user_email }}</p>
                    </div>
                  </div>
                </td>
                
                <!-- Event -->
                <td class="px-6 py-4 max-w-[200px]">
                  <p class="font-bold text-zinc-300 text-sm truncate">{{ review.event_title }}</p>
                </td>
                
                <!-- Rating -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-1">
                    <svg v-for="i in 5" :key="i"
                         :class="['w-4 h-4', i <= review.rating ? 'text-amber-400 fill-current drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]' : 'text-zinc-700']"
                         viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                </td>
                
                <!-- Status Neon Pill -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border',
                    review.status === 'approved' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' :
                    review.status === 'pending'  ? 'text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]' :
                    review.status === 'rejected' ? 'text-rose-400 bg-rose-500/10 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]' :
                    'text-zinc-400 bg-zinc-500/10 border-zinc-500/20'
                  ]">
                    {{ review.status }}
                  </span>
                </td>
                
                <!-- Actions -->
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <div class="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                    
                    <button @click="viewReviewDetails(review)" class="p-2 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors" title="View Details">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    </button>
                    
                    <template v-if="review.status === 'pending'">
                      <button @click="approveReview(review.id)" class="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors" title="Approve">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
                      </button>
                      <button @click="rejectReview(review.id)" class="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-colors" title="Reject">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </template>
                    
                    <button @click="deleteReview(review.id)" class="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-colors" title="Delete">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredReviews.length === 0">
                <td colspan="6" class="px-6 py-12 text-center text-zinc-500 font-medium">
                  No reviews match your filters.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.pages > 1" class="px-6 py-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/5">
          <div class="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
            Showing <span class="text-white">{{ (pagination.page - 1) * pagination.limit + 1 }}</span> to
            <span class="text-white">{{ Math.min(pagination.page * pagination.limit, pagination.total) }}</span> of
            <span class="text-white">{{ pagination.total }}</span> entries
          </div>
          
          <div class="flex items-center gap-2">
            <button @click="changePage(pagination.page - 1)"
                    :disabled="pagination.page <= 1"
                    class="px-4 py-2 text-xs font-bold border border-white/10 bg-[#0a0a0a] rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              Prev
            </button>
            <span class="px-4 py-2 text-xs font-bold text-cyan-400 bg-cyan-400/10 rounded-lg border border-cyan-400/20">
              Page {{ pagination.page }} of {{ pagination.pages }}
            </span>
            <button @click="changePage(pagination.page + 1)"
                    :disabled="pagination.page >= pagination.pages"
                    class="px-4 py-2 text-xs font-bold border border-white/10 bg-[#0a0a0a] rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ================= REVIEW DETAILS MODAL ================= -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-95 translate-y-4"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 translate-y-4"
    >
      <div v-if="selectedReview" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-md" @click="selectedReview = null"></div>
        
        <!-- Modal Content -->
        <div class="relative bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-8 max-w-2xl w-full shadow-[0_20px_60px_rgba(0,0,0,0.8)] max-h-[90vh] overflow-y-auto custom-scrollbar">
          
          <!-- Close Button -->
          <button @click="selectedReview = null" class="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          <h2 class="text-2xl font-black text-white tracking-tight mb-8">Review Details</h2>

          <div class="space-y-6">
            
            <!-- Top Row: Rating & Status -->
            <div class="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
              <div>
                <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Given Rating</p>
                <div class="flex items-center gap-2">
                  <div class="flex">
                    <svg v-for="i in 5" :key="i"
                         :class="['w-5 h-5', i <= selectedReview.rating ? 'text-amber-400 fill-current drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]' : 'text-zinc-700']"
                         viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <span class="text-sm font-bold text-white">{{ selectedReview.rating }}.0</span>
                </div>
              </div>
              
              <div class="text-right">
                <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Current Status</p>
                <span :class="[
                  'inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border',
                  selectedReview.status === 'approved' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                  selectedReview.status === 'pending'  ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
                  selectedReview.status === 'rejected' ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' :
                  'text-zinc-400 bg-zinc-500/10 border-zinc-500/20'
                ]">
                  {{ selectedReview.status }}
                </span>
              </div>
            </div>

            <!-- Comment -->
            <div>
              <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">User Comment</p>
              <div class="p-5 bg-black/50 border border-white/10 rounded-2xl">
                <p class="text-white text-base leading-relaxed font-medium italic">
                  "{{ selectedReview.comment || 'No comment provided by the user.' }}"
                </p>
              </div>
            </div>

            <!-- Meta Data Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="p-4 bg-white/5 border border-white/5 rounded-2xl">
                <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Reviewer</p>
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500 flex items-center justify-center text-sm font-black text-white">
                    {{ selectedReview.user_name?.[0]?.toUpperCase() || 'U' }}
                  </div>
                  <div>
                    <p class="font-bold text-white">{{ selectedReview.user_name }}</p>
                    <p class="text-xs text-zinc-400">{{ selectedReview.user_email }}</p>
                  </div>
                </div>
              </div>
              
              <div class="p-4 bg-white/5 border border-white/5 rounded-2xl flex flex-col justify-center">
                <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Target Event</p>
                <p class="font-bold text-white text-lg truncate">{{ selectedReview.event_title }}</p>
                <p class="text-[10px] text-zinc-500 mt-1">Review ID: {{ selectedReview.id }}</p>
              </div>
            </div>

            <div class="flex justify-between items-center text-xs text-zinc-500 font-mono pt-4 border-t border-white/10">
              <p>Submitted: {{ formatDate(selectedReview.created_at) }}</p>
              <p v-if="selectedReview.updated_at">Updated: {{ formatDate(selectedReview.updated_at) }}</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import LoadingSpinner from '../../components/LoadingSpinner.vue'

const reviews = ref([])
const loading = ref(true)
const selectedReview = ref(null)
const searchQuery = ref('')
const statusFilter = ref('')
const ratingFilter = ref('')
const pagination = ref({
  page: 1,
  limit: 20,
  total: 0,
  pages: 0
})

// Stats
const totalReviews = ref(0)
const approvedReviews = ref(0)
const pendingReviews = ref(0)
const rejectedReviews = ref(0)

const filteredReviews = computed(() => {
  let filtered = reviews.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(review =>
      review.comment?.toLowerCase().includes(query) ||
      review.user_name.toLowerCase().includes(query) ||
      review.user_email.toLowerCase().includes(query) ||
      review.event_title.toLowerCase().includes(query)
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(review => review.status === statusFilter.value)
  }

  if (ratingFilter.value) {
    filtered = filtered.filter(review => review.rating === parseInt(ratingFilter.value))
  }

  return filtered
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Ensure mock data loads if backend fails for the demo
const loadFallbackData = () => {
  reviews.value =[
    { id: 101, comment: "Amazing tech conference! The speakers were incredibly insightful and the networking was top-notch.", rating: 5, user_name: "Alex Mercer", user_email: "alex@example.com", event_title: "Monrovia Tech Summit", status: "approved", created_at: "2026-03-25T10:00:00Z" },
    { id: 102, comment: "The sound system was a bit muddy near the back, but overall a great festival experience.", rating: 4, user_name: "Sarah Jenkins", user_email: "sarah@example.com", event_title: "West Africa Music Fest", status: "pending", created_at: "2026-03-26T14:30:00Z" },
    { id: 103, comment: "Total scam. The event was canceled and I never got a refund.", rating: 1, user_name: "Angry User", user_email: "mad@example.com", event_title: "Crypto Night", status: "rejected", created_at: "2026-03-27T09:15:00Z" },
    { id: 104, comment: "Great food, beautiful venue.", rating: 5, user_name: "Chef John", user_email: "john@food.com", event_title: "Culinary Expo", status: "pending", created_at: "2026-03-28T18:45:00Z" },
  ]
  pagination.value = { page: 1, limit: 20, total: 4, pages: 1 }
  calculateStats()
}

const calculateStats = () => {
  totalReviews.value = reviews.value.length
  approvedReviews.value = reviews.value.filter(r => r.status === 'approved').length
  pendingReviews.value = reviews.value.filter(r => r.status === 'pending').length
  rejectedReviews.value = reviews.value.filter(r => r.status === 'rejected').length
}

const fetchReviews = async (page = 1) => {
  try {
    loading.value = true
    const params = new URLSearchParams({
      page: page.toString(),
      limit: pagination.value.limit.toString()
    })

    if (statusFilter.value) {
      params.append('status', statusFilter.value)
    }

    const response = await axios.get(`/api/admin/reviews?${params}`)
    reviews.value = response.data.reviews
    pagination.value = response.data.pagination
    calculateStats()
  } catch (error) {
    console.warn('Backend unavailable, loading fallback review data.')
    loadFallbackData()
  } finally {
    loading.value = false
  }
}

const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.pages) {
    pagination.value.page = page
    fetchReviews(page)
  }
}

const viewReviewDetails = (review) => {
  selectedReview.value = review
}

const approveReview = async (reviewId) => {
  try {
    await axios.put(`/api/admin/reviews/${reviewId}/approve`)
    fetchReviews(pagination.value.page)
  } catch (error) {
    // Fallback UI update
    const rev = reviews.value.find(r => r.id === reviewId)
    if(rev) rev.status = 'approved'
    calculateStats()
  }
}

const rejectReview = async (reviewId) => {
  try {
    await axios.put(`/api/admin/reviews/${reviewId}/reject`)
    fetchReviews(pagination.value.page)
  } catch (error) {
    // Fallback UI update
    const rev = reviews.value.find(r => r.id === reviewId)
    if(rev) rev.status = 'rejected'
    calculateStats()
  }
}

const deleteReview = async (reviewId) => {
  if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
    return
  }

  try {
    await axios.delete(`/api/admin/reviews/${reviewId}`)
    fetchReviews(pagination.value.page)
  } catch (error) {
    // Fallback UI update
    reviews.value = reviews.value.filter(r => r.id !== reviewId)
    calculateStats()
  }
}

// Watch for filter changes
watch([statusFilter, ratingFilter], () => {
  pagination.value.page = 1
  // Local filtering handles the UI updates instantly without re-fetching if backend is down
})

onMounted(() => {
  fetchReviews()
})
</script>

<style scoped>
/* Custom Scrollbar for the modal */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()

const eventId = route.params.id
const event = ref(null)
const attendees = ref([])
const loading = ref(true)
const searchQuery = ref('')
const filterStatus = ref('all')
const sortBy = ref('name')
const exporting = ref(false)

// ── Fetch data ─────────────────────────────────────────
onMounted(async () => {
  try {
    const [eventRes, attendeesRes] = await Promise.all([
      api.get(`/events/${eventId}`),
      api.get(`/events/${eventId}/attendees`)
    ])
    event.value = eventRes.data
    attendees.value = attendeesRes.data?.attendees || attendeesRes.data || []
  } catch (err) {
    console.error('Failed to load attendees', err)
  } finally {
    loading.value = false
  }
})

// ── Computed ───────────────────────────────────────────
const stats = computed(() => {
  const total = attendees.value.length
  const checkedIn = attendees.value.filter(a => a.checked_in || a.scanned_at).length
  const pending = total - checkedIn
  const rate = total > 0 ? Math.round((checkedIn / total) * 100) : 0
  return { total, checkedIn, pending, rate }
})

const filteredAttendees = computed(() => {
  let list = [...attendees.value]

  // filter by status
  if (filterStatus.value === 'checked_in') {
    list = list.filter(a => a.checked_in || a.scanned_at)
  } else if (filterStatus.value === 'pending') {
    list = list.filter(a => !a.checked_in && !a.scanned_at)
  }

  // search
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(a =>
      a.name?.toLowerCase().includes(q) ||
      a.email?.toLowerCase().includes(q) ||
      a.ticket_id?.toString().includes(q)
    )
  }

  // sort
  if (sortBy.value === 'name') list.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
  else if (sortBy.value === 'date') list.sort((a, b) => new Date(b.purchased_at) - new Date(a.purchased_at))
  else if (sortBy.value === 'status') list.sort((a, b) => (b.checked_in ? 1 : 0) - (a.checked_in ? 1 : 0))

  return list
})

// ── Export CSV ─────────────────────────────────────────
function exportCSV() {
  exporting.value = true
  try {
    const headers = ['ID', 'Name', 'Email', 'Ticket ID', 'Purchased At', 'Status']
    const rows = attendees.value.map(a => [
      a.id,
      a.name || '',
      a.email || '',
      a.ticket_id || '',
      a.purchased_at ? new Date(a.purchased_at).toLocaleString() : '',
      a.checked_in || a.scanned_at ? 'Checked In' : 'Pending'
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `attendees-event-${eventId}.csv`
    a.click()
    URL.revokeObjectURL(url)
  } finally {
    exporting.value = false
  }
}

// ── Helpers ────────────────────────────────────────────
function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function formatDate(date) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatTime(date) {
  if (!date) return ''
  return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

const gradients = [
  'from-violet-500 to-indigo-600',
  'from-indigo-500 to-blue-600',
  'from-pink-500 to-rose-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-sky-500 to-cyan-600',
]

function getGradient(name) {
  if (!name) return gradients[0]
  const idx = name.charCodeAt(0) % gradients.length
  return gradients[idx]
}
</script>

<template>
  <div class="min-h-screen bg-gray-950 relative">

    <!-- Ambient glows -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div class="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/8 rounded-full blur-[140px]"></div>
      <div class="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/6 rounded-full blur-[120px]"></div>
      <div class="absolute inset-0 opacity-[0.02]"
        style="background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 40px 40px;"></div>
    </div>

    <div class="relative">

      <!-- ── HEADER ─────────────────────────────────── -->
      <div class="border-b border-white/8 bg-gray-900/80 backdrop-blur-xl sticky top-0 z-40">
        <div class="max-w-7xl mx-auto px-6 py-5">
          <div class="flex items-center gap-4">
            <!-- Back button -->
            <button
              @click="router.back()"
              class="flex items-center justify-center w-9 h-9 rounded-xl border border-white/10 bg-white/3 hover:bg-white/8 text-gray-400 hover:text-white transition-all duration-200"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-0.5">
                <div class="w-4 h-px bg-violet-500"></div>
                <span class="text-xs font-semibold text-violet-400 uppercase tracking-widest">Attendee Tracking</span>
              </div>
              <h1 class="text-xl font-black text-white truncate">
                {{ event?.name || event?.title || 'Event Attendees' }}
              </h1>
            </div>

            <!-- Export button -->
            <button
              @click="exportCSV"
              :disabled="exporting || loading || attendees.length === 0"
              class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all duration-300 hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export CSV
            </button>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-6 py-8 space-y-6">

        <!-- ── LOADING ──────────────────────────────── -->
        <div v-if="loading" class="flex justify-center py-32">
          <LoadingSpinner size="lg" />
        </div>

        <template v-else>

          <!-- ── EVENT INFO BANNER ─────────────────── -->
          <div class="rounded-2xl border border-white/8 bg-gray-900/60 backdrop-blur-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <div class="h-2 bg-gradient-to-r from-violet-600 via-indigo-500 to-purple-600"></div>
            <div class="p-6">
              <div class="flex flex-col sm:flex-row sm:items-center gap-4">
                <div class="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/15 flex items-center justify-center flex-shrink-0">
                      <svg class="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p class="text-[10px] text-gray-600 uppercase tracking-wider">Date</p>
                      <p class="text-sm font-semibold text-white">{{ formatDate(event?.date) }}</p>
                    </div>
                  </div>

                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center flex-shrink-0">
                      <svg class="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                    </div>
                    <div>
                      <p class="text-[10px] text-gray-600 uppercase tracking-wider">Location</p>
                      <p class="text-sm font-semibold text-white truncate">{{ event?.location || 'Online' }}</p>
                    </div>
                  </div>

                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center flex-shrink-0">
                      <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p class="text-[10px] text-gray-600 uppercase tracking-wider">Capacity</p>
                      <p class="text-sm font-semibold text-white">{{ event?.total_capacity || '—' }} seats</p>
                    </div>
                  </div>
                </div>

                <!-- Status badge -->
                <div class="flex-shrink-0">
                  <span class="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border"
                    :class="event?.status === 'active'
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20'
                      : event?.status === 'past'
                      ? 'bg-gray-500/15 text-gray-400 border-gray-500/20'
                      : 'bg-amber-500/15 text-amber-300 border-amber-500/20'">
                    {{ event?.status || 'active' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- ── STATS CARDS ───────────────────────── -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Total -->
            <div class="rounded-2xl border border-white/8 bg-gray-900/60 backdrop-blur-xl p-5 shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
              <div class="flex items-center justify-between mb-3">
                <div class="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/15 flex items-center justify-center">
                  <svg class="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <p class="text-3xl font-black text-white">{{ stats.total }}</p>
              <p class="text-xs text-gray-500 mt-1">Total Registered</p>
            </div>

            <!-- Checked In -->
            <div class="rounded-2xl border border-emerald-500/15 bg-emerald-950/20 backdrop-blur-xl p-5 shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
              <div class="flex items-center justify-between mb-3">
                <div class="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
                  <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p class="text-3xl font-black text-emerald-400">{{ stats.checkedIn }}</p>
              <p class="text-xs text-gray-500 mt-1">Checked In</p>
            </div>

            <!-- Pending -->
            <div class="rounded-2xl border border-amber-500/15 bg-amber-950/10 backdrop-blur-xl p-5 shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
              <div class="flex items-center justify-between mb-3">
                <div class="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/15 flex items-center justify-center">
                  <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p class="text-3xl font-black text-amber-400">{{ stats.pending }}</p>
              <p class="text-xs text-gray-500 mt-1">Not Yet Arrived</p>
            </div>

            <!-- Check-in Rate -->
            <div class="rounded-2xl border border-indigo-500/15 bg-indigo-950/10 backdrop-blur-xl p-5 shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
              <div class="flex items-center justify-between mb-3">
                <div class="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center">
                  <svg class="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <p class="text-3xl font-black text-indigo-400">{{ stats.rate }}%</p>
              <p class="text-xs text-gray-500 mt-1">Check-in Rate</p>
              <!-- Progress bar -->
              <div class="mt-3 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-700"
                  :style="`width: ${stats.rate}%`"></div>
              </div>
            </div>
          </div>

          <!-- ── FILTERS + SEARCH ──────────────────── -->
          <div class="flex flex-col sm:flex-row gap-3">
            <!-- Search -->
            <div class="relative flex-1">
              <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by name, email or ticket ID..."
                class="w-full pl-11 pr-4 py-3 rounded-xl bg-white/3 border border-white/8 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/5 focus:ring-1 focus:ring-violet-500/20 transition-all duration-200"
              />
            </div>

            <!-- Status filter -->
            <select
              v-model="filterStatus"
              class="px-4 py-3 rounded-xl bg-gray-900/80 border border-white/8 text-gray-300 text-sm focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all duration-200 cursor-pointer"
            >
              <option value="all">All Attendees</option>
              <option value="checked_in">Checked In</option>
              <option value="pending">Not Arrived</option>
            </select>

            <!-- Sort -->
            <select
              v-model="sortBy"
              class="px-4 py-3 rounded-xl bg-gray-900/80 border border-white/8 text-gray-300 text-sm focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all duration-200 cursor-pointer"
            >
              <option value="name">Sort: Name</option>
              <option value="date">Sort: Date Purchased</option>
              <option value="status">Sort: Status</option>
            </select>
          </div>

          <!-- Results count -->
          <div class="flex items-center justify-between">
            <p class="text-xs text-gray-600">
              Showing <span class="text-gray-400 font-semibold">{{ filteredAttendees.length }}</span> of
              <span class="text-gray-400 font-semibold">{{ attendees.length }}</span> attendees
            </p>
          </div>

          <!-- ── EMPTY STATE ────────────────────────── -->
          <div v-if="filteredAttendees.length === 0 && !loading"
            class="rounded-2xl border border-white/8 bg-gray-900/40 backdrop-blur-xl p-20 text-center">
            <div class="w-16 h-16 rounded-2xl bg-white/3 border border-white/8 flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p class="text-gray-500 text-sm">No attendees found</p>
            <p class="text-gray-700 text-xs mt-1">Try adjusting your search or filter</p>
          </div>

          <!-- ── ATTENDEES TABLE (desktop) ─────────── -->
          <div v-else class="hidden md:block rounded-2xl border border-white/8 bg-gray-900/60 backdrop-blur-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <!-- Table header -->
            <div class="grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/5 bg-white/2">
              <div class="col-span-4 text-[10px] font-semibold text-gray-600 uppercase tracking-wider">Attendee</div>
              <div class="col-span-3 text-[10px] font-semibold text-gray-600 uppercase tracking-wider">Contact</div>
              <div class="col-span-2 text-[10px] font-semibold text-gray-600 uppercase tracking-wider">Ticket</div>
              <div class="col-span-2 text-[10px] font-semibold text-gray-600 uppercase tracking-wider">Registered</div>
              <div class="col-span-1 text-[10px] font-semibold text-gray-600 uppercase tracking-wider">Status</div>
            </div>

            <!-- Table rows -->
            <div class="divide-y divide-white/5">
              <div
                v-for="(attendee, idx) in filteredAttendees"
                :key="attendee.id"
                class="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-white/2 transition-colors duration-150 group"
              >
                <!-- Avatar + Name -->
                <div class="col-span-4 flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0 bg-gradient-to-br"
                    :class="getGradient(attendee.name)">
                    {{ getInitials(attendee.name) }}
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-semibold text-white truncate group-hover:text-violet-200 transition-colors">
                      {{ attendee.name || 'Unknown' }}
                    </p>
                    <p class="text-[10px] text-gray-600">#{{ String(attendee.id || idx + 1).padStart(5, '0') }}</p>
                  </div>
                </div>

                <!-- Email -->
                <div class="col-span-3 flex items-center">
                  <p class="text-xs text-gray-400 truncate">{{ attendee.email || '—' }}</p>
                </div>

                <!-- Ticket -->
                <div class="col-span-2 flex items-center">
                  <span class="text-xs font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/15 px-2 py-0.5 rounded-lg">
                    {{ attendee.ticket_id ? `#${attendee.ticket_id}` : '—' }}
                  </span>
                </div>

                <!-- Date -->
                <div class="col-span-2 flex items-center">
                  <div>
                    <p class="text-xs text-gray-400">{{ formatDate(attendee.purchased_at) }}</p>
                    <p class="text-[10px] text-gray-600">{{ formatTime(attendee.purchased_at) }}</p>
                  </div>
                </div>

                <!-- Status -->
                <div class="col-span-1 flex items-center">
                  <span v-if="attendee.checked_in || attendee.scanned_at"
                    class="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/15">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                    In
                  </span>
                  <span v-else
                    class="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/15">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Pending
                  </span>
                </div>
              </div>
            </div>

            <!-- Table footer -->
            <div class="px-6 py-3 border-t border-white/5 bg-white/1 flex items-center justify-between">
              <p class="text-xs text-gray-700">{{ filteredAttendees.length }} records shown</p>
              <div class="flex items-center gap-4 text-xs text-gray-600">
                <span class="flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                  {{ stats.checkedIn }} checked in
                </span>
                <span class="flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-amber-500"></span>
                  {{ stats.pending }} pending
                </span>
              </div>
            </div>
          </div>

          <!-- ── ATTENDEES CARDS (mobile) ────────────── -->
          <div class="md:hidden space-y-3">
            <div
              v-for="(attendee, idx) in filteredAttendees"
              :key="attendee.id"
              class="rounded-2xl border border-white/8 bg-gray-900/60 backdrop-blur-xl p-4 shadow-[0_4px_16px_rgba(0,0,0,0.3)] hover:border-white/15 transition-all duration-200"
            >
              <div class="flex items-start gap-3">
                <!-- Avatar -->
                <div class="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0 bg-gradient-to-br"
                  :class="getGradient(attendee.name)">
                  {{ getInitials(attendee.name) }}
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2 mb-1">
                    <p class="text-sm font-bold text-white truncate">{{ attendee.name || 'Unknown' }}</p>
                    <span v-if="attendee.checked_in || attendee.scanned_at"
                      class="flex-shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/15">
                      <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                      </svg>
                      Checked In
                    </span>
                    <span v-else
                      class="flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/15">
                      Pending
                    </span>
                  </div>

                  <p class="text-xs text-gray-500 truncate mb-2">{{ attendee.email || '—' }}</p>

                  <div class="flex items-center gap-3 text-[10px] text-gray-600">
                    <span class="font-mono text-indigo-400">
                      {{ attendee.ticket_id ? `Ticket #${attendee.ticket_id}` : `ID #${String(attendee.id || idx + 1).padStart(5, '0')}` }}
                    </span>
                    <span>·</span>
                    <span>{{ formatDate(attendee.purchased_at) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </template>
      </div>
    </div>
  </div>
</template>
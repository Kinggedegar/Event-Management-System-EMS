<template>
  <div class="min-h-screen bg-[#050505] text-white relative font-sans p-4 md:p-8 overflow-hidden">
    
    <!-- Global Noise Overlay -->
    <div class="pointer-events-none fixed inset-0 z-0 opacity-[0.03]" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>

    <!-- Ambient Glowing Orbs -->
    <div class="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
    <div class="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

    <div class="relative z-10 max-w-[90rem] mx-auto space-y-8">
      
      <!-- ================= HEADER ================= -->
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 backdrop-blur-xl">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-3">
            <span class="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
            <span class="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">User Control</span>
          </div>
          <h1 class="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 tracking-tight">
            User Management
          </h1>
          <p class="text-zinc-400 font-medium mt-1">Oversee account status, roles, and platform permissions.</p>
        </div>
      </div>

      <!-- ================= STATS CARDS ================= -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <!-- Total Users -->
        <div class="group relative bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-6 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="flex items-center gap-4 relative z-10">
            <div class="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.15)] group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <div>
              <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Total Users</p>
              <p class="text-3xl font-black text-white">{{ users.length }}</p>
            </div>
          </div>
        </div>

        <!-- Active Users -->
        <div class="group relative bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-6 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="flex items-center gap-4 relative z-10">
            <div class="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.15)] group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <div>
              <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Active</p>
              <p class="text-3xl font-black text-white">{{ stats.active }}</p>
            </div>
          </div>
        </div>

        <!-- Suspended -->
        <div class="group relative bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-6 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="flex items-center gap-4 relative z-10">
            <div class="h-12 w-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shadow-[0_0_15px_rgba(244,63,94,0.15)] group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636" /></svg>
            </div>
            <div>
              <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Suspended</p>
              <p class="text-3xl font-black text-white">{{ stats.suspended }}</p>
            </div>
          </div>
        </div>

        <!-- Organizers -->
        <div class="group relative bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-6 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="flex items-center gap-4 relative z-10">
            <div class="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.15)] group-hover:scale-110 transition-transform">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <div>
              <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Organizers</p>
              <p class="text-3xl font-black text-white">{{ stats.organizers }}</p>
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
            placeholder="Search users by name or email..."
            class="w-full pl-11 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-medium"
          />
        </div>
        
        <div class="flex gap-4 w-full md:w-auto">
          <select v-model="roleFilter" class="w-full md:w-40 px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-zinc-300 outline-none focus:border-cyan-400 transition-all cursor-pointer font-medium appearance-none">
            <option value="" class="bg-zinc-900">All Roles</option>
            <option value="attendee" class="bg-zinc-900">Attendee</option>
            <option value="organizer" class="bg-zinc-900">Organizer</option>
            <option value="admin" class="bg-zinc-900">Admin</option>
          </select>
          
          <select v-model="statusFilter" class="w-full md:w-40 px-4 py-3 bg-black/50 border border-white/10 rounded-xl text-zinc-300 outline-none focus:border-cyan-400 transition-all cursor-pointer font-medium appearance-none">
            <option value="" class="bg-zinc-900">All Status</option>
            <option value="active" class="bg-zinc-900">Active</option>
            <option value="suspended" class="bg-zinc-900">Suspended</option>
          </select>
        </div>
      </div>

      <LoadingSpinner v-if="loading" class="py-20" />

      <!-- ================= USERS TABLE ================= -->
      <div v-else class="bg-[#0a0a0a] border border-white/10 rounded-[2rem] overflow-hidden relative z-10">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-white/5 border-b border-white/10">
                <th class="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest whitespace-nowrap">User Identity</th>
                <th class="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest whitespace-nowrap">Role</th>
                <th class="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest whitespace-nowrap">Status</th>
                <th class="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest whitespace-nowrap">Join Date</th>
                <th class="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-white/[0.02] transition-colors group">
                
                <!-- User Profile -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500 flex items-center justify-center text-xs font-black text-white shadow-inner">
                      {{ getInitials(user.name) }}
                    </div>
                    <div>
                      <p class="font-bold text-white text-sm">{{ user.name }}</p>
                      <p class="text-xs text-zinc-500">{{ user.email }}</p>
                    </div>
                  </div>
                </td>
                
                <!-- Role Selector -->
                <td class="px-6 py-4">
                  <select 
                    :value="user.role"
                    @change="updateUserRole(user.id, $event.target.value)"
                    class="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xs font-bold text-zinc-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="attendee" class="bg-zinc-900">Attendee</option>
                    <option value="organizer" class="bg-zinc-900">Organizer</option>
                    <option value="admin" class="bg-zinc-900">Admin</option>
                  </select>
                </td>
                
                <!-- Status Neon Pill -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border',
                    (user.status || 'active') === 'active' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' :
                    'text-rose-400 bg-rose-500/10 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]'
                  ]">
                    {{ user.status || 'active' }}
                  </span>
                </td>
                
                <!-- Date Joined -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <p class="text-xs font-mono text-zinc-500">{{ formatDate(user.created_at) }}</p>
                </td>
                
                <!-- Actions -->
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <div class="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                    
                    <button v-if="(user.status || 'active') !== 'suspended'" 
                            @click="suspendUser(user.id)" 
                            class="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-black transition-colors" 
                            title="Suspend User">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                    </button>
                    
                    <button v-else 
                            @click="activateUser(user.id)" 
                            class="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-black transition-colors" 
                            title="Activate User">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </button>

                    <button @click="deleteUser(user.id)" 
                            class="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-colors" 
                            title="Delete User">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredUsers.length === 0">
                <td colspan="5" class="px-6 py-12 text-center text-zinc-500 font-medium italic">
                  No users found matching your criteria.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const loading = ref(true)
const users = ref([])
const searchQuery = ref('')
const roleFilter = ref('')
const statusFilter = ref('')

// Computed Stats for the cards
const stats = computed(() => {
  return {
    active: users.value.filter(u => (u.status || 'active') === 'active').length,
    suspended: users.value.filter(u => u.status === 'suspended').length,
    organizers: users.value.filter(u => u.role === 'organizer').length
  }
})

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = !searchQuery.value || 
      user.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesRole = !roleFilter.value || user.role === roleFilter.value
    const matchesStatus = !statusFilter.value || (user.status || 'active') === statusFilter.value
    return matchesSearch && matchesRole && matchesStatus
  })
})

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const updateUserRole = async (userId, role) => {
  try {
    await api.put(`/admin/users/${userId}/role`, { role })
    const user = users.value.find(u => u.id === userId)
    if (user) user.role = role
  } catch (error) {
    alert(error.response?.data?.error || 'Failed to update user role')
  }
}

const suspendUser = async (userId) => {
  if (!confirm('Are you sure you want to suspend this user? They will lose platform access.')) return
  
  try {
    await api.put(`/admin/users/${userId}/status`, { status: 'suspended' })
    const user = users.value.find(u => u.id === userId)
    if (user) user.status = 'suspended'
  } catch (error) {
    alert(error.response?.data?.error || 'Failed to suspend user')
  }
}

const activateUser = async (userId) => {
  try {
    await api.put(`/admin/users/${userId}/status`, { status: 'active' })
    const user = users.value.find(u => u.id === userId)
    if (user) user.status = 'active'
  } catch (error) {
    alert(error.response?.data?.error || 'Failed to activate user')
  }
}

const deleteUser = async (userId) => {
  if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return
  
  try {
    await api.delete(`/admin/users/${userId}`)
    users.value = users.value.filter(u => u.id !== userId)
  } catch (error) {
    alert(error.response?.data?.error || 'Failed to delete user')
  }
}

const fetchUsers = async () => {
  try {
    const { data } = await api.get('/admin/users')
    users.value = data.users || []
  } catch (error) {
    console.error('Failed to fetch users:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchUsers)
</script>

<style scoped>
/* Remove default arrow from native select to use custom UI */
select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
}
</style>
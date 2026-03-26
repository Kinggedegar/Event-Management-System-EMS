<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-foreground">User Management</h1>
        <p class="text-muted-foreground">Manage all platform users</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-4">
      <div class="flex-1 min-w-[200px]">
        <input 
          v-model="searchQuery"
          type="text"
          placeholder="Search users..."
          class="w-full px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <select v-model="roleFilter" 
              class="px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
        <option value="">All Roles</option>
        <option value="attendee">Attendee</option>
        <option value="organizer">Organizer</option>
        <option value="admin">Admin</option>
      </select>
      <select v-model="statusFilter" 
              class="px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="suspended">Suspended</option>
      </select>
    </div>

    <LoadingSpinner v-if="loading" />

    <div v-else class="bg-card border border-border rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-muted/50">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">User</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Role</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Joined</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-muted/30">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span class="text-sm font-medium text-primary">{{ getInitials(user.name) }}</span>
                  </div>
                  <div>
                    <p class="font-medium text-foreground">{{ user.name }}</p>
                    <p class="text-sm text-muted-foreground">{{ user.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3">
                <select 
                  :value="user.role"
                  @change="updateUserRole(user.id, $event.target.value)"
                  class="px-2 py-1 bg-background border border-input rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="attendee">Attendee</option>
                  <option value="organizer">Organizer</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td class="px-4 py-3">
                <span :class="user.status === 'active' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'"
                      class="px-2 py-0.5 rounded-full text-xs font-medium capitalize">
                  {{ user.status || 'active' }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-muted-foreground">
                {{ formatDate(user.created_at) }}
              </td>
              <td class="px-4 py-3">
                <div class="flex gap-2">
                  <button 
                    v-if="user.status !== 'suspended'"
                    @click="suspendUser(user.id)"
                    class="text-sm text-violet-600 hover:underline"
                  >
                    Suspend
                  </button>
                  <button 
                    v-else
                    @click="activateUser(user.id)"
                    class="text-sm text-green-600 hover:underline"
                  >
                    Activate
                  </button>
                  <button 
                    @click="deleteUser(user.id)"
                    class="text-sm text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredUsers.length === 0">
              <td colspan="5" class="px-4 py-8 text-center text-muted-foreground">
                No users found
              </td>
            </tr>
          </tbody>
        </table>
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
  if (!confirm('Are you sure you want to suspend this user?')) return
  
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

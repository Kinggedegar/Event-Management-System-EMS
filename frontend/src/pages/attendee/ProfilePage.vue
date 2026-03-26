<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-foreground">My Profile</h1>
      <p class="text-muted-foreground">Manage your account settings</p>
    </div>

    <div class="bg-card border border-border rounded-xl p-6">
      <form @submit.prevent="updateProfile" class="space-y-4">
        <div class="flex items-center gap-4 mb-6">
          <div class="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <span class="text-2xl font-bold text-primary">{{ getInitials(form.name) }}</span>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-foreground">{{ authStore.user?.name }}</h2>
            <p class="text-sm text-muted-foreground">{{ authStore.user?.email }}</p>
            <span class="inline-block px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full mt-1 capitalize">
              {{ authStore.user?.role }}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-foreground mb-1">Full Name</label>
            <input 
              v-model="form.name"
              type="text"
              class="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Your name"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-foreground mb-1">Email</label>
            <input 
              v-model="form.email"
              type="email"
              class="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-foreground mb-1">Phone Number</label>
          <input 
            v-model="form.phone"
            type="tel"
            class="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div class="pt-4">
          <button 
            type="submit" 
            :disabled="saving"
            class="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Change Password -->
    <div class="bg-card border border-border rounded-xl p-6">
      <h3 class="text-lg font-semibold text-foreground mb-4">Change Password</h3>
      <form @submit.prevent="changePassword" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-foreground mb-1">Current Password</label>
          <input 
            v-model="passwordForm.currentPassword"
            type="password"
            class="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-foreground mb-1">New Password</label>
          <input 
            v-model="passwordForm.newPassword"
            type="password"
            class="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-foreground mb-1">Confirm New Password</label>
          <input 
            v-model="passwordForm.confirmPassword"
            type="password"
            class="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button 
          type="submit" 
          :disabled="changingPassword"
          class="w-full px-4 py-2 border border-input rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
        >
          {{ changingPassword ? 'Changing...' : 'Change Password' }}
        </button>
      </form>
    </div>

    <!-- Danger Zone -->
    <div class="bg-card border border-red-200 rounded-xl p-6">
      <h3 class="text-lg font-semibold text-red-600 mb-2">Danger Zone</h3>
      <p class="text-sm text-muted-foreground mb-4">
        Once you delete your account, there is no going back. Please be certain.
      </p>
      <button 
        @click="deleteAccount"
        class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Delete Account
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'

const authStore = useAuthStore()

const form = ref({
  name: '',
  email: '',
  phone: ''
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const saving = ref(false)
const changingPassword = ref(false)

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const updateProfile = async () => {
  saving.value = true
  try {
    const { data } = await api.put('/users/profile', form.value)
    authStore.user = data.user
    alert('Profile updated successfully!')
  } catch (error) {
    alert(error.response?.data?.error || 'Failed to update profile')
  } finally {
    saving.value = false
  }
}

const changePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert('New passwords do not match')
    return
  }
  
  changingPassword.value = true
  try {
    await api.put('/users/password', {
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword
    })
    passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
    alert('Password changed successfully!')
  } catch (error) {
    alert(error.response?.data?.error || 'Failed to change password')
  } finally {
    changingPassword.value = false
  }
}

const deleteAccount = async () => {
  if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) return
  
  try {
    await api.delete('/users/account')
    authStore.logout()
  } catch (error) {
    alert(error.response?.data?.error || 'Failed to delete account')
  }
}

onMounted(() => {
  if (authStore.user) {
    form.value = {
      name: authStore.user.name || '',
      email: authStore.user.email || '',
      phone: authStore.user.phone || ''
    }
  }
})
</script>

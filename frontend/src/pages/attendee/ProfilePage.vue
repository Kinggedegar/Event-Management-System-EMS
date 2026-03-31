<template>
  <div class="min-h-screen bg-[#050505] text-white relative font-sans p-4 md:p-8 overflow-x-hidden">
    
    <!-- Global Decorative Elements -->
    <div class="pointer-events-none fixed inset-0 z-0 opacity-[0.03]" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>
    <div class="absolute top-0 left-0 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
    <div class="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

    <div class="relative z-10 max-w-[90rem] mx-auto space-y-8">
      
      <!-- ================= HEADER ================= -->
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
            <span class="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
            <span class="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Authorized Identity: {{ authStore.user?.username || 'Guest' }}</span>
          </div>
          <h1 class="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 tracking-tighter">
            Account Dossier
          </h1>
          <p class="text-zinc-400 font-medium mt-1">Manage your platform identity, credentials, and operational preferences.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <!-- ================= LEFT COLUMN ================= -->
        <div class="lg:col-span-4 space-y-6">
          <div class="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl group">
            <div class="h-32 bg-gradient-to-br from-violet-600/20 to-cyan-600/20 relative">
               <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 20px 20px;"></div>
               <span :class="roleBadgeClass" class="absolute top-4 right-4 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border backdrop-blur-xl">
                  {{ authStore.user?.role }}
               </span>
            </div>

            <div class="px-8 pb-8">
              <div class="relative -mt-12 mb-6 w-fit mx-auto lg:mx-0">
                <div class="w-24 h-24 rounded-[2rem] border-4 border-[#0a0a0a] bg-zinc-900 overflow-hidden shadow-2xl relative">
                  <img v-if="avatarPreview || form.avatar_url" :src="avatarPreview || form.avatar_url" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full bg-gradient-to-tr from-zinc-800 to-zinc-700 flex items-center justify-center">
                    <span class="text-3xl font-black text-white">{{ getInitials(form.name) }}</span>
                  </div>
                </div>
                <button @click="$refs.avatarInput.click()" class="absolute inset-0 w-full h-full rounded-[2rem] bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center border-4 border-[#0a0a0a]">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke-width="2"/><path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2"/></svg>
                </button>
                <input ref="avatarInput" type="file" accept="image/*" class="hidden" @change="handleAvatarChange" />
              </div>

              <div class="text-center lg:text-left space-y-1">
                <h2 class="text-2xl font-black text-white tracking-tight">{{ form.name }}</h2>
                <p class="text-sm font-mono text-zinc-500 uppercase tracking-tighter">{{ form.email }}</p>
              </div>

              <div class="flex gap-2 mt-6">
                <button @click="$refs.avatarInput.click()" class="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-300 hover:text-white hover:bg-white/10 transition-all">Upload Photo</button>
                <button v-if="avatarPreview || form.avatar_url" @click="removeAvatar" class="px-4 py-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2"/></svg>
                </button>
              </div>
            </div>
          </div>

          <div class="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden p-2">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 group"
              :class="activeTab === tab.id ? 'bg-white text-black shadow-xl' : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'"
            >
              <svg class="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path :d="tab.icon" stroke-width="2.5"/></svg>
              {{ tab.label }}
            </button>
          </div>
        </div>

        <!-- ================= RIGHT COLUMN: TERMINAL CONTENT ================= -->
        <div class="lg:col-span-8">
          <Transition name="fade" mode="out-in">
            <!-- 1. PERSONAL INFO -->
            <div v-if="activeTab === 'personal'" key="personal" class="bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-8 md:p-12 space-y-10">
              <div class="flex items-center justify-between">
                <h3 class="text-[11px] font-black text-zinc-500 uppercase tracking-[0.4em]">Section 01 // Biological Identity</h3>
                <span class="text-[9px] font-mono text-zinc-700">READ_WRITE_ENABLED</span>
              </div>
              <form @submit.prevent="updateProfile" class="space-y-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Full Legal Name</label>
                    <input v-model="form.name" type="text" class="terminal-input" />
                  </div>
                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Universal Handle</label>
                    <div class="relative">
                      <span class="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 font-mono text-sm">@</span>
                      <input v-model="form.username" type="text" class="terminal-input pl-10" />
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Terminal Address</label>
                    <input v-model="form.email" type="email" class="terminal-input opacity-60" readonly />
                  </div>
                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Comms Frequency</label>
                    <input v-model="form.phone" type="tel" class="terminal-input" placeholder="+1 (000) 000-0000" />
                  </div>
                </div>
                <div class="pt-8 border-t border-white/5 flex items-center justify-between">
                   <p v-if="saveMessage" class="text-[10px] font-black uppercase tracking-widest" :class="saveSuccess ? 'text-emerald-400' : 'text-rose-400'">{{ saveMessage }}</p>
                   <button type="submit" :disabled="saving" class="ml-auto px-10 py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] flex items-center gap-3">
                      <LoadingSpinner v-if="saving" size="sm" color="black" />
                      Commit Changes
                   </button>
                </div>
              </form>
            </div>

            <!-- 2. SECURITY -->
            <div v-else-if="activeTab === 'security'" key="security" class="space-y-8">
              <div class="bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-8 md:p-12">
                <h3 class="text-[11px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-10">Section 02 // Security Cipher</h3>
                <form @submit.prevent="changePassword" class="space-y-8">
                  <div class="space-y-2">
                    <label class="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Active Cipher</label>
                    <input v-model="passwordForm.currentPassword" type="password" class="terminal-input" placeholder="••••••••" />
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="space-y-2">
                      <label class="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">New Cipher</label>
                      <input v-model="passwordForm.newPassword" type="password" class="terminal-input" placeholder="••••••••" />
                    </div>
                    <div class="space-y-2">
                      <label class="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Confirm Sequence</label>
                      <input v-model="passwordForm.confirmPassword" type="password" class="terminal-input" placeholder="••••••••" />
                    </div>
                  </div>
                  <div class="flex justify-end pt-4">
                    <button type="submit" :disabled="changingPassword" class="px-10 py-4 bg-emerald-500 text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(16,185,129,0.2)]">Update Encryption</button>
                  </div>
                </form>
              </div>
            </div>

            <!-- 3. DANGER ZONE -->
            <div v-else-if="activeTab === 'danger'" key="danger" class="bg-rose-500/5 border border-rose-500/20 rounded-[3rem] p-8 md:p-12 space-y-10">
               <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-2xl bg-rose-500/20 flex items-center justify-center text-rose-500">
                    <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-width="2.5"/></svg>
                  </div>
                  <h3 class="text-2xl font-black text-rose-500 tracking-tighter uppercase">Protocol: Critical Terminate</h3>
               </div>
               <div class="space-y-4">
                 <div class="flex items-center justify-between p-6 bg-rose-500/10 border border-rose-500/20 rounded-3xl group">
                   <div>
                     <p class="text-sm font-black text-rose-400 uppercase tracking-widest">Purge Account Identity</p>
                     <p class="text-[10px] text-rose-500/60 font-medium mt-1">Warning: All session data and event history will be destroyed.</p>
                   </div>
                   <button @click="deleteAccount" class="px-8 py-3 bg-rose-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-500 transition-all">Purge</button>
                 </div>
               </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const authStore = useAuthStore()

const activeTab = ref('personal')
const saving = ref(false)
const changingPassword = ref(false)
const saveMessage = ref('')
const saveSuccess = ref(false)
const avatarPreview = ref(null)
const avatarFile = ref(null)

const form = ref({
  name: '', username: '', email: '', phone: '',
  city: '', country: '', bio: '', avatar_url: ''
})

const passwordForm = ref({ currentPassword: '', newPassword: '', confirmPassword: '' })

const tabs = [
  { id: 'personal', label: 'Identity Brief', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { id: 'security', label: 'Security Protocols', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
  { id: 'danger', label: 'Purge Terminal', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
]

const roleBadgeClass = computed(() => {
  const role = authStore.user?.role
  if (role === 'admin') return 'text-rose-400 border-rose-500/30 bg-rose-500/10'
  if (role === 'organizer') return 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10'
  return 'text-violet-400 border-violet-500/30 bg-violet-500/10'
})

const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'ID'

const handleAvatarChange = (e) => {
  const file = e.target.files[0]; if (!file) return
  avatarFile.value = file
  const reader = new FileReader(); reader.onload = (ev) => { avatarPreview.value = ev.target.result }; reader.readAsDataURL(file)
}

const removeAvatar = () => { avatarPreview.value = null; avatarFile.value = null; form.value.avatar_url = '' }

const updateProfile = async () => {
  saving.value = true; saveMessage.value = ''
  try {
    const { data } = await api.put('/users/profile', form.value)
    authStore.user = data.user
    saveSuccess.value = true; saveMessage.value = 'Identity Core Synchronized.'
  } catch (error) {
    saveSuccess.value = false; saveMessage.value = 'Sync Failed.'
  } finally { saving.value = false }
}

const changePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) return
  changingPassword.value = true
  try {
    await api.put('/users/password', { currentPassword: passwordForm.value.currentPassword, newPassword: passwordForm.value.newPassword })
    passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
    alert('Security Cipher Re-encrypted.')
  } catch (error) { alert('Decryption Key Refused.') } 
  finally { changingPassword.value = false }
}

const deleteAccount = async () => {
  if (!confirm('Permanent purge?')) return
  try { await api.delete('/users/account'); authStore.logout() } catch (e) { alert('Purge Refused.') }
}

onMounted(() => { if (authStore.user) form.value = { ...authStore.user } })
</script>

<style scoped>
.terminal-input {
  @apply w-full px-6 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-sm font-bold text-white placeholder-zinc-700 outline-none focus:border-cyan-500/50 focus:bg-white/[0.05] transition-all;
}
.fade-enter-active, .fade-leave-active { transition: all 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(10px); }
</style>
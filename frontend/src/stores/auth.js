import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

// Centralized role definitions to avoid magic strings
const ROLES = {
  ADMIN: 'admin',
  SUPER: 'superadmin',
  ORGANIZER: 'organizer',
  ATTENDEE: 'attendee'
}

export const useAuthStore = defineStore('auth', () => {
  // --- State ---
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const loading = ref(false)
  const error = ref(null)

  // --- Getters ---
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  
  const userRole = computed(() => user.value?.role || null)

  const isAdmin = computed(() => 
    [ROLES.ADMIN, ROLES.SUPER].includes(userRole.value)
  )

  const isOrganizer = computed(() => 
    [ROLES.ORGANIZER, ROLES.ADMIN, ROLES.SUPER].includes(userRole.value)
  )

  // --- Private Helpers ---
  const _handleError = (err, fallback) => {
    const message = err.response?.data?.error?.message || 
                    err.response?.data?.message || 
                    err.response?.data?.error || 
                    fallback
    error.value = message
    return message
  }

  const _syncHeaders = (authToken) => {
    if (authToken) {
      api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
    } else {
      delete api.defaults.headers.common['Authorization']
    }
  }

  // --- Actions ---

  /**
   * Updates state, storage, and axios headers in one atomic operation
   */
  function setAuth(authToken, authUser) {
    token.value = authToken
    user.value = authUser

    if (authToken) {
      localStorage.setItem('token', authToken)
      localStorage.setItem('user', JSON.stringify(authUser))
    }
    _syncHeaders(authToken)
  }

  /**
   * Resets the store and cleans sensitive data
   */
  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    _syncHeaders(null)
    // Optional: router.push('/login') or window.location.href = '/'
  }

  /**
   * Hydrates the store from LocalStorage and validates the session
   */
  async function initAuth() {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    if (!savedToken) return

    // 1. Set local data immediately for responsive UI
    try {
      token.value = savedToken
      _syncHeaders(savedToken)
      if (savedUser) user.value = JSON.parse(savedUser)
    } catch (e) {
      return logout()
    }

    // 2. Background check: Re-validate session with server
    // This prevents "Zombie" sessions where the token is expired but still in LocalStorage
    await fetchUser()
  }

  async function login(email, password) {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.post('/auth/login', { email, password })
      setAuth(data.token, data.user)
      return data
    } catch (err) {
      _handleError(err, 'Authentication failed. Check your credentials.')
      throw err
    } finally {
      loading.value = false
    }
  }

  async function register(registrationData) {
    loading.value = true
    error.value = null

    try {
      // Clean empty values
      const payload = Object.fromEntries(
        Object.entries(registrationData).filter(([_, v]) => v != null && v !== '')
      )

      const { data } = await api.post('/auth/register', payload)
      setAuth(data.token, data.user)
      return data
    } catch (err) {
      _handleError(err, 'Identity deployment failed. Please try again.')
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetches fresh user data. If 401, automatically logs out.
   */
  async function fetchUser() {
    if (!token.value) return null
    _syncHeaders(token.value)

    try {
      const { data } = await api.get('/auth/me')
      user.value = data
      localStorage.setItem('user', JSON.stringify(data))
      return data
    } catch (err) {
      // Only logout if the error is an Auth failure (401/403)
      if (err.response?.status === 401) {
        logout()
      }
      return null
    }
  }

  async function updateProfile(profileData) {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.put('/auth/profile', profileData)
      const updatedUser = data.user || data
      user.value = updatedUser
      localStorage.setItem('user', JSON.stringify(updatedUser))
      return updatedUser
    } catch (err) {
      _handleError(err, 'System synchronization failed.')
      throw err
    } finally {
      loading.value = false
    }
  }

  async function changePassword(currentPassword, newPassword) {
    loading.value = true
    error.value = null

    try {
      await api.put('/auth/password', { currentPassword, newPassword })
      return true
    } catch (err) {
      _handleError(err, 'Cipher update failed.')
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    user,
    token,
    loading,
    error,
    // Getters
    isAuthenticated,
    isAdmin,
    isOrganizer,
    userRole,
    // Actions
    initAuth,
    login,
    register,
    fetchUser,
    updateProfile,
    changePassword,
    logout
  }
})
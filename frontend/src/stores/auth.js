// stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  const isAdmin = computed(() =>
    ['admin', 'superadmin'].includes(user.value?.role)
  )

  const isOrganizer = computed(() =>
    ['organizer', 'admin', 'superadmin'].includes(user.value?.role)
  )

  function extractError(err, fallback) {
    const data = err.response?.data
    if (!data) return fallback
    if (data.error?.message) return data.error.message
    if (typeof data.error === 'string') return data.error
    if (data.message) return data.message
    if (Array.isArray(data.errors) && data.errors[0]?.message) return data.errors[0].message
    return fallback
  }

  function setAuth(authToken, authUser) {
    token.value = authToken
    user.value = authUser

    localStorage.setItem('token', authToken)
    localStorage.setItem('user', JSON.stringify(authUser))

    api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
  }

  function clearAuth() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete api.defaults.headers.common['Authorization']
  }

  function initAuth() {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    if (savedToken) {
      token.value = savedToken
      api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`
    }

    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser)
      } catch {
        localStorage.removeItem('user')
      }
    }
  }

  async function login(email, password) {
    loading.value = true
    error.value = null

    try {
      const response = await api.post('/auth/login', { email, password })
      setAuth(response.data.token, response.data.user)
      return response.data
    } catch (err) {
      error.value = extractError(err, 'Login failed. Please check your credentials.')
      throw err
    } finally {
      loading.value = false
    }
  }

  async function register(data) {
    loading.value = true
    error.value = null

    try {
      const payload = Object.fromEntries(
        Object.entries(data).filter(([, v]) => v !== undefined && v !== '')
      )

      const response = await api.post('/auth/register', payload)
      setAuth(response.data.token, response.data.user)
      return response.data
    } catch (err) {
      error.value = extractError(err, 'Registration failed. Please try again.')
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchUser() {
    if (!token.value) return null

    try {
      const response = await api.get('/auth/me')
      const freshUser = response.data

      user.value = freshUser
      localStorage.setItem('user', JSON.stringify(freshUser))

      return freshUser
    } catch {
      clearAuth()
      return null
    }
  }

  async function updateProfile(data) {
    loading.value = true
    error.value = null

    try {
      const payload = Object.fromEntries(
        Object.entries(data).filter(([, v]) => v !== undefined && v !== '')
      )

      const response = await api.put('/auth/profile', payload)

      const updatedUser = response.data.user || response.data
      user.value = updatedUser

      localStorage.setItem('user', JSON.stringify(updatedUser))

      return updatedUser
    } catch (err) {
      error.value = extractError(err, 'Profile update failed.')
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
      error.value = extractError(err, 'Password change failed.')
      throw err
    } finally {
      loading.value = false
    }
  }

  function logout() {
    clearAuth()
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    isOrganizer,
    initAuth,
    login,
    register,
    fetchUser,
    updateProfile,
    changePassword,
    logout
  }
})
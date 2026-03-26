<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Payment Management</h1>
        <p class="text-muted-foreground">Monitor and manage all platform payments</p>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-card border border-border rounded-xl p-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div>
            <p class="text-2xl font-bold text-foreground">${{ totalRevenue.toFixed(2) }}</p>
            <p class="text-sm text-muted-foreground">Total Revenue</p>
          </div>
        </div>
      </div>

      <div class="bg-card border border-border rounded-xl p-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-2xl font-bold text-foreground">{{ completedPayments }}</p>
            <p class="text-sm text-muted-foreground">Completed</p>
          </div>
        </div>
      </div>

      <div class="bg-card border border-border rounded-xl p-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-2xl font-bold text-foreground">{{ pendingPayments }}</p>
            <p class="text-sm text-muted-foreground">Pending</p>
          </div>
        </div>
      </div>

      <div class="bg-card border border-border rounded-xl p-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m-3 3H4m14 4V7a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2z" />
            </svg>
          </div>
          <div>
            <p class="text-2xl font-bold text-foreground">{{ refundedPayments }}</p>
            <p class="text-sm text-muted-foreground">Refunded</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-4">
      <div class="flex-1 min-w-[200px]">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search payments..."
          class="w-full px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <select v-model="statusFilter"
              class="px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
        <option value="">All Status</option>
        <option value="completed">Completed</option>
        <option value="pending">Pending</option>
        <option value="refunded">Refunded</option>
        <option value="failed">Failed</option>
      </select>
      <select v-model="methodFilter"
              class="px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
        <option value="">All Methods</option>
        <option value="card">Card</option>
        <option value="paypal">PayPal</option>
        <option value="bank">Bank Transfer</option>
      </select>
    </div>

    <LoadingSpinner v-if="loading" />

    <div v-else class="bg-card border border-border rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-muted/50">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Transaction</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">User</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Event</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Amount</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Method</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr v-for="payment in filteredPayments" :key="payment.id" class="hover:bg-muted/30">
              <td class="px-4 py-3">
                <div>
                  <p class="font-medium text-foreground">{{ payment.transaction_id }}</p>
                  <p class="text-sm text-muted-foreground">ID: {{ payment.id }}</p>
                </div>
              </td>
              <td class="px-4 py-3">
                <div>
                  <p class="font-medium text-foreground">{{ payment.user_name }}</p>
                  <p class="text-sm text-muted-foreground">{{ payment.user_email }}</p>
                </div>
              </td>
              <td class="px-4 py-3">
                <p class="font-medium text-foreground">{{ payment.event_title }}</p>
              </td>
              <td class="px-4 py-3">
                <p class="font-medium text-foreground">${{ payment.amount.toFixed(2) }}</p>
                <p class="text-sm text-muted-foreground">{{ payment.currency }}</p>
              </td>
              <td class="px-4 py-3">
                <span class="capitalize text-sm">{{ payment.method }}</span>
              </td>
              <td class="px-4 py-3">
                <span :class="[
                  'px-2 py-1 text-xs rounded-full',
                  payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                  payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  payment.status === 'refunded' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                ]">
                  {{ payment.status }}
                </span>
              </td>
              <td class="px-4 py-3">
                <p class="text-sm text-foreground">{{ formatDate(payment.created_at) }}</p>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <button @click="viewPaymentDetails(payment)"
                          class="px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
                    View
                  </button>
                  <button v-if="payment.status === 'completed'"
                          @click="processRefund(payment.id)"
                          class="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
                    Refund
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.pages > 1" class="px-4 py-3 border-t border-border flex items-center justify-between">
        <div class="text-sm text-muted-foreground">
          Showing {{ (pagination.page - 1) * pagination.limit + 1 }} to
          {{ Math.min(pagination.page * pagination.limit, pagination.total) }} of
          {{ pagination.total }} payments
        </div>
        <div class="flex items-center gap-2">
          <button @click="changePage(pagination.page - 1)"
                  :disabled="pagination.page <= 1"
                  class="px-3 py-1 text-sm border border-border rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed">
            Previous
          </button>
          <span class="text-sm text-muted-foreground">
            Page {{ pagination.page }} of {{ pagination.pages }}
          </span>
          <button @click="changePage(pagination.page + 1)"
                  :disabled="pagination.page >= pagination.pages"
                  class="px-3 py-1 text-sm border border-border rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed">
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Payment Details Modal -->
    <div v-if="selectedPayment" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-card border border-border rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-foreground">Payment Details</h2>
          <button @click="selectedPayment = null" class="text-muted-foreground hover:text-foreground">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-muted-foreground">Transaction ID</label>
              <p class="font-medium text-foreground">{{ selectedPayment.transaction_id }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-muted-foreground">Status</label>
              <span :class="[
                'px-2 py-1 text-xs rounded-full',
                selectedPayment.status === 'completed' ? 'bg-green-100 text-green-800' :
                selectedPayment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                selectedPayment.status === 'refunded' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              ]">
                {{ selectedPayment.status }}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-muted-foreground">Amount</label>
              <p class="font-medium text-foreground">${{ selectedPayment.amount.toFixed(2) }} {{ selectedPayment.currency }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-muted-foreground">Payment Method</label>
              <p class="font-medium text-foreground capitalize">{{ selectedPayment.method }}</p>
            </div>
          </div>

          <div>
            <label class="text-sm font-medium text-muted-foreground">User</label>
            <div class="mt-1 p-3 bg-muted/50 rounded-lg">
              <p class="font-medium text-foreground">{{ selectedPayment.user_name }}</p>
              <p class="text-sm text-muted-foreground">{{ selectedPayment.user_email }}</p>
            </div>
          </div>

          <div>
            <label class="text-sm font-medium text-muted-foreground">Event</label>
            <p class="font-medium text-foreground">{{ selectedPayment.event_title }}</p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-muted-foreground">Created</label>
              <p class="text-sm text-foreground">{{ formatDate(selectedPayment.created_at) }}</p>
            </div>
            <div v-if="selectedPayment.updated_at">
              <label class="text-sm font-medium text-muted-foreground">Updated</label>
              <p class="text-sm text-foreground">{{ formatDate(selectedPayment.updated_at) }}</p>
            </div>
          </div>

          <div v-if="selectedPayment.payment_details">
            <label class="text-sm font-medium text-muted-foreground">Payment Details</label>
            <pre class="mt-1 p-3 bg-muted/50 rounded-lg text-sm overflow-x-auto">{{ JSON.stringify(JSON.parse(selectedPayment.payment_details), null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import LoadingSpinner from '../../components/LoadingSpinner.vue'

const payments = ref([])
const loading = ref(true)
const selectedPayment = ref(null)
const searchQuery = ref('')
const statusFilter = ref('')
const methodFilter = ref('')
const pagination = ref({
  page: 1,
  limit: 20,
  total: 0,
  pages: 0
})

// Stats
const totalRevenue = ref(0)
const completedPayments = ref(0)
const pendingPayments = ref(0)
const refundedPayments = ref(0)

const filteredPayments = computed(() => {
  let filtered = payments.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(payment =>
      payment.transaction_id.toLowerCase().includes(query) ||
      payment.user_name.toLowerCase().includes(query) ||
      payment.user_email.toLowerCase().includes(query) ||
      payment.event_title.toLowerCase().includes(query)
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(payment => payment.status === statusFilter.value)
  }

  if (methodFilter.value) {
    filtered = filtered.filter(payment => payment.method === methodFilter.value)
  }

  return filtered
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const fetchPayments = async (page = 1) => {
  try {
    loading.value = true
    const params = new URLSearchParams({
      page: page.toString(),
      limit: pagination.value.limit.toString()
    })

    if (statusFilter.value) {
      params.append('status', statusFilter.value)
    }

    const response = await axios.get(`/api/admin/payments?${params}`)
    payments.value = response.data.payments
    pagination.value = response.data.pagination
  } catch (error) {
    console.error('Error fetching payments:', error)
  } finally {
    loading.value = false
  }
}

const fetchStats = async () => {
  try {
    const response = await axios.get('/api/admin/stats')
    const stats = response.data.stats

    totalRevenue.value = stats.totalRevenue || 0

    // Calculate payment counts from current payments
    completedPayments.value = payments.value.filter(p => p.status === 'completed').length
    pendingPayments.value = payments.value.filter(p => p.status === 'pending').length
    refundedPayments.value = payments.value.filter(p => p.status === 'refunded').length
  } catch (error) {
    console.error('Error fetching stats:', error)
  }
}

const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.pages) {
    pagination.value.page = page
    fetchPayments(page)
  }
}

const viewPaymentDetails = (payment) => {
  selectedPayment.value = payment
}

const processRefund = async (paymentId) => {
  if (!confirm('Are you sure you want to process a refund for this payment?')) {
    return
  }

  try {
    await axios.post(`/api/payments/${paymentId}/refund`)
    alert('Refund processed successfully')
    fetchPayments(pagination.value.page)
    fetchStats()
  } catch (error) {
    console.error('Error processing refund:', error)
    alert('Failed to process refund')
  }
}

// Watch for filter changes
watch([statusFilter, methodFilter], () => {
  pagination.value.page = 1
  fetchPayments(1)
})

onMounted(() => {
  fetchPayments()
  fetchStats()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Review Management</h1>
        <p class="text-muted-foreground">Monitor and moderate all platform reviews</p>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-card border border-border rounded-xl p-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <p class="text-2xl font-bold text-foreground">{{ totalReviews }}</p>
            <p class="text-sm text-muted-foreground">Total Reviews</p>
          </div>
        </div>
      </div>

      <div class="bg-card border border-border rounded-xl p-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-2xl font-bold text-foreground">{{ approvedReviews }}</p>
            <p class="text-sm text-muted-foreground">Approved</p>
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
            <p class="text-2xl font-bold text-foreground">{{ pendingReviews }}</p>
            <p class="text-sm text-muted-foreground">Pending</p>
          </div>
        </div>
      </div>

      <div class="bg-card border border-border rounded-xl p-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div>
            <p class="text-2xl font-bold text-foreground">{{ rejectedReviews }}</p>
            <p class="text-sm text-muted-foreground">Rejected</p>
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
          placeholder="Search reviews..."
          class="w-full px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <select v-model="statusFilter"
              class="px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
        <option value="">All Status</option>
        <option value="approved">Approved</option>
        <option value="pending">Pending</option>
        <option value="rejected">Rejected</option>
      </select>
      <select v-model="ratingFilter"
              class="px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
        <option value="">All Ratings</option>
        <option value="5">5 Stars</option>
        <option value="4">4 Stars</option>
        <option value="3">3 Stars</option>
        <option value="2">2 Stars</option>
        <option value="1">1 Star</option>
      </select>
    </div>

    <LoadingSpinner v-if="loading" />

    <div v-else class="bg-card border border-border rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-muted/50">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Review</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">User</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Event</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Rating</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr v-for="review in filteredReviews" :key="review.id" class="hover:bg-muted/30">
              <td class="px-4 py-3 max-w-xs">
                <div>
                  <p class="font-medium text-foreground line-clamp-2">{{ review.comment || 'No comment' }}</p>
                  <p class="text-sm text-muted-foreground">ID: {{ review.id }}</p>
                </div>
              </td>
              <td class="px-4 py-3">
                <div>
                  <p class="font-medium text-foreground">{{ review.user_name }}</p>
                  <p class="text-sm text-muted-foreground">{{ review.user_email }}</p>
                </div>
              </td>
              <td class="px-4 py-3">
                <p class="font-medium text-foreground">{{ review.event_title }}</p>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-1">
                  <div class="flex">
                    <svg v-for="i in 5" :key="i"
                         :class="['w-4 h-4', i <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300']"
                         viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <span class="text-sm text-muted-foreground ml-1">{{ review.rating }}/5</span>
                </div>
              </td>
              <td class="px-4 py-3">
                <span :class="[
                  'px-2 py-1 text-xs rounded-full',
                  review.status === 'approved' ? 'bg-green-100 text-green-800' :
                  review.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  review.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                ]">
                  {{ review.status }}
                </span>
              </td>
              <td class="px-4 py-3">
                <p class="text-sm text-foreground">{{ formatDate(review.created_at) }}</p>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <button @click="viewReviewDetails(review)"
                          class="px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
                    View
                  </button>
                  <button v-if="review.status === 'pending'"
                          @click="approveReview(review.id)"
                          class="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
                    Approve
                  </button>
                  <button v-if="review.status === 'pending'"
                          @click="rejectReview(review.id)"
                          class="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
                    Reject
                  </button>
                  <button @click="deleteReview(review.id)"
                          class="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
                    Delete
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
          {{ pagination.total }} reviews
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

    <!-- Review Details Modal -->
    <div v-if="selectedReview" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-card border border-border rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-foreground">Review Details</h2>
          <button @click="selectedReview = null" class="text-muted-foreground hover:text-foreground">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-muted-foreground">Review ID</label>
              <p class="font-medium text-foreground">{{ selectedReview.id }}</p>
            </div>
            <div>
              <label class="text-sm font-medium text-muted-foreground">Status</label>
              <span :class="[
                'px-2 py-1 text-xs rounded-full',
                selectedReview.status === 'approved' ? 'bg-green-100 text-green-800' :
                selectedReview.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                selectedReview.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              ]">
                {{ selectedReview.status }}
              </span>
            </div>
          </div>

          <div>
            <label class="text-sm font-medium text-muted-foreground">Rating</label>
            <div class="flex items-center gap-2 mt-1">
              <div class="flex">
                <svg v-for="i in 5" :key="i"
                     :class="['w-5 h-5', i <= selectedReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300']"
                     viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <span class="text-sm text-muted-foreground">{{ selectedReview.rating }}/5 stars</span>
            </div>
          </div>

          <div>
            <label class="text-sm font-medium text-muted-foreground">Comment</label>
            <p class="mt-1 p-3 bg-muted/50 rounded-lg">{{ selectedReview.comment || 'No comment provided' }}</p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-muted-foreground">User</label>
              <div class="mt-1 p-3 bg-muted/50 rounded-lg">
                <p class="font-medium text-foreground">{{ selectedReview.user_name }}</p>
                <p class="text-sm text-muted-foreground">{{ selectedReview.user_email }}</p>
              </div>
            </div>
            <div>
              <label class="text-sm font-medium text-muted-foreground">Event</label>
              <p class="mt-1 p-3 bg-muted/50 rounded-lg font-medium text-foreground">{{ selectedReview.event_title }}</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-muted-foreground">Created</label>
              <p class="text-sm text-foreground">{{ formatDate(selectedReview.created_at) }}</p>
            </div>
            <div v-if="selectedReview.updated_at">
              <label class="text-sm font-medium text-muted-foreground">Updated</label>
              <p class="text-sm text-foreground">{{ formatDate(selectedReview.updated_at) }}</p>
            </div>
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
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
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

    // Calculate stats
    totalReviews.value = reviews.value.length
    approvedReviews.value = reviews.value.filter(r => r.status === 'approved').length
    pendingReviews.value = reviews.value.filter(r => r.status === 'pending').length
    rejectedReviews.value = reviews.value.filter(r => r.status === 'rejected').length
  } catch (error) {
    console.error('Error fetching reviews:', error)
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
    alert('Review approved successfully')
    fetchReviews(pagination.value.page)
  } catch (error) {
    console.error('Error approving review:', error)
    alert('Failed to approve review')
  }
}

const rejectReview = async (reviewId) => {
  try {
    await axios.put(`/api/admin/reviews/${reviewId}/reject`)
    alert('Review rejected successfully')
    fetchReviews(pagination.value.page)
  } catch (error) {
    console.error('Error rejecting review:', error)
    alert('Failed to reject review')
  }
}

const deleteReview = async (reviewId) => {
  if (!confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
    return
  }

  try {
    await axios.delete(`/api/admin/reviews/${reviewId}`)
    alert('Review deleted successfully')
    fetchReviews(pagination.value.page)
  } catch (error) {
    console.error('Error deleting review:', error)
    alert('Failed to delete review')
  }
}

// Watch for filter changes
watch([statusFilter, ratingFilter], () => {
  pagination.value.page = 1
  fetchReviews(1)
})

onMounted(() => {
  fetchReviews()
})
</script>

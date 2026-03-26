<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-foreground">Categories</h1>
        <p class="text-muted-foreground">Manage event categories</p>
      </div>
      <button @click="openCreateModal" 
              class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Category
      </button>
    </div>

    <LoadingSpinner v-if="loading" />

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="category in categories" :key="category.id" 
           class="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-colors">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                 :style="{ backgroundColor: category.color + '20' }">
              {{ category.icon || '📁' }}
            </div>
            <div>
              <h3 class="font-semibold text-foreground">{{ category.name }}</h3>
              <p class="text-sm text-muted-foreground">{{ category.event_count || 0 }} events</p>
            </div>
          </div>
          <div class="flex gap-1">
            <button @click="openEditModal(category)" class="p-2 text-muted-foreground hover:text-foreground">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button @click="deleteCategory(category.id)" class="p-2 text-red-500 hover:text-red-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        <p v-if="category.description" class="mt-2 text-sm text-muted-foreground">
          {{ category.description }}
        </p>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="showModal = false">
      <div class="bg-card rounded-xl p-6 max-w-md w-full">
        <h2 class="text-lg font-semibold text-foreground mb-4">
          {{ editingCategory ? 'Edit Category' : 'Create Category' }}
        </h2>
        <form @submit.prevent="saveCategory" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-foreground mb-1">Name *</label>
            <input 
              v-model="form.name"
              type="text"
              required
              class="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Category name"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-foreground mb-1">Description</label>
            <textarea 
              v-model="form.description"
              rows="3"
              class="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Category description"
            ></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-foreground mb-1">Icon (emoji)</label>
              <input 
                v-model="form.icon"
                type="text"
                class="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="🎵"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-foreground mb-1">Color</label>
              <input 
                v-model="form.color"
                type="color"
                class="w-full h-10 bg-background border border-input rounded-lg cursor-pointer"
              />
            </div>
          </div>
          <div class="flex gap-3 pt-4">
            <button type="button" @click="showModal = false" 
                    class="flex-1 px-4 py-2 border border-input rounded-lg hover:bg-muted transition-colors">
              Cancel
            </button>
            <button type="submit" :disabled="saving"
                    class="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
              {{ saving ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const loading = ref(true)
const categories = ref([])
const showModal = ref(false)
const editingCategory = ref(null)
const saving = ref(false)

const form = ref({
  name: '',
  description: '',
  icon: '',
  color: '#3b82f6'
})

const openCreateModal = () => {
  editingCategory.value = null
  form.value = { name: '', description: '', icon: '', color: '#3b82f6' }
  showModal.value = true
}

const openEditModal = (category) => {
  editingCategory.value = category
  form.value = {
    name: category.name,
    description: category.description || '',
    icon: category.icon || '',
    color: category.color || '#3b82f6'
  }
  showModal.value = true
}

const saveCategory = async () => {
  saving.value = true
  try {
    if (editingCategory.value) {
      await api.put(`/categories/${editingCategory.value.id}`, form.value)
      const index = categories.value.findIndex(c => c.id === editingCategory.value.id)
      if (index !== -1) {
        categories.value[index] = { ...categories.value[index], ...form.value }
      }
    } else {
      const { data } = await api.post('/categories', form.value)
      categories.value.push(data.category)
    }
    showModal.value = false
  } catch (error) {
    alert(error.response?.data?.error || 'Failed to save category')
  } finally {
    saving.value = false
  }
}

const deleteCategory = async (categoryId) => {
  if (!confirm('Are you sure you want to delete this category?')) return
  
  try {
    await api.delete(`/categories/${categoryId}`)
    categories.value = categories.value.filter(c => c.id !== categoryId)
  } catch (error) {
    alert(error.response?.data?.error || 'Failed to delete category')
  }
}

const fetchCategories = async () => {
  try {
    const { data } = await api.get('/categories')
    categories.value = data.categories || []
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchCategories)
</script>

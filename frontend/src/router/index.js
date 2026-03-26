import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Layouts
import MainLayout from '../layouts/MainLayout.vue'
import DashboardLayout from '../layouts/DashboardLayout.vue'
import AuthLayout from '../layouts/AuthLayout.vue'

// Public Pages
import HomePage from '../pages/HomePage.vue'
import EventsPage from '../pages/EventsPage.vue'
import EventDetailPage from '../pages/EventDetailPage.vue'
import CategoriesPage from '../pages/CategoriesPage.vue'

// Auth Pages
import LoginPage from '../pages/auth/LoginPage.vue'
import RegisterPage from '../pages/auth/RegisterPage.vue'

// Attendee Dashboard
import AttendeeDashboard from '../pages/attendee/DashboardPage.vue'
import AttendeeTickets from '../pages/attendee/TicketsPage.vue'
import AttendeeProfile from '../pages/attendee/ProfilePage.vue'

// Organizer Dashboard
import OrganizerDashboard from '../pages/organizer/DashboardPage.vue'
import OrganizerEvents from '../pages/organizer/EventsListPage.vue'
import OrganizerCreateEvent from '../pages/organizer/CreateEventPage.vue'
import OrganizerEditEvent from '../pages/organizer/EditEventPage.vue'
import OrganizerEventAttendees from '../pages/organizer/EventAttendeesPage.vue'
import OrganizerScanner from '../pages/organizer/ScannerPage.vue'

// Admin Dashboard
import AdminDashboard from '../pages/admin/DashboardPage.vue'
import AdminUsers from '../pages/admin/UsersPage.vue'
import AdminEvents from '../pages/admin/EventsPage.vue'
import AdminCategories from '../pages/admin/CategoriesPage.vue'
import AdminReviews from '../pages/admin/ReviewsPage.vue'
import AdminPayments from '../pages/admin/PaymentsPage.vue'


const routes = [
  // Public routes
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', name: 'home', component: HomePage },
      { path: 'events', name: 'events', component: EventsPage },
      { path: 'events/:id', name: 'event-detail', component: EventDetailPage },
      { path: 'categories', name: 'categories', component: CategoriesPage },
    ]
  },
  
  // Auth routes
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      { path: 'login', name: 'login', component: LoginPage },
      { path: 'register', name: 'register', component: RegisterPage },
    ],
    meta: { guest: true }
  },
  
  // Attendee dashboard
  {
    path: '/dashboard',
    component: DashboardLayout,
    meta: { requiresAuth: true, role: 'attendee' },
    children: [
      { path: '', name: 'attendee-dashboard', component: AttendeeDashboard },
      { path: 'tickets', name: 'attendee-tickets', component: AttendeeTickets },
      { path: 'profile', name: 'attendee-profile', component: AttendeeProfile },
    ]
  },
  
  // Organizer dashboard
  {
    path: '/organizer',
    component: DashboardLayout,
    meta: { requiresAuth: true, role: 'organizer' },
    children: [
      { path: '', name: 'organizer-dashboard', component: OrganizerDashboard },
      { path: 'events', name: 'organizer-events', component: OrganizerEvents },
      { path: 'events/create', name: 'organizer-create-event', component: OrganizerCreateEvent },
      { path: 'events/:id/edit', name: 'organizer-edit-event', component: OrganizerEditEvent },
      { path: 'events/:id/attendees', name: 'organizer-event-attendees', component: OrganizerEventAttendees },
      { path: 'scanner', name: 'organizer-scanner', component: OrganizerScanner },
    ]
  },
  
  // Admin dashboard
  {
    path: '/admin',
    component: DashboardLayout,
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      { path: '', name: 'admin-dashboard', component: AdminDashboard },
      { path: 'users', name: 'admin-users', component: AdminUsers },
      { path: 'events', name: 'admin-events', component: AdminEvents },
      { path: 'categories', name: 'admin-categories', component: AdminCategories },
      { path: 'reviews', name: 'admin-reviews', component: AdminReviews },
      { path: 'payments', name: 'admin-payments', component: AdminPayments },
    ]
  },
  
  // Catch all
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Guest routes (login/register) - redirect if authenticated
  if (to.meta.guest && authStore.isAuthenticated) {
    const redirectPath = {
      admin: '/admin',
      organizer: '/organizer',
      attendee: '/dashboard'
    }
    return next(redirectPath[authStore.user?.role] || '/dashboard')
  }
  
  // Protected routes
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      return next({ name: 'login', query: { redirect: to.fullPath } })
    }
    
    // Role-based access
    const role = to.meta.role
    if (role) {
      if (role === 'attendee' && authStore.user?.role !== 'attendee' && authStore.user?.role !== 'admin') {
        // Organizers and admins can also access attendee dashboard
      } else if (role === 'organizer' && authStore.user?.role !== 'organizer' && authStore.user?.role !== 'admin') {
        return next('/dashboard')
      } else if (role === 'admin' && authStore.user?.role !== 'admin') {
        return next('/dashboard')
      }
    }
  }
  
  next()
})

export default router

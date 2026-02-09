/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes'

import pinia from '../stores'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})

// 🛡️ Route Protection (auth + roles)
router.beforeEach(async (to) => {
  const requiresAuth = to.meta?.requiresAuth
  const allowedRoles = to.meta?.roles || []

  if (!requiresAuth) return true

  // lazy-load pinia + auth store
  const [{ default: pinia }, { useAuthStore }] = await Promise.all([
    import('../stores'),
    import('../stores/auth'),
  ])

  const authStore = useAuthStore(pinia)

  const isAuthenticated = authStore.isAuthenticated
  const userRole = authStore.role

  if (!isAuthenticated) {
    localStorage.setItem('redirect_after_login', to.fullPath)
    return { path: '/' }
  }

  if (allowedRoles.length && !allowedRoles.includes(userRole)) {
    return { path: '/unauthorized' }
  }

  return true
})


// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (localStorage.getItem('vuetify:dynamic-reload')) {
      console.error('Dynamic import error, reloading page did not fix it', err)
    } else {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})


export default router

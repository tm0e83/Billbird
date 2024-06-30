import { createRouter, createWebHistory } from 'vue-router'
import Overview from '../views/Overview.vue'
import { useStore } from '@/stores/store'

export const publicPages = ['/login', '/overview', '/faq']

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/overview'
    },
    {
      path: '/overview',
      name: 'overview',
      component: Overview
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/data',
      name: 'data',
      component: () => import('../views/Data.vue')
    },
    {
      path: '/faq',
      name: 'faq',
      component: () => import('../views/Faq.vue')
    }
  ]
})

router.beforeEach(async (to, from) => {
  const authRequired = !publicPages.includes(to.path)
  const store = useStore()

  if (authRequired && !store.uid) {
    return '/login'
  }
})

export default router

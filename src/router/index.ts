import { createRouter, createWebHistory, type Router, type RouteRecordRaw, type RouteLocationNormalized } from 'vue-router'
import OverviewPage from '../views/OverviewPage.vue'
import { useStore } from '@/stores/store'

export const publicPages: string[] = ['/login', '/overview', '/faq']

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/overview'
  },
  {
    path: '/overview',
    name: 'overview',
    component: OverviewPage
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginPage.vue')
  },
  {
    path: '/data',
    name: 'data',
    component: () => import('../views/DataPage.vue')
  },
  {
    path: '/faq',
    name: 'faq',
    component: () => import('../views/FaqPage.vue')
  },

  // catch-all route to redirect to overview
  {
    path: '/:pathMatch(.*)*',
    redirect: '/overview'
  }
]

export const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to: RouteLocationNormalized): Promise<string | void> => {
  const authRequired: boolean = !publicPages.includes(to.path)
  const store = useStore()

  if (authRequired && !store.uid) {
    return '/login'
  }
})

export default router

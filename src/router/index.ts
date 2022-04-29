import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Sessions from '@/components/Sessions.vue'
import Rights from '@/components/Rights.vue'
import Home from '@/components/Home.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/login',
    name: 'sessions',
    component: Sessions
  },
  {
    path: '/rights',
    name: 'rights',
    component: Rights
  },
  {
    path: '*',
    name: 'home',
    component: Home
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

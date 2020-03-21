import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/el-alert',
    name: 'ElAlert',
    component: () => import('../views/el-alert.vue')
  },
  {
    path: '/carousel',
    name: 'Carousel',
    component: () => import('../views/carousel.vue')
  },
  {
    path: '/button',
    name: 'Button',
    component: () => import('../views/Button.vue')
  },
  {
    path: '/buttongroup',
    name: 'ButtonGroup',
    component: () => import('../views/ButtonGroup.vue')
  },
  {
    path: '/badge',
    name: 'Badge',
    component: () => import('../views/Badge.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
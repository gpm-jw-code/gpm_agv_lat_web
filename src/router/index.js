import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AGVCMap from '@/views/AGVCMap.vue'
import OrderView from '@/views/OrderView.vue'
import AGVCView from "@/views/AGVCView.vue"

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path:'/Orders',
    name: 'orders',
    component:OrderView
  },
  {
    path:'/map/:agv_id',
    name:'map',
    component:AGVCMap
  },
  {
    path:'/map_all',
    name:'map_all',
    component:AGVCMap
  },{
    path:'/agvc',
    name:'agvc',
    component:AGVCView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

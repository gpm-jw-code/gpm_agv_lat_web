import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AGVCMap from '@/views/AGVCMap.vue'
import OrderView from '@/views/OrderView.vue'
import AGVCView from "@/views/AGVCView.vue"
import AGVSView from "@/views/AGVSView.vue"
import LogView from "@/views/LogView.vue"
import MapView from "@/views/MapView.vue"
import KingGallentAGVS from "@/components/AGVSModule/KingGallent/KingGallentAGVS.vue";
import GpmAGVS from "@/components/AGVSModule/Gpm/GpmAGVS.vue";

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/Orders',
    name: 'orders',
    component: OrderView
  },
  {
    path: '/map/:agv_id',
    name: 'map',
    component: AGVCMap
  },
  {
    path: '/map_all',
    name: 'map_all',
    component: AGVCMap
  },
  {
    path: '/agvc',
    name: 'agvc',
    component: AGVCView
  },
  {
    path: '/log',
    name: 'log',
    component: LogView
  },
  {
    path: '/map_view',
    name: 'map_view',
    component: MapView
  },
  {
    path: '/agvs',
    name: 'agvs',
    component: AGVSView,
    children:
      [{
        path: '/agvs',
        name: 'agvs.kinggallent',
        component: KingGallentAGVS,
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/agvs',
        name: 'agvs.gpm',
        component: GpmAGVS,
        meta: {
          keepAlive: true
        }
      }]

  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

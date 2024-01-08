import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import ProductList from '../views/ProductList.vue';
import VideoList from '../views/VideoList.vue';
import Login from '../components/LogIn/AdminLogin.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard
  },
  { path: '/product-list', 
    component: ProductList 
  },
  { path: '/video-list', 
    component: VideoList 
  },
  { path: '/login', 
    component: Login ,
    meta: { hideTopbar: true, hideSidebar: true }
  },
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

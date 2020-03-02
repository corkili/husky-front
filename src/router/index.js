import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const routes = [{
    path: '/',
    name: 'Index',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/Home.vue')
  }, {
    path: '/sign_in',
    name: 'Login',
    component: () => import('../views/Login.vue')
  }, {
    path: '/sign_up',
    name: 'Signup',
    component: () => import('../views/Signup.vue')
  }, {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue')
  }, {
    path: '/account_book',
    name: 'AccountBook',
    component: () => import('../views/AccountBook.vue')
  }, {
    path: '/setting',
    name: 'Setting',
    component: () => import('../views/Setting.vue')
  }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router

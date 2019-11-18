import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Signup from '../components/auth/Signup.vue'
import Login from '../components/auth/Login.vue'
const axios = require('axios')

Vue.use(VueRouter)

const requireAuth = (to, from, next) => {
  axios.get(process.env.VUE_APP_API_BASE_URL + 'verify', {
    headers: { 'x-sc-token': localStorage.getItem('x-sc-token') },
    data: {}
  }).then(() => {
    if (localStorage.getItem('x-sc-user')) {
      next()
    }
  })
  next('Login')
}

const loggedIn = (to, from, next) => {
  axios.get(process.env.VUE_APP_API_BASE_URL + 'verify', {
    headers: { 'x-sc-token': localStorage.getItem('x-sc-token') },
    data: {}
  }).then(() => {
    if (localStorage.getItem('x-sc-user')) {
      next('Home')
    }
  })
  next()
}

const routes = [
  {
    path: '/',
    name: 'Home',
    beforeEnter: requireAuth,
    component: Home
  },
  {
    path: '/signup',
    name: 'Signup',
    beforeEnter: loggedIn,
    component: Signup
  },
  {
    path: '/login',
    name: 'Login',
    beforeEnter: loggedIn,
    component: Login
  },
  {
    path: '*',
    name: 'Default',
    redirect: { name: 'Home' }
  }
]

const router = new VueRouter({
  routes
})

export default router

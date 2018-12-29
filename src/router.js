import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import Index from './views/Index.vue'
import OstecAuth from './views/OstecAuth.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            redirect: '/index'
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/ostecAuth',
            name: 'ostecAuth',
            component: OstecAuth
        },
        {
            path: '/index',
            name: 'index',
            component: Index
        }
    ]
})

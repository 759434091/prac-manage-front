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
            component: Index,
            children: [
                {
                    path: 'student',
                    name: 'student',
                    redirect: 'student/stuInfo',
                    component: () => import('./components/Student.vue'),
                    children: [
                        {
                            path: 'stuInfo',
                            name: 'stuInfo',
                            component: () => import('./components/student/StuInfo.vue')
                        }
                    ]
                },
                {
                    path: 'administrator',
                    name: 'administrator',
                    redirect: 'administrator/pracManage',
                    component: () => import('./components/Administrator.vue'),
                    children: [
                        {
                            path: 'pracManage',
                            name: 'pracManage',
                            component: () => import('./components/administrator/PracManage.vue')
                        }
                    ]
                }
            ]
        }
    ]
})

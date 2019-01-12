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
                        },
                        {
                            path: 'clockIn',
                            name: 'clockIn',
                            component: () => import('./components/student/ClockIn.vue')
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
                        },
                        {
                            path: 'historyManage',
                            name: 'historyManage',
                            component: () => import('./components/administrator/HistoryManage.vue')
                        }
                    ]
                },
                {
                    path: 'parent',
                    name: 'parent',
                    redirect: 'parent/pracInfo',
                    component: () => import('./components/Parent.vue'),
                    children: [
                        {
                            path: 'pracInfo',
                            name: 'pracInfo',
                            component: () => import('./components/parent/PracInfo.vue')
                        }
                    ]
                },
                {
                    path: 'setting',
                    name: 'setting',
                    redirect: 'setting/passwordSetting',
                    children: [
                        {
                            path: 'passwordSetting',
                            name: 'passwordSetting',
                            component: () => import('./components/setting/PasswordSetting.vue')
                        }
                    ],
                    component: () => import('./components/Setting.vue')
                }
            ]
        },
        {
            path: '/ostec',
            name: '/ostec',
            component:
                () => import('./views/Ostec.vue')
        },
        {
            path: '*',
            component:
                () => import('./views/NotFound.vue')
        }
    ]
})

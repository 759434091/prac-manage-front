import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import request from './request'
import util from './util'

Vue.config.productionTip = false

Vue.prototype.$request = request

Vue.prototype.$util = util

//返回状态判断
request.interceptors.response.use((res) => {
    return res;
}, (error) => {
    return Promise.reject(error);
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')

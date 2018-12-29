import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        accessToken: null,
        jwtPmUser: null
    },
    mutations: {
        login(state, pmToken) {
            state.accessToken = pmToken.accessToken
            state.jwtPmUser = pmToken.jwtPmUser

            localStorage.setItem('accessToken', pmToken.accessToken)
            localStorage.setItem('refreshToken', pmToken.refreshToken)
            localStorage.setItem('jwtPmUser', JSON.stringify(pmToken.jwtPmUser))
        },
        resetState(state, {accessToken, jwtPmUser}) {
            state.accessToken = accessToken
            state.jwtPmUser = jwtPmUser
        }
    },
    actions: {}
})

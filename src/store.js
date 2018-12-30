import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        accessToken: null,
        jwtPmUser: null,
        backSetting: null,
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
        },
        backSetting(state, backSetting) {
            state.backSetting = backSetting
        }
    },
    actions: {
        logout({state}) {
            localStorage.clear();
            state.accessToken = null
            state.jwtPmUser = null
            state.backSetting = null
        },
        getLocalStorageState({state}) {
            if (state.accessToken && state.jwtPmUser)
                return true

            const accessToken = localStorage.getItem('accessToken');
            const jwtPmUser = localStorage.getItem('jwtPmUser')
            if (!accessToken || !jwtPmUser)
                return false

            state.accessToken = accessToken;
            state.jwtPmUser = JSON.parse(jwtPmUser);
            return true
        }
    }
})

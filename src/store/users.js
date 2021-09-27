import USERS from '../services/userService'
import axios from 'axios'

export default {
    namespaced: true,
    state: {
        user: null,
        users: [],
        token: '',
    },
    mutations: {
        setUser(state, user) {
            state.user = user
        },
        setUsers(state, users) {
            state.users = users
        },
        setToken(state, token) {
            state.token = token
            localStorage.setItem('evaToken', token)
            axios.defaults.headers.Authorization = `Bearer ${token}`
        },
    },
    actions: {
        async getUsers({ commit }) {
            const users = await USERS.getUsers()
            commit('setUsers', users)
        },
        async getUser({ commit }, userId) {
            const user = USERS.getUser(userId)
            commit('setUser', user)
        },
        async loginUser({ commit, rootState }, payload) {
            payload.grant_type = 'password'
            payload.client_id = rootState.app.client.id
            payload.client_secret = rootState.app.client.secret
            payload.scope = '*'

            payload.username = payload.email
            // delete payload.email

            const loginResponse = await USERS.loginUser(payload)

            if (loginResponse.access_token) {
                commit('setToken', loginResponse.access_token)
                return this.dispatch('users/checkLogin')
            }
        },
        setToken({ commit }, token) {
            commit('setToken', token)
        },
        async checkLogin({ commit }) {
            if (localStorage.getItem('evaToken')) {
                commit('setToken', localStorage.getItem('evaToken'))
                const user = await USERS.checkLogin()
                if (user.id) {
                    commit('setUser', user)
                    return user
                }
            }
        },
        async logoutUser({ commit }) {
            localStorage.removeItem('evaToken')
            commit('setUser', null)
            window.location.reload()
        },
    },
}

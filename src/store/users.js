import USERS from '../services/userService'

export default {
    namespaced: true,
    state: {
        user: null,
    },
    mutations: {
        setUser(state, user) {
            state.user = user
        },
    },
    actions: {
        async getUser({ commit }, userId) {
            const user = USERS.getUser(userId)
            commit('setUser', user)
        },
        async loginUser({ commit }, payload) {
            payload.grant_type = 'password'
            payload.client_id = import.meta.env.VITE_APP_PASSPORT_CLIENT_ID
            payload.client_secret =
                import.meta.env.VITE_APP_PASSPORT_CLIENT_SECRET
            payload.scope = '*'

            payload.username = payload.email
            // delete payload.email

            console.log(payload)
            const user = USERS.loginUser(payload)

            commit('setUser', user)
        },
    },
}

const TYPES = {
    INFO: 'INFO',
    SUCCESS: 'SUCCESS',
    WARNING: 'WARNING',
    ERROR: 'ERROR',
}
const DURATIONS = {
    INFO: 7000,
    SUCCESS: 7000,
    WARNING: 7000,
    ERROR: 20000,
}
let idCounter = 1
const initialState = {
    notifications: [],
}
export default {
    namespaced: true,
    state: () => initialState,
    mutations: {
        add(state, notification) {
            state.notifications.push(notification)
        },
        remove(state, value) {
            state.notifications = state.notifications.filter(
                (item) => item.id !== value.id,
            )
        },
    },
    actions: {
        add({ commit }, { type, message }) {
            const notification = { id: idCounter++, type, message }
            return new Promise((resolve) => {
                commit('add', notification)
                setTimeout(() => {
                    commit('remove', notification)
                }, DURATIONS[type])
                resolve(notification)
            })
        },
        remove({ commit }, { notification }) {
            return new Promise((resolve) => {
                commit('remove', notification)
                resolve(notification)
            })
        },
    },
    getters: {},
}
export { TYPES }

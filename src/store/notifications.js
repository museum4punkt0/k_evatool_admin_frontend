const initialState = {
    notifications: [{ id: 0, type: 'ERROR', message: 'testmessage' }],
}
const types = {
    INFO: 'INFO',
    WARNING: 'WARNING',
    ERROR: 'ERROR',
}
const durations = {
    INFO: 5000,
    WARNING: 5000,
    ERROR: 5000,
}
var idCounter = 1
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
        add({ commit }, { type, message, duration }) {
            const notification = { id: idCounter++, type, message }
            return new Promise((resolve, reject) => {
                commit('add', notification)
                if (duration) {
                    setTimeout(() => {
                        commit('remove', notification)
                    }, duration)
                }
                resolve(notification)
            })
        },
        addInfo({ commit }, { message }) {
            const notification = { id: idCounter++, type: types.INFO, message }
            return new Promise((resolve, reject) => {
                commit('add', notification)
                setTimeout(() => {
                    commit('remove', notification)
                }, durations.INFO)
                resolve(notification)
            })
        },
        addWarning({ commit }, { message }) {
            const notification = {
                id: idCounter++,
                type: types.WARNING,
                message,
            }
            return new Promise((resolve, reject) => {
                commit('add', notification)
                setTimeout(() => {
                    commit('remove', notification)
                }, durations.WARNING)
                resolve(notification)
            })
        },
        addError({ commit }, { message }) {
            const notification = {
                id: idCounter++,
                type: types.ERROR,
                message,
            }
            return new Promise((resolve, reject) => {
                commit('add', notification)
                setTimeout(() => {
                    commit('remove', notification)
                }, durations.ERROR)
                resolve(notification)
            })
        },
        remove({ commit }, { notification }) {
            return new Promise((resolve, reject) => {
                commit('remove', notification)
                resolve(notification)
            })
        },
    },
    getters: {},
}

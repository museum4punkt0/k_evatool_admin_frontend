const TYPES = {
    INFO: 'INFO',
    SUCCESS: 'SUCCESS',
    WARNING: 'WARNING',
    ERROR: 'ERROR',
}
const durations = {
    INFO: 5000,
    SUCCESS: 5000,
    WARNING: 5000,
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
        add({ commit }, { type, message, duration }) {
            const notification = { id: idCounter++, type, message }
            return new Promise((resolve) => {
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
            const notification = { id: idCounter++, type: TYPES.INFO, message }
            return new Promise((resolve) => {
                commit('add', notification)
                setTimeout(() => {
                    commit('remove', notification)
                }, durations.INFO)
                resolve(notification)
            })
        },

        addSuccess({ commit }, { message }) {
            const notification = {
                id: idCounter++,
                type: TYPES.SUCCESS,
                message,
            }
            return new Promise((resolve) => {
                commit('add', notification)
                setTimeout(() => {
                    commit('remove', notification)
                }, durations.SUCCESS)
                resolve(notification)
            })
        },

        addWarning({ commit }, { message }) {
            const notification = {
                id: idCounter++,
                type: TYPES.WARNING,
                message,
            }
            return new Promise((resolve) => {
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
                type: TYPES.ERROR,
                message,
            }
            return new Promise((resolve) => {
                commit('add', notification)
                setTimeout(() => {
                    commit('remove', notification)
                }, durations.ERROR)
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

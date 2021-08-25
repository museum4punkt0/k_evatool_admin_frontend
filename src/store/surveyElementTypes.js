import service from '../services/surveyElementTypes'
const initialState = {
    elementTypes: [],
}
export default {
    namespaced: true,
    state: () => initialState,
    mutations: {
        set(state, value) {
            state.elementTypes = value
        },
    },
    actions: {
        getAllAndUpdateStore({ commit }) {
            service.getAll((value) => {
                commit('set', value)
            })
        },
    },
    getters: {},
}

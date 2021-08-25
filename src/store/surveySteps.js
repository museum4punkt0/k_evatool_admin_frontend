import service from '../services/surveySteps'
const initialState = {
    surveySteps: [],
}
export default {
    namespaced: true,
    state: () => initialState,
    mutations: {
        set(state, value) {
            state.surveySteps = value
        },
        add(state, value) {
            state.surveySteps.push(value)
        },
        delete(state, value) {
            state.surveySteps = state.surveySteps.filter(
                (item) => item.id !== value.id,
            )
        },
    },
    actions: {
        createOneAndUpdateStore({ commit }, data) {
            service.createOne(data, (value) => {
                commit('add', value)
            })
        },
        deleteOneAndUpdateStore({ commit }, { id }) {
            service.deleteOne(id, (value) => {
                commit('delete', value)
            })
        },
        getAllAndUpdateStore({ commit }) {
            service.getAll((value) => {
                commit('set', value)
            })
        },
    },
    getters: {},
}

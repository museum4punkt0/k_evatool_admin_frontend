import surveysService from '../../services/surveys'
const initialState = {
    surveys: [],
}
export default {
    namespaced: true,
    state: () => initialState,
    mutations: {
        setSurveys(state, value) {
            state.surveys = value
        },
    },
    actions: {
        refresh({ commit }) {
            surveysService.getAll((surveys) => {
                commit('setSurveys', surveys)
            })
        },
    },
    getters: {},
}

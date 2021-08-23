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
        addSurvey(state, value) {
            state.surveys.push(value)
        },
        removeSurvey(state, value) {
            state.surveys = state.surveys.filter(
                (survey) => survey.id !== value.id,
            )
        },
    },
    actions: {
        createOne({ commit }, data) {
            surveysService.createOne(data, (survey) => {
                commit('addSurvey', survey)
            })
        },
        deleteOne({ commit }, { id }) {
            surveysService.deleteOne(id, (survey) => {
                commit('removeSurvey', survey)
            })
        },
        refresh({ commit }) {
            surveysService.getAll((surveys) => {
                commit('setSurveys', surveys)
            })
        },
    },
    getters: {},
}

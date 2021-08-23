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
        createOneAndUpdateStore({ commit }, data) {
            surveysService.createOne(data, (survey) => {
                commit('addSurvey', survey)
            })
        },
        deleteOneAndUpdateStore({ commit }, { id }) {
            surveysService.deleteOne(id, (survey) => {
                commit('removeSurvey', survey)
            })
        },
        getAllAndUpdateStore({ commit }) {
            surveysService.getAll((surveys) => {
                commit('setSurveys', surveys)
            })
        },
    },
    getters: {},
}

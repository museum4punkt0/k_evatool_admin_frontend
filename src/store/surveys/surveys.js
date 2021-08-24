import surveysService from '../../services/surveys'
const initialState = {
    surveys: [],
    selectedSurvey: null,
}
export default {
    namespaced: true,
    state: () => initialState,
    mutations: {
        setSurveys(state, value) {
            state.surveys = value
        },
        setSelectedSurvey(state, value) {
            state.selectedSurvey = value
        },
        selectedSurvey(state, id) {
            // TODO: understand vuex, proxies, ....
            state.selectedSurvey = state.surveys.find((item) => item.id === id)
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
        getAllAndUpdateStore({ commit }) {
            surveysService.getAll((surveys) => {
                commit('setSurveys', surveys)
            })
        },
        selectOneAndUpdateStore({ commit }, { id }) {
            surveysService.getOne(id, (surveys) => {
                commit('setSelectedSurvey', surveys)
            })
        },
        createOneAndUpdateStore({ commit }, data) {
            surveysService.createOne(data, (survey) => {
                commit('addSurvey', survey)
            })
        },
        updateSelectedAndUpdateStore({ commit }, { id, data }) {
            surveysService.updateOne(id, data, (survey) => {
                commit('setSelectedSurvey', survey)
                // TODO: update already stored surveys
            })
        },
        deleteOneAndUpdateStore({ commit }, { id }) {
            surveysService.deleteOne(id, (survey) => {
                commit('removeSurvey', survey)
            })
        },
    },
    getters: {},
}

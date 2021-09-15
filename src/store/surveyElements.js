import SURVEY_ELEMENTS from '../services/surveyElements.js'

export default {
    namespaced: true,
    state: {
        data: [],
        meta: {},
    },
    mutations: {
        setSurveyElements(state, surveyElements) {
            state.data = surveyElements
        },
    },
    actions: {
        async getSurveyElements({ commit }) {
            const surveyElements = await SURVEY_ELEMENTS.getSurveyElements()
            commit('setSurveyElements', surveyElements.data)
        },
    },
}

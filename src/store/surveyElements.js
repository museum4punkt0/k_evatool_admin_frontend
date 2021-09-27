import SURVEY_ELEMENTS from '../services/surveyElementService.js'

export default {
    namespaced: true,
    state: {
        surveyElements: [],
        surveyElement: null,
    },
    mutations: {
        setSurveyElements(state, surveyElements) {
            state.surveyElements = surveyElements
        },
        setSurveyElement(state, surveyElement) {
            state.surveyElement = surveyElement
        },
    },
    actions: {
        async getSurveyElements({ commit }) {
            const surveyElements = await SURVEY_ELEMENTS.getSurveyElements()
            commit('setSurveyElements', surveyElements.data)
        },
        async getSurveyElement({ commit }, surveyElementId) {
            const surveyElement = await SURVEY_ELEMENTS.getSurveyElement(
                surveyElementId,
            )

            if (surveyElement.id) {
                commit('setSurveyElement', surveyElement)
            }
        },
        async deleteSurveyElement({ commit }, surveyElementId) {
            const surveyElements = await SURVEY_ELEMENTS.deleteSurveyElement(
                surveyElementId,
            )
            commit('setSurveyElements', surveyElements.data)
        },
    },
}

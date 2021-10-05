import SURVEY_RESULTS from '../services/surveyResultService'

export default {
    namespaced: true,
    state: {
        results: [],
    },
    mutations: {
        setSurveyResults(state, results) {
            state.results = results
        },
    },
    actions: {
        async getSurveyResults({ commit }, surveyId) {
            const results = await SURVEY_RESULTS.getSurveyResults(surveyId)
            commit('setSurveyResults', results)
        },
    },
}

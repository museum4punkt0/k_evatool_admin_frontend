import SURVEY_RESULTS from '../services/surveyResultService'

export default {
    namespaced: true,
    state: {
        results: [],
    },
    mutations: {
        setSurveySteps(state, steps) {
            state.steps = steps
        },
        setSurveyStepResults(state, results) {
            state.results = results
        },
    },
    actions: {
        async getSurveySteps({ commit }, surveyId) {
            const steps = await SURVEY_RESULTS.getSurveyResults(surveyId)
            commit('setSurveySteps', steps.data)
        },
        async getSurveyStepResults({ commit }, { surveyId, stepId }) {
            const results = await SURVEY_RESULTS.getSurveyStepResults(
                surveyId,
                stepId,
            )
            commit('setSurveyStepResults', results.data)
        },
    },
}

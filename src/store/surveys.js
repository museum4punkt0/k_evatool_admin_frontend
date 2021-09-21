import SURVEY_SERVICE from '../services/surveyService'
import SURVEY_ELEMENT_SERVICE from '../services/surveyElementService'

const initialState = {
    surveys: [],
    surveyId: -1,
    survey: null,
    surveyStepId: -1,
    surveyStep: null,
}
export default {
    namespaced: true,
    state: () => initialState,
    mutations: {
        setSurveys(state, value) {
            state.surveys = value
        },
        setSurvey(state, value) {
            state.survey = value
        },
        setSurveyId(state, value) {
            state.surveyId = value
        },
        setSurveySteps(state, steps) {
            state.survey.steps = steps
        },
        setSurveyStepId(state, surveyStepId) {
            state.surveyStepId = surveyStepId
        },
        setSurveyStep(state, surveyStep) {
            state.surveyStep = surveyStep
        },
        setSurveyStepElement(state, surveyElement) {
            state.surveyStep.surveyElement = surveyElement
        },
        setSurveyAdminLayout(state, surveyElement) {
            state.survey.adminLayout = surveyElement
        },
    },
    actions: {
        async getSurveys({ commit }) {
            const surveys = await SURVEY_SERVICE.getSurveys()
            commit('setSurveys', surveys)
        },
        async setSurveyId({ commit }, surveyId) {
            commit('setSurveyId', surveyId)
            const survey = await SURVEY_SERVICE.getSurvey(surveyId)
            commit('setSurvey', survey)
            const surveySteps = await SURVEY_SERVICE.getSurveySteps(surveyId)
            commit('setSurveySteps', surveySteps)
        },
        async setSurveyStepId({ commit }, { surveyStepId, surveyId }) {
            commit('setSurveyStepId', surveyStepId)
            if (surveyStepId > 0) {
                const surveyStep = await SURVEY_SERVICE.getSurveyStep(
                    surveyId,
                    surveyStepId,
                )
                commit('setSurveyStep', surveyStep)
                const surveyStepElement =
                    await SURVEY_ELEMENT_SERVICE.getSurveyElement(
                        surveyStep.surveyElementId,
                    )
                commit('setSurveyStepElement', surveyStepElement)
            }
        },
        unsetSurveyStepId({ commit }) {
            commit('setSurveyStepId', -1)
            commit('setSurveyStep', null)
        },
        setSurveyAdminLayout({ commit }, adminLayout) {
            commit('setSurveyAdminLayout', adminLayout)
        },
        async getSurveySteps({ commit }, surveyId) {
            const surveySteps = await SURVEY_SERVICE.getSurveySteps(surveyId)
            commit('setSurveySteps', surveySteps)
        },
    },
    getters: {},
}

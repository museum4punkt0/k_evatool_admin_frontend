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
        updateSurveyStep(state, surveyStep) {
            if (state.surveyStep?.id === surveyStep.id) {
                state.surveyStep = surveyStep
            }
            state.survey.steps = state.survey.steps.map((item) =>
                item.id === surveyStep.id ? surveyStep : item,
            )
        },
    },
    actions: {
        async getSurveys({ commit }) {
            const surveys = await SURVEY_SERVICE.getSurveys()
            commit('setSurveys', surveys)
        },
        async setSurveyId({ commit }, surveyId) {
            commit('setSurveyId', surveyId)
            if (surveyId > 0) {
                const survey = await SURVEY_SERVICE.getSurvey(surveyId)
                commit('setSurvey', survey)
                const surveySteps = await SURVEY_SERVICE.getSurveySteps(
                    surveyId,
                )
                commit('setSurveySteps', surveySteps)
            }
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
        async saveSurvey({ commit }, data) {
            const savedSurvey = await SURVEY_SERVICE.saveSurvey(data)
            if (savedSurvey.id) {
                commit('setSurveyId', savedSurvey.id)
                commit('setSurvey', savedSurvey)
                this.dispatch('surveys/getSurveySteps', savedSurvey.id)
                this.dispatch('surveys/getSurveys')
            }
        },
        async deleteSurvey({ dispatch }, surveyId) {
            await SURVEY_SERVICE.deleteSurvey(surveyId)
            await dispatch('getSurveys')
        },
        async setNextStep({ commit }, { surveyId, stepId, nextStepId }) {
            commit(
                'updateSurveyStep',
                await SURVEY_SERVICE.surveyStepSetNextStep(
                    surveyId,
                    stepId,
                    nextStepId,
                ),
            )
        },
        async removeNextStep({ commit }, { surveyId, stepId }) {
            commit(
                'updateSurveyStep',
                await SURVEY_SERVICE.surveyStepRemoveNextStep(surveyId, stepId),
            )
        },
    },
    getters: {},
}

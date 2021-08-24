import surveyStepsService from '../../services/surveySteps'
const initialState = {
    surveySteps: [],
}
export default {
    namespaced: true,
    state: () => initialState,
    mutations: {
        setSurveySteps(state, value) {
            state.surveySteps = value
        },
        addSurveyStep(state, value) {
            state.surveySteps.push(value)
        },
        removeSurveyStep(state, value) {
            state.surveySteps = state.surveySteps.filter(
                (item) => item.id !== value.id,
            )
        },
    },
    actions: {
        createOneAndUpdateStore({ commit }, data) {
            surveyStepsService.createOne(data, (item) => {
                commit('addSurveyStep', item)
            })
        },
        deleteOneAndUpdateStore({ commit }, { id }) {
            surveyStepsService.deleteOne(id, (item) => {
                commit('removeSurveyStep', item)
            })
        },
        getAllAndUpdateStore({ commit }) {
            surveyStepsService.getAll((items) => {
                commit('setSurveySteps', items)
            })
        },
    },
    getters: {},
}

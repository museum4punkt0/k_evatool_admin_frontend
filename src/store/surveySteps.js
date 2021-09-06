import surveyStepsService from '../services/surveySteps'
const initialState = {
    surveySteps: [],
}
export default {
    namespaced: true,
    state: () => initialState,
    mutations: {
        set(state, value) {
            state.surveySteps = value
        },
        add(state, value) {
            state.surveySteps.push(value)
        },
        replace(state, value) {
            state.surveySteps = state.surveySteps.map((item) =>
                item.id === value.id ? value : item,
            )
        },
        delete(state, value) {
            state.surveySteps = state.surveySteps.filter(
                (item) => item.id !== value.id,
            )
        },
    },
    actions: {
        createOneAndUpdateStore({ commit }, data) {
            surveyStepsService.createOne(data, (value) => {
                commit('add', value)
            })
        },
        deleteOneAndUpdateStore({ commit }, { id }) {
            surveyStepsService.deleteOne(id, (value) => {
                commit('delete', value)
            })
        },
        updateOneSurveyStep({ commit }, { id, data }) {
            surveyStepsService.updateOne(id, data, (value) => {
                commit('replace', value)
            })
        },
        getAllAndUpdateStore({ commit }) {
            surveyStepsService.getAll((value) => {
                commit('set', value)
            })
        },
        updateOneStepSelectAndUpdateStore({ commit }, { id, data }) {
            return new Promise((resolve, reject) => {
                surveyStepsService.updateOne(
                    id,
                    data,
                    (value) => {
                        commit('setSelected', value)
                        commit('replace', value)
                        resolve(value)
                    },
                    (error) => {
                        reject(error)
                    },
                )
            })
        },
    },
    getters: {},
}

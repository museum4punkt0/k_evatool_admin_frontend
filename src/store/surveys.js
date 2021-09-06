import surveysService from '../services/surveys'
import surveyStepsService from '../services/surveySteps'
const initialState = {
    surveys: [],
    selectedSurvey: null,
}
export default {
    namespaced: true,
    state: () => initialState,
    mutations: {
        set(state, value) {
            state.surveys = value
        },
        setSelected(state, value) {
            state.selectedSurvey = value
        },
        select(state, id) {
            state.selectedSurvey = state.surveys.find((item) => item.id === id)
        },
        add(state, value) {
            if (Array.isArray(value)) {
                // state.surveys = [...state.surveys, ...value]
                value.forEach((item) => {
                    state.surveys.push(item)
                })
            } else {
                state.surveys.push(value)
            }
        },
        delete(state, value) {
            state.surveys = state.surveys.filter(
                (survey) => survey.id !== value.id,
            )
        },
        replace(state, value) {
            state.surveys = state.surveys.map((item) =>
                item.id === value.id ? value : item,
            )
        },
        replaceSurveyStepOfSelectedSurvey(state, value) {
            // state.selectedSurvey.
            console.log(state, value)
        },
    },
    actions: {
        getAllAndUpdateStore({ commit }) {
            return new Promise((resolve, reject) => {
                surveysService.getAll(
                    (value) => {
                        commit('set', value)
                        resolve(value)
                    },
                    (error) => {
                        reject(error)
                    },
                )
            })
        },
        getOneSelectAndUpdateStore({ commit }, { id }) {
            return new Promise((resolve, reject) => {
                surveysService.getOne(
                    id,
                    (value) => {
                        surveysService.getAllSurveySteps(
                            id,
                            (steps) => {
                                value.steps = steps
                                commit('setSelected', value)
                                resolve(value)
                            },
                            (error) => reject(error),
                        )
                    },
                    (error) => reject(error),
                )
            })
        },
        createOneAndUpdateStore({ commit }, data) {
            return new Promise((resolve, reject) => {
                surveysService.createOne(
                    data,
                    (value) => {
                        commit('add', value)
                        resolve(value)
                    },
                    (error) => reject(error),
                )
            })
        },
        createOneSelectAndUpdateStore({ commit }, data) {
            return new Promise((resolve, reject) => {
                surveysService.createOne(
                    data,
                    (value) => {
                        commit('add', value)
                        commit('setSelected', value)
                        resolve(value)
                    },
                    (error) => {
                        reject(error)
                    },
                )
            })
        },
        updateOneSelectAndUpdateStore({ commit }, { id, data }) {
            return new Promise((resolve, reject) => {
                surveysService.updateOne(
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
        deleteOneSelectAndUpdateStore({ commit }, { id }) {
            return new Promise((resolve, reject) => {
                surveysService.deleteOne(
                    id,
                    (value) => {
                        commit('delete', value.id)
                        commit('setSelected', null)
                        resolve(value)
                    },
                    (error) => {
                        reject(error)
                    },
                )
            })
        },
        deleteOneAndUpdateStore({ commit }, { id }) {
            return new Promise((resolve, reject) => {
                surveysService.deleteOne(
                    id,
                    (value) => {
                        commit('delete', value)
                        resolve(value)
                    },
                    (error) => {
                        reject(error)
                    },
                )
            })
        },
        updateOneSurveyStepAndAddToSelected({ commit }, { id, data }) {
            return new Promise((resolve, reject) => {
                console.log(id, data)
                surveyStepsService.updateOne(
                    id,
                    data,
                    (value) => {
                        console.log('survey step updated', value)
                        // commit('delete', value)
                        resolve(value)
                    },
                    (error) => {
                        console.log('cannot update survey steop', error)
                        reject(error)
                    },
                )
            })
        },
    },
    getters: {},
}

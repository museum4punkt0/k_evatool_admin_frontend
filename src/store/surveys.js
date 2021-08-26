import service from '../services/surveys'
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
            // TODO: understand vuex, proxies, ....
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
    },
    actions: {
        getAllAndUpdateStore({ commit }) {
            return new Promise((resolve, reject) => {
                service.getAll(
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
        selectOneAndUpdateStore({ commit }, { id }) {
            return new Promise((resolve, reject) => {
                service.getOne(
                    id,
                    (value) => {
                        commit('setSelected', value)
                        resolve(value)
                    },
                    (error) => reject(error),
                )
            })
        },
        createOneAndUpdateStore({ commit }, data) {
            return new Promise((resolve, reject) => {
                service.createOne(
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
                service.createOne(
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
                service.updateOne(
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
                service.deleteOne(
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
                service.deleteOne(
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
    },
    getters: {},
}

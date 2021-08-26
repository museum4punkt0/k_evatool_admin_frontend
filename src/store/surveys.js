import { routeLocationKey } from 'vue-router'
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
    },
    actions: {
        getAllAndUpdateStore({ commit }) {
            service.getAll((value) => {
                commit('set', value)
            })
        },
        selectOneAndUpdateStore({ commit }, { id }) {
            service.getOne(id, (value) => {
                commit('setSelected', value)
            })
        },
        createOneAndUpdateStore({ commit }, data) {
            service.createOne(data, (value) => {
                commit('add', value)
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
                // )
            })
        },
        updateOneSelectAndUpdateStore({ commit }, { id, data }) {
            service.updateOne(id, data, (value) => {
                commit('setSelected', value)
                // TODO: update already stored surveys
            })
        },
        deleteOneSelectAndUpdateStore({ commit }, { id }) {
            service.deleteOne(id, (value) => {
                commit('delete', value.id)
                commit('setSelected', null)
            })
        },
        deleteOneAndUpdateStore({ commit }, { id }) {
            service.deleteOne(id, (value) => {
                commit('delete', value)
            })
        },
    },
    getters: {},
}

import surveyLanguagesService from '../services/surveyLanguages'
const initialState = {
    languages: [],
    selectedLanguage: null,
}
export default {
    namespaced: true,
    state: () => initialState,
    mutations: {
        set(state, languages) {
            state.languages = languages
        },
        setSelected(state, language) {
            state.selectedLanguage = language
        },
        select(state, id) {
            state.selectedLanguage = state.languages.find(
                (item) => item.id === id,
            )
            console.log(state.languages, id)
        },
        add(state, language) {
            state.languages.push(language)
        },
        delete(state, id) {
            state.languages = state.languages.filter(
                (language) => language.id !== id,
            )
        },
        replace(state, value) {
            state.languages = state.languages.map((item) =>
                item.id === value.id ? value : item,
            )
        },
    },
    actions: {
        getAllLanguagesAndUpdateStore({ commit }) {
            return new Promise((resolve, reject) => {
                surveyLanguagesService.getAll(
                    (value) => {
                        commit('set', value)
                        resolve(value)
                    },
                    (error) => reject(error),
                )
            })
        },
        getOneLanguageSelectAndUpdateStore({ commit }, { id }) {
            return new Promise((resolve, reject) => {
                surveyLanguagesService.getOne(
                    id,
                    (value) => {
                        commit('setSelected', value)
                        resolve(value)
                    },
                    (error) => reject(error),
                )
            })
        },
        createOneLanguageAndUpdateStore({ commit }, data) {
            return new Promise((resolve, reject) => {
                surveyLanguagesService.createOne(
                    data,
                    (value) => {
                        commit('add', value)
                        resolve(value)
                    },
                    (error) => reject(error),
                )
            })
        },
        createOneLanguageSelectAndUpdateStore({ commit }, data) {
            return new Promise((resolve, reject) => {
                surveyLanguagesService.createOne(
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
        updateOneLanguageAndUpdateStore({ commit }, { id, data }) {
            return new Promise((resolve, reject) => {
                surveyLanguagesService.updateOne(
                    id,
                    data,
                    (value) => {
                        commit('replace', value)
                        resolve(value)
                    },
                    (error) => reject(error),
                )
            })
        },
        updateOneLangaugeSelectAndUpdateStore({ commit }, { id, data }) {
            return new Promise((resolve, reject) => {
                surveyLanguagesService.updateOne(
                    id,
                    data,
                    (value) => {
                        commit('setSelected', value)
                        commit('replace', value)
                        resolve(value)
                    },
                    (error) => reject(error),
                )
            })
        },
        deleteOneLanguageAndUpdateStore({ commit }, { id }) {
            return new Promise((resolve, reject) => {
                surveyLanguagesService.deleteOne(
                    id,
                    (value) => {
                        commit('delete', value.id)
                        resolve(value)
                    },
                    (error) => reject(error),
                )
            })
        },
        deleteOneLanguageSelectAndUpdateStore({ commit }, { id }) {
            return new Promise((resolve, reject) => {
                surveyLanguagesService.deleteOne(
                    id,
                    (value) => {
                        commit('delete', value.id)
                        commit('setSelected', null)
                        resolve(value)
                    },
                    (error) => reject(error),
                )
            })
        },
    },
    getters: {},
}

import service from '../services/surveyLanguages'
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
            // TODO: understand vuex, proxies, ....
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
        getAllAndUpdateStore({ commit }) {
            service.getAll((value) => {
                commit('set', value)
            })
        },
        selectOneAndUpdateStore({ commit }, { id }) {
            //     commit('select', id)
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
            })
        },
        updateOneAndUpdateStore({ commit }, { id, data }) {
            service.updateOne(id, data, (value) => {
                commit('replace', value)
            })
        },
        deleteOneAndUpdateStore({ commit }, { id }) {
            service.deleteOne(id, (value) => {
                commit('delete', value.id)
            })
        },
        deleteSelectedAndUpdateStore({ commit }, { id }) {
            service.deleteOne(id, (value) => {
                commit('delete', value.id)
                commit('setSelected', null)
            })
        },
    },
    getters: {},
}

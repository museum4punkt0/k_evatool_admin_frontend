import surveyLanguagesService from '../../services/surveyLanguages'
const initialState = {
    languages: [],
    selectedLanguage: null,
}
export default {
    namespaced: true,
    state: () => initialState,
    mutations: {
        setLanguages(state, languages) {
            state.languages = languages
        },
        setSelectedLanguage(state, language) {
            state.selectedLanguage = language
        },
        selectLanguage(state, id) {
            // TODO: understand vuex, proxies, ....
            state.selectedLanguage = state.languages.find(
                (item) => item.id === id,
            )
            console.log(state.languages, id)
        },
        addLanguage(state, language) {
            state.languages.push(language)
        },
        deleteLanguage(state, id) {
            state.languages = state.languages.filter(
                (language) => language.id !== id,
            )
        },
        replaceLanguage(state, replacement) {
            state.languages = state.languages.map((language) =>
                language.id === replacement.id ? replacement : language,
            )
        },
    },
    actions: {
        getAllAndUpdateStore({ commit }) {
            surveyLanguagesService.getAll((surveyLanguages) => {
                commit('setLanguages', surveyLanguages)
            })
        },
        selectOneAndUpdateStore({ commit }, { id }) {
            //     commit('selectLanguage', id)
            surveyLanguagesService.getOne(id, (surveyLanguage) => {
                commit('setSelectedLanguage', surveyLanguage)
            })
        },
        createOneAndUpdateStore({ commit }, data) {
            surveyLanguagesService.createOne(data, (language) => {
                commit('addLanguage', language)
            })
        },
        updateOneAndUpdateStore({ commit }, { id, data }) {
            surveyLanguagesService.updateOne(id, data, (language) => {
                commit('replaceLanguage', language)
            })
        },
        deleteOneAndUpdateStore({ commit }, { id }) {
            surveyLanguagesService.deleteOne(id, (language) => {
                commit('deleteLanguage', language.id)
            })
        },
        deleteSelectedAndUpdateStore({ commit }, { id }) {
            surveyLanguagesService.deleteOne(id, (language) => {
                commit('deleteLanguage', language.id)
                commit('setSelectedLanguage', null)
            })
        },
    },
    getters: {},
}

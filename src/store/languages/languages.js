import surveyLanguagesService from '../../services/surveyLanguages'
const initialState = {
    languages: [],
}
export default {
    namespaced: true,
    state: () => initialState,
    mutations: {
        setLanguages(state, languages) {
            state.languages = languages
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
        refresh({ commit }) {
            surveyLanguagesService.getAll((surveyLanguages) => {
                commit('setLanguages', surveyLanguages)
            })
        },
        addLanguage({ commit }, data) {
            surveyLanguagesService.createOne(data, (language) => {
                commit('addLanguage', language)
            })
        },
        updateLanguage({ commit }, { id, data }) {
            surveyLanguagesService.updateOne(id, data, (language) => {
                commit('replaceLanguage', language)
            })
        },
        deleteLanguage({ commit }, id) {
            surveyLanguagesService.deleteOne(id, (language) => {
                commit('deleteLanguage', language.id)
            })
        },
    },
    getters: {},
}

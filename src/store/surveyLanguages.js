import surveyLanguagesService from '../services/surveyLanguageService'

const initialState = {
    languages: [],
    language: null,
    defaultLanguage: null,
    secondaryLanguages: [],
}
export default {
    namespaced: true,
    state: () => initialState,
    mutations: {
        setLanguages(state, languages) {
            state.languages = languages
            state.defaultLanguage = state.languages.find((x) => x.default)
            state.secondaryLanguages = state.languages.filter(
                (x) => !x.default && x.published,
            )
            state.activeLanguages = state.languages.filter((x) => x.published)
        },
        setLanguage(state, language) {
            state.language = language
        },
    },
    actions: {
        async getLanguages({ commit }) {
            const languages = await surveyLanguagesService.getLanguages()
            commit('setLanguages', languages.data)
        },
    },
    getters: {},
}

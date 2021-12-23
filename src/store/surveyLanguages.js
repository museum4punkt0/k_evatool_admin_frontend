import surveyLanguagesService from '../services/surveyLanguageService'

const initialState = {
    languages: [],
    language: localStorage.getItem('language')
        ? JSON.parse(localStorage.getItem('language'))
        : null,
    defaultLanguage: null,
    maintainLanguage: null,
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
            state.maintainLanguage = state.languages[0]
        },
        setLanguage(state, language) {
            state.language = language
        },
        setMaintainLanguage(state, language) {
            state.maintainLanguage = language
        },
    },
    actions: {
        async getLanguages({ commit }) {
            const languages = await surveyLanguagesService.getLanguages()
            commit('setLanguages', languages.data)
        },
        async setLanguage({ commit }, language) {
            commit('setLanguage', language)
            localStorage.setItem('language', JSON.stringify(language))
        },
        setMaintainLanguage({ commit }, language) {
            commit('setMaintainLanguage', language)
        },
    },
    getters: {},
}

import surveyLanguagesService from '../../services/surveyLanguages'
const initialState = {
    languages: [],
}
export default {
    namespaced: true,
    state: () => initialState,
    mutations: {
        setLanguages(state, value) {
            state.languages = value
        },
    },
    actions: {
        fetchLanguagesAndSet({ commit }) {
            surveyLanguagesService.getAll((surveyLanguages) => {
                commit('setLanguages', surveyLanguages)
            })
        },
    },
    getters: {},
}

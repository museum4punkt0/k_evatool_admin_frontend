import surveyElementTypesService from '../services/surveyElementTypes'
const initialState = {
    elementTypes: [],
}
export default {
    namespaced: true,
    state: () => initialState,
    mutations: {
        set(state, value) {
            state.elementTypes = value
        },
    },
    actions: {
        getAllElementTypesAndUpdateStore({ commit }) {
            surveyElementTypesService.getAll((value) => {
                commit('set', value)
            })
        },
    },
    getters: {},
}

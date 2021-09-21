import surveyElementTypesService from '../services/surveyElementTypeService'
const initialState = {
    elementTypes: [],
    data: null,
}
export default {
    namespaced: true,
    state: () => initialState,
    mutations: {
        setElementTypes(state, value) {
            state.elementTypes = value
            state.data = value
        },
    },
    actions: {
        getAllElementTypesAndUpdateStore({ commit }) {
            surveyElementTypesService.getAll((value) => {
                commit('setElementTypes', value)
            })
        },
    },
    getters: {},
}

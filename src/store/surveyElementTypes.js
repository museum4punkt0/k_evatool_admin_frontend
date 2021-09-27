import surveyElementTypesService from '../services/surveyElementTypeService'
import _ from 'lodash'

const initialState = {
    elementTypes: [],
    data: null,
}
export default {
    namespaced: true,
    state: () => initialState,
    mutations: {
        setElementTypes(state, data) {
            state.elementTypes = data
        },
    },
    actions: {
        async getElementTypes({ commit }) {
            const elementTypes =
                await surveyElementTypesService.getElementTypes()
            const data = _.orderBy(elementTypes.data, ['name'], ['asc'])
            commit('setElementTypes', data)
        },
    },
    getters: {},
}

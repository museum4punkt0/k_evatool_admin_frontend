import service from '../services/surveyLocalizationService'
const initialState = {
    localization: [],
    selectedLocalization: null,
}
export default {
    namespaced: true,
    state: () => initialState,
    mutations: {
        set(state, value) {
            state.localizations = value
        },
        setSelected(state, value) {
            state.selected = value
        },
        select(state, id) {
            // TODO: understand vuex, proxies, ....
            state.selected = state.localizations.find((item) => item.id === id)
        },
        add(state, value) {
            state.localizations.push(value)
        },
        delete(state, id) {
            state.localization = state.localization.filter(
                (item) => item.id !== id,
            )
        },
        replace(state, value) {
            state.localization = state.localizations.map((item) =>
                item.id === value.id ? value : item,
            )
        },
    },
    actions: {
        getAllAndUpdateStore({ commit }) {
            service.getAll((values) => {
                commit('set', values)
            })
        },
        selectOneAndUpdateStore({ commit }, { id }) {
            // commit('select', id)
            service.getOne(id, (value) => {
                commit('setSelected', value)
            })
        },
        createOneAndUpdateStore({ commit }, data) {
            service.createOne(data, (value) => {
                commit('add', value)
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

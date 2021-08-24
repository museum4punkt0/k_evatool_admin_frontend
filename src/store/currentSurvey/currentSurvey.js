import surveysService from '../../services/surveys'
const initialState = {
    survey: null,
}
export default {
    namespaced: true,
    state: () => initialState,
    mutations: {
        clear(state) {
            Object.assign(state, initialState)
        },
        setSurvey(state, survey) {
            state.survey = survey
        },
    },
    actions: {
        clear({ commit }) {
            commit('clear')
        },
        getOneAndUpdateStore({ commit }, { id }) {
            surveysService.getOne(id, (survey) => {
                commit('setSurvey', survey)
            })
        },
        updateOneAndUpdateStore({ commit }, { id, data }) {
            surveysService.updateOne(id, data, (survey) => {
                commit('setSurvey', survey)
            })
        },
    },
    getters: {},
}

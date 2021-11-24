import SURVEYSTATS_SERVICE from '../services/surveyStatsService'

const initialState = {
    stats: null,
}

export default {
    namespaced: true,
    state: () => initialState,
    mutations: {
        setStats(state, stats) {
            state.stats = stats
        },
    },
    actions: {
        async getStats({ commit }, { surveyId, start, end }) {
            const stats = await SURVEYSTATS_SERVICE.getStats(
                surveyId,
                start,
                end,
            )
            commit('setStats', stats)
        },
    },
    getters: {},
}

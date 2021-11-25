import SURVEYSTATS_SERVICE from '../services/surveyStatsService'

const initialState = {
    stats: null,
    results: [],
}

export default {
    namespaced: true,
    state: () => initialState,
    mutations: {
        setStats(state, stats) {
            state.stats = stats
        },
        clearResults(state) {
            state.results = []
        },
        addResults(state, results) {
            state.results = [...state.results, ...results]
        },
    },
    actions: {
        async getStats({ commit }, { surveyId, start, end, demo }) {
            const stats = await SURVEYSTATS_SERVICE.getStats(
                surveyId,
                start,
                end,
                demo,
            )
            commit('setStats', stats)
        },
        async clearResults({ commit }) {
            commit('clearResults')
        },
        async getStatsList(
            { commit, dispatch },
            { surveyId, start, end, demo, page },
        ) {
            if (!page) {
                dispatch('clearResults')
                page = 1
            }
            const results = await SURVEYSTATS_SERVICE.getStatsList(
                surveyId,
                start,
                end,
                demo,
                page,
            )
            commit('addResults', results.data)
            if (results.current_page < results.last_page) {
                dispatch('getStatsList', {
                    surveyId,
                    start,
                    end,
                    demo,
                    page: results.current_page + 1,
                })
            }
        },
    },
    getters: {},
}

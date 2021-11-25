import SURVEYSTATS_SERVICE from '../services/surveyStatsService'
import SURVEY_SERVICE from '../services/surveyService'

const initialState = {
    stats: null,
    results: [],
    surveySteps: [],
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
        setSurveySteps(state, surveySteps) {
            state.surveySteps = surveySteps
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
        async getSurveySteps({ commit }, surveyId) {
            const surveySteps = await SURVEY_SERVICE.getSurveySteps(surveyId)
            commit('setSurveySteps', surveySteps)
        },
    },
    getters: {},
}

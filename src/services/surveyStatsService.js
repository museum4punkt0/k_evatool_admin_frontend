import axios from 'axios'

export default {
    async getStats(surveyId, start, end, demo) {
        return axios
            .get(
                `evaluation-tool/surveys/${surveyId}/stats?${
                    demo ? 'demo=1' : ''
                }&all&start=${start}&end=${end}`,
            )
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                return error.response
            })
    },
    async getStatsList(surveyId, start, end, demo, page) {
        return axios
            .get(
                `evaluation-tool/surveys/${surveyId}/stats-list?${
                    demo ? 'demo=1' : ''
                }&perPage=500&start=${start}&end=${end}${
                    page ? '&page=' + page : ''
                }`,
            )
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                return error.response
            })
    },
    async getStatsTrend(surveyId) {
        return axios
            .get(`evaluation-tool/surveys/${surveyId}/stats-trend`)
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                return error.response
            })
    },
}

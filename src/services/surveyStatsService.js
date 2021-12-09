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
    async getStatsStepList(surveyId, stepId, start, end, demo) {
        return axios
            .get(
                `evaluation-tool/surveys/${surveyId}/stats/${stepId}?${
                    demo ? 'demo=1' : ''
                }&perPage=500&start=${start}&end=${end}`,
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
    async exportStats(params, execute = false) {
        if (execute) {
            params.execute = true
        } else {
            delete params.exportType
        }
        let url = `evaluation-tool/surveys/${params.surveyId}/stats-export`

        return axios
            .post(url, params)
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                return error.response
            })
    },
    async downloadExport(surveyId, params) {
        let url = `evaluation-tool/surveys/${surveyId}/stats-download`

        console.log(params)

        const payload = {
            filehash: params.hash,
            filename: params.filename,
        }

        console.log(url)
        console.log(payload)

        return axios
            .post(url, payload)
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                return error.response
            })
    },
}

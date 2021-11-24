import axios from 'axios'

export default {
    async getStats(surveyId) {
        return axios
            .get(
                `evaluation-tool/surveys/${surveyId}/stats?demo=1&start=2001-10-20&end=2021-11-22`,
            )
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                return error.response
            })
    },
}

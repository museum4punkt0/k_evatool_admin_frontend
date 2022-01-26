import axios from 'axios'

export default {
    async getSurveyResults(surveyId) {
        const url = 'evaluation-tool/surveys/' + surveyId + '/results?all'
        return axios
            .get(url)
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                console.log(error)
            })
    },
    async getSurveyStepResults(surveyId, stepId) {
        const url =
            'evaluation-tool/surveys/' +
            surveyId +
            '/results/' +
            stepId +
            '?all'
        return axios
            .get(url)
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                console.log(error)
            })
    },
}

import axios from 'axios'

export default {
    async getSurveySteps(surveyId) {
        const url = 'evaluation-tool/surveys/' + surveyId + '/results'
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
        const url = 'evaluation-tool/surveys/' + surveyId + '/results/' + stepId
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

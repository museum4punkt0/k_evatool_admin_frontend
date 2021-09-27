import axios from 'axios'

export default {
    getElementTypes() {
        const url = 'evaluation-tool/survey-element-types'
        return axios
            .get(url)
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                return error
            })
    },
    getSurveyElement(surveyElementId) {
        const url = 'evaluation-tool/survey-element-types/' + surveyElementId
        return axios
            .get(url)
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                return error
            })
    },
}

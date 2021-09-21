import axios from 'axios'

export default {
    async getSurveyElements() {
        return axios
            .get('evaluation-tool/survey-elements?all')
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                return error.response
            })
    },

    async getSurveyElement(surveyElementId) {
        return axios
            .get('evaluation-tool/survey-elements/' + surveyElementId)
            .then((response) => {
                return response.data.data
            })
            .catch((error) => {
                return error.response
            })
    },

    async saveSurveyElement(data) {
        let method = 'post'
        let url = 'evaluation-tool/survey-elements'
        if (data.id) {
            method = 'put'
            url += '/' + data.id
        }

        return axios({ url, method, data })
            .then((response) => {
                return response.data.data
            })
            .catch((error) => {
                return error.response
            })
    },
}

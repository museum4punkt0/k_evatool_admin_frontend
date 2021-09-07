import axios from 'axios'

export default {
    async SURVEY_ELEMENTS_get() {
        return axios
            .get('evaluation-tool/survey-elements?all')
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                return error.response
            })
    },
}

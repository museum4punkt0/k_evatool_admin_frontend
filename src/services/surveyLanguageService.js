import axios from 'axios'

export default {
    async getLanguages() {
        const url = 'evaluation-tool/survey-languages?all'
        return axios
            .get(url)
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                console.log(error)
            })
    },
    async getLanguage(languageId) {
        const url = 'evaluation-tool/survey-languages/' + languageId
        return axios
            .get(url)
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                console.log(error)
            })
    },
    async saveLanguage(data) {
        let url = 'evaluation-tool/survey-languages'
        let method = 'post'
        if (data.id) {
            method = 'put'
            url += '/' + data.id
        }

        axios({ url, method, data })
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                console.log(error)
            })
    },

    async deleteLanguage(languageId) {
        const url = 'evaluation-tool/survey-languages/' + languageId
        axios
            .delete(url)
            .then((response) => {
                response.data
            })
            .catch((error) => {
                console.log(error)
            })
    },
}

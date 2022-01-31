import axios from 'axios'

export default {
    saveSetting(setting) {
        console.log(setting)
        let url = 'evaluation-tool/settings'
        let method = 'post'
        if (setting.id) {
            url += '/' + setting.id
            method = 'put'
        }

        return axios({ method, url, data: setting })
            .then((response) => {
                return response.data.data
            })
            .catch((error) => {
                return error
            })
    },

    async getSettings() {
        let url = 'evaluation-tool/settings?all'
        return axios
            .get(url)
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                return error
            })
    },

    async getSetting(settingId) {
        let url = 'evaluation-tool/settings/' + settingId
        return axios
            .get(url)
            .then((response) => {
                return response.data.data
            })
            .catch((error) => {
                return error
            })
    },

    async deleteSetting(settingId) {
        return axios
            .delete('evaluation-tool/settings/' + settingId)
            .then((response) => {
                return response.data.data
            })
            .catch((error) => {
                return error.response
            })
    },
}

import axios from 'axios'

export default {
    async getAssets(page = 1) {
        return axios
            .get('evaluation-tool/assets?all&perPage=10&page=' + page)
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                return error.response
            })
    },
    async getAsset(assetId) {
        return axios
            .get('evaluation-tool/assets/' + assetId)
            .then((response) => {
                return response.data.data
            })
            .catch((error) => {
                return error.response
            })
    },
    async deleteAsset(assetId) {
        return axios
            .delete('evaluation-tool/assets/' + assetId)
            .then((response) => {
                return response.data.data
            })
            .catch((error) => {
                return error.response
            })
    },
}

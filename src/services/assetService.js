import axios from 'axios'

export default {
    async ASSETS_get(page = 1) {
        return axios
            .get('evaluation-tool/assets?all&perPage=10&page=' + page)
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                return error.response
            })
    },
}

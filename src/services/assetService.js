import axios from 'axios'

export default {
    async ASSETS_get() {
        return axios
            .get('evaluation-tool/assets?perPage=10')
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                return error.response
            })
    },
}

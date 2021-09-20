import axios from 'axios'

export default {
    async getApp() {
        return axios
            .get('app')
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                return error.response
            })
    },
}

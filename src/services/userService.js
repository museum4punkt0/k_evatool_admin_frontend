import axios from 'axios'

export default {
    async getUsers(page = 1) {
        return axios
            .get('users/perPage=25&page=' + page)
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                return error.response
            })
    },
    async getUser(userId) {
        return axios
            .get('users/' + userId)
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                return error.response
            })
    },
    async loginUser(data) {
        return axios
            .post(import.meta.env.VITE_API_BASE_URL_AUTH + '/token', data)
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                return error.response
            })
    },
}

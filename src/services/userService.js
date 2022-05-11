import axios from 'axios'

export default {
    async getUsers() {
        return axios
            .get('users')
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
    async saveUser(user) {
        let method = 'post'
        let url = 'users'
        if (user.id) {
            method = 'put'
            url += '/' + user.id
        }
        return axios({ url, method, data: user })
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                return error.response
            })
    },
    async checkLogin() {
        return axios
            .get('users/check-login')
            .then((response) => {
                // return null for unauthenticated user
                if (response.data === 'Unauthenticated.') {
                    return null
                }
                return response.data
            })
            .catch((error) => {
                return error.response
            })
    },
    async inviteUser(userId) {
        const url = 'users/' + userId + '/invite'
        const data = {
            confirm_url: import.meta.env.VITE_BASE_URL + '/confirm-invitation',
        }
        return axios
            .post(url, data)
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                return error.response
            })
    },
    async confirmPassword(token, password) {
        const url = 'users/confirm-password'
        const data = { token, password }

        return axios
            .post(url, data)
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                return error.response
            })
    },
    async getAllRoles() {
        return axios
            .get('http://localhost:8085/api/roles')
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                return error.response
            })
    },
    async deleteUser(userId, userToDelete) {
        return axios
            .delete(
                `http://localhost:8085/api/users/${userId}/delete/${userToDelete}`,
            )
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                return error.response
            })
    },
}

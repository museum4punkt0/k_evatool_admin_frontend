import axios from 'axios'

const prefix = (value) => `${import.meta.env.VITE_API_BASE_URL_API}/${value}`
const urls = {
    getAll: () => prefix(`evaluation-tool/survey-element-types`),
    getOne: (id) => prefix(`evaluation-tool/survey-element-types/${id}`),
}

export default {
    async getAll(successCallback, errorCallback) {
        const url = urls.getAll()

        if (successCallback) {
            axios
                .get(url)
                .then((response) => {
                    if (response.data) {
                        successCallback(response.data.data)
                    } else if (errorCallback) {
                        errorCallback(response)
                    } else {
                        console.error('could not get all survey element types')
                    }
                })
                .catch((error) => {
                    if (errorCallback) {
                        errorCallback(error)
                    }
                })
        } else {
            const response = await axios.get(url)
            return response.data
        }
    },
    async getOne(id, successCallback, errorCallback) {
        const url = urls.getOne(id)

        if (successCallback) {
            axios
                .get(url)
                .then((response) => {
                    if (response.data) {
                        successCallback(response.data.data)
                    } else if (errorCallback) {
                        errorCallback(response)
                    } else {
                        console.error('could not get one element type', id)
                    }
                })
                .catch((error) => {
                    if (errorCallback) {
                        errorCallback(error)
                    }
                })
        } else {
            const response = await axios.get(url)
            return response.data.data
        }
    },
}

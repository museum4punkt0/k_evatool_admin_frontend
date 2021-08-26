import axios from 'axios'

const prefix = (value) => `${import.meta.env.VITE_API_BASE_URL}/${value}`
const urls = {
    getAll: () => prefix(`evaluation-tool/survey-steps`),
    getOne: (id) => prefix(`evaluation-tool/survey-steps/${id}`),
    createOne: () => prefix(`evaluation-tool/survey-steps`),
    updateOne: (id) => prefix(`evaluation-tool/survey-steps/${id}`),
    deleteOne: (id) => prefix(`evaluation-tool/survey-steps/${id}`),
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
                        console.error('could not get all survey steps')
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
                        console.error('could not get one survey step', id)
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
    async createOne(data, successCallback, errorCallback) {
        const url = urls.createOne()
        const method = 'post'

        if (successCallback) {
            axios({ url, method, data })
                .then((response) => {
                    if (response.data) {
                        successCallback(response.data.data)
                    } else if (errorCallback) {
                        errorCallback(response)
                    } else {
                        console.error('could not create one survey step', data)
                    }
                })
                .catch((error) => {
                    if (errorCallback) {
                        errorCallback(error)
                    }
                })
        } else {
            const response = await axios({ url, method, data })
            return response.data.data
        }
    },
    async updateOne(id, data, successCallback, errorCallback) {
        const url = urls.updateOne(id)
        const method = 'put'

        if (successCallback) {
            axios({ url, method, data })
                .then((response) => {
                    if (response.data) {
                        successCallback(response.data.data)
                    } else if (errorCallback) {
                        errorCallback(response)
                    } else {
                        console.error(
                            'could not update one survey step',
                            id,
                            data,
                        )
                    }
                })
                .catch((error) => {
                    if (errorCallback) {
                        errorCallback(error)
                    }
                })
        } else {
            const response = await axios({ url, method, data })
            return response.data.data
        }
    },
    async deleteOne(id, successCallback, errorCallback) {
        const url = urls.deleteOne(id)
        const method = 'delete'

        if (successCallback) {
            axios({ url, method })
                .then((response) => {
                    if (response.data) {
                        successCallback(response.data.data)
                    } else if (errorCallback) {
                        errorCallback(response)
                    } else {
                        console.error('could not delete one survey step', id)
                    }
                })
                .catch((error) => {
                    if (errorCallback) {
                        errorCallback(error)
                    }
                })
        } else {
            const response = await axios({ url, method })
            return response.data.data
        }
    },
}

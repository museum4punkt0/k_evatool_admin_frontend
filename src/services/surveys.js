import axios from 'axios'

const prefix = (value) => `${import.meta.env.VITE_API_BASE_URL}/${value}`
const urls = {
    getAll: () => prefix(`evaluation-tool/surveys`),
    getOne: (id) => prefix(`evaluation-tool/surveys/${id}`),
    createOne: () => prefix(`evaluation-tool/surveys`),
    updateOne: (id) => prefix(`evaluation-tool/surveys/${id}`),
    deleteOne: (id) => prefix(`evaluation-tool/surveys/${id}`),
    getAllSurveySteps: (id) =>
        prefix(`evaluation-tool/surveys/${id}/survey-steps`),
    deleteOneSurveyStep: (id, stepId) =>
        prefix(`evaluation-tool/surveys/${id}/survey-steps/${stepId}`),
}

export default {
    async getAll(successCallback, errorCallback) {
        const url = urls.getAll()

        if (successCallback) {
            axios.get(url).then((response) => {
                if (response.data) {
                    successCallback(response.data.data)
                } else if (errorCallback) {
                    errorCallback(response)
                } else {
                    console.error('could not get all surveys')
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
            axios.get(url).then((response) => {
                if (response.data) {
                    successCallback(response.data.data)
                } else if (errorCallback) {
                    errorCallback(response)
                } else {
                    console.error('could not get one survey', id)
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
            axios({ url, method, data }).then((response) => {
                if (response.data) {
                    successCallback(response.data.data)
                } else if (errorCallback) {
                    errorCallback(response)
                } else {
                    console.error('could not create one survey', data)
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
            axios({ url, method, data }).then((response) => {
                if (response.data) {
                    successCallback(response.data.data)
                } else if (errorCallback) {
                    errorCallback(response)
                } else {
                    console.error('could not update one survey', id, data)
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
            axios({ url, method }).then((response) => {
                if (response.data) {
                    successCallback(response.data.data)
                } else if (errorCallback) {
                    errorCallback(response)
                } else {
                    console.error('could not delete one survey', id)
                }
            })
        } else {
            const response = await axios({ url, method })
            return response.data.data
        }
    },
    async getAllSurveySteps(id, successCallback, errorCallback) {
        const url = urls.getAllSurveySteps(id)

        if (successCallback) {
            axios.get(url).then((response) => {
                if (response.data) {
                    successCallback(response.data)
                } else if (errorCallback) {
                    errorCallback(response)
                } else {
                    console.error('could not get all survey steps')
                }
            })
        } else {
            const response = await axios.get(url)
            return response.data
        }
    },
    async deleteOneSurveyStep(id, stepId, successCallback, errorCallback) {
        const url = urls.deleteOneSurveyStep(id, stepId)

        if (successCallback) {
            axios.get(url).then((response) => {
                if (response.data) {
                    successCallback(response.data)
                } else if (errorCallback) {
                    errorCallback(response)
                } else {
                    console.error('could not delete one survey step')
                }
            })
        } else {
            const response = await axios.get(url)
            return response.data
        }
    },
}

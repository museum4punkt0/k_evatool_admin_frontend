import axios from 'axios'

const prefix = (value) => `${import.meta.env.VITE_API_BASE_URL}/${value}`
const urls = {
    getAll: () => prefix(`evaluation-tool/surveys?all`),
    getOne: (id) => prefix(`evaluation-tool/surveys/${id}`),
    createOne: () => prefix(`evaluation-tool/surveys`),
    updateOne: (id) => prefix(`evaluation-tool/surveys/${id}`),
    deleteOne: (id) => prefix(`evaluation-tool/surveys/${id}`),
    getAllSurveySteps: (id) =>
        prefix(`evaluation-tool/surveys/${id}/survey-steps?all`),
    deleteOneSurveyStep: (id, stepId) =>
        prefix(`evaluation-tool/surveys/${id}/survey-steps/${stepId}`),
    updateOneSurveyStep: (id, stepId) =>
        prefix(`evaluation-tool/surveys/${id}/survey-steps/${stepId}`),
}

export default {
    async getAll(successCallback, errorCallback) {
        const url = urls.getAll()

        if (successCallback) {
            axios
                .get('evaluation-tool/surveys')
                .then((response) => {
                    if (response.data) {
                        successCallback(response.data.data)
                    } else if (errorCallback) {
                        errorCallback(response)
                    } else {
                        console.error('could not get all surveys')
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
                        console.error('could not get one survey', id)
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
                        console.error('could not create one survey', data)
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
                        console.error('could not update one survey', id, data)
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
                        console.error('could not delete one survey', id)
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
    async getAllSurveySteps(id, successCallback, errorCallback) {
        const url = urls.getAllSurveySteps(id)

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
    async deleteOneSurveyStep(id, stepId, successCallback, errorCallback) {
        const url = urls.deleteOneSurveyStep(id, stepId)

        if (successCallback) {
            axios
                .get(url)
                .then((response) => {
                    if (response.data) {
                        successCallback(response.data)
                    } else if (errorCallback) {
                        errorCallback(response)
                    } else {
                        console.error('could not delete one survey step')
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
    async updateOneSurveyStep(data, successCallback, errorCallback) {
        const url = urls.updateOneSurveyStep(data.surveyId, data.id)

        if (successCallback) {
            axios
                .put(url, data)
                .then((response) => {
                    if (response.data) {
                        successCallback(response.data.data)
                    } else if (errorCallback) {
                        errorCallback(response)
                    } else {
                        console.error('could not delete one survey step')
                    }
                })
                .catch((error) => {
                    if (errorCallback) {
                        errorCallback(error)
                    }
                })
        } else {
            const response = await axios.put(url)
            return response.data
        }
    },
    async save(survey) {
        let url = 'evaluation-tool/surveys'
        let method = 'post'
        if (survey.id) {
            url += '/' + survey.id
            method = 'put'
        }

        return axios({ method, url, data: survey })
            .then((response) => {
                return response.data.data
            })
            .catch((error) => {
                return error
            })
    },

    async saveAdminLayout(surveyId, adminLayout) {
        const url = 'evaluation-tool/surveys/' + surveyId + '/admin-layout'
        return axios
            .put(url, { adminLayout })
            .then((response) => {
                return response.data.data
            })
            .catch((error) => {
                return error
            })
    },

    async getSurveyStep(surveyId, surveyStepId) {
        let url =
            'evaluation-tool/surveys/' +
            surveyId +
            '/survey-steps/' +
            surveyStepId
        return axios
            .get(url)
            .then((response) => {
                return response.data.data
            })
            .catch((error) => {
                return error
            })
    },

    async saveSurveyStep(data, surveyId) {
        let url = 'evaluation-tool/surveys/' + surveyId + '/survey-steps'
        let method = 'POST'
        if (data.id) {
            method = 'PUT'
            url += '/' + data.id
        }
        return axios({ url, method, data })
            .then((response) => {
                return response.data.data
            })
            .catch((error) => {
                return error
            })
    },

    async deleteSurvey(surveyId) {
        const url = 'evaluation-tool/surveys/' + surveyId
        return axios
            .delete(url)
            .then((response) => {
                return response.data.data
            })
            .catch((error) => {
                return error
            })
    },

    async getSurveys(payload = null) {
        let url = 'evaluation-tool/surveys'
        if (payload?.deleted) {
            url += '?deleted'
        }
        return axios
            .get(url)
            .then((response) => {
                return response.data.data
            })
            .catch((error) => {
                return error
            })
    },

    async getSurvey(surveyId) {
        let url = 'evaluation-tool/surveys/' + surveyId
        return axios
            .get(url)
            .then((response) => {
                return response.data.data
            })
            .catch((error) => {
                return error
            })
    },

    async getSurveySteps(surveyId) {
        let url = 'evaluation-tool/surveys/' + surveyId + '/survey-steps'
        return axios
            .get(url)
            .then((response) => {
                return response.data.data
            })
            .catch((error) => {
                return error
            })
    },
}

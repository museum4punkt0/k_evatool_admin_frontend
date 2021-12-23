import axios from 'axios'

export default {
    saveSurvey(survey) {
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

    saveAdminLayout(surveyId, adminLayout) {
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

    getSurveyStep(surveyId, surveyStepId) {
        let url =
            'evaluation-tool/surveys/' + surveyId + '/steps/' + surveyStepId
        return axios
            .get(url)
            .then((response) => {
                return response.data.data
            })
            .catch((error) => {
                return error
            })
    },

    publishSurvey(surveyId) {
        const url = 'evaluation-tool/surveys/' + surveyId + '/publish'

        return axios
            .post(url)
            .then((response) => {
                return response.data.data
            })
            .catch((error) => {
                return error
            })
    },

    saveSurveyStep(data, surveyId) {
        let url = 'evaluation-tool/surveys/' + surveyId + '/steps'
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
    deleteSurveyStep(surveyStepId, surveyId) {
        const url =
            'evaluation-tool/surveys/' + surveyId + '/steps/' + surveyStepId
        return axios
            .delete(url)
            .then((response) => {
                return response.data.data
            })
            .catch((error) => {
                return error
            })
    },

    deleteSurvey(surveyId) {
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
        let url = 'evaluation-tool/surveys/' + surveyId + '/steps?all'
        return axios
            .get(url)
            .then((response) => {
                return response.data.data
            })
            .catch((error) => {
                return error
            })
    },

    async surveyStepSetStartStep(surveyId, surveyStepIdSelf) {
        const url =
            'evaluation-tool/surveys/' +
            surveyId +
            '/steps/' +
            surveyStepIdSelf +
            '/set-start-step'

        return axios
            .post(url, {})
            .then((response) => {
                return response.data.data
            })
            .catch((error) => {
                return error
            })
    },

    async surveyStepSetNextStep(surveyId, surveyStepIdSelf, surveyStepIdNext) {
        const url =
            'evaluation-tool/surveys/' +
            surveyId +
            '/steps/' +
            surveyStepIdSelf +
            '/set-next-step'

        return axios
            .post(url, { nextStepId: surveyStepIdNext })
            .then((response) => {
                return response.data.data
            })
            .catch((error) => {
                return error
            })
    },

    async surveyStepRemoveNextStep(surveyId, surveyStepIdSelf) {
        const url =
            'evaluation-tool/surveys/' +
            surveyId +
            '/steps/' +
            surveyStepIdSelf +
            '/remove-next-step'

        return axios
            .post(url)
            .then((response) => {
                return response.data.data
            })
            .catch((error) => {
                return error
            })
    },

    duplicateSurvey(surveyId) {
        const url = 'evaluation-tool/surveys/' + surveyId + '/duplicate'
        return axios
            .post(url)
            .then((response) => {
                return response.data.data
            })
            .catch((error) => {
                return error
            })
    },
}

import axios from 'axios'

export default {
    async getTranscription(resultAssetId) {
        return axios
            .get(`evaluation-tool/transcriptions/${resultAssetId}`)
            .then((response) => {
                return response.data.data
            })
            .catch((error) => {
                return error.response
            })
    },
    async setManualTranscription(resultAssetId, transcription) {
        return axios
            .post(`evaluation-tool/transcriptions/${resultAssetId}`, {
                transcription,
            })
            .then((response) => {
                return response.data.data
            })
            .catch((error) => {
                return error.response
            })
    },
}

import surveySettingsService from '../services/settingsService'

const initialState = {
    settings: [],
    setting: null,
}
export default {
    namespaced: true,
    state: () => initialState,
    mutations: {
        setSettings(state, settings) {
            state.settings = settings
        },
        setSetting(state, setting) {
            state.setting = setting
        },
    },
    actions: {
        async getSettings({ commit }) {
            const settings = await surveySettingsService.getSettings()
            commit('setSettings', settings.data)
        },
        async saveSetting({ commit }, setting) {
            const savedSetting = await surveySettingsService.saveSetting(
                setting,
            )
            commit('setSetting', savedSetting)
            return savedSetting
        },
        async deleteSetting({ commit }, settingId) {
            const deletedSetting = await surveySettingsService.deleteSetting(
                settingId,
            )
            commit('setSetting', deletedSetting)
        },
    },
    getters: {},
}

import { createStore } from 'vuex'
import surveys from './surveys'
import languages from './surveyLanguages'
import elementTypes from './surveyElementTypes'
import surveyElements from './surveyElements'
import surveyResults from './surveyResults'
import notifications from './notifications'
import assets from './assets'
import users from './users'

import APP from '../services/appService'

export default createStore({
    modules: {
        assets,
        elementTypes,
        languages,
        notifications,
        surveyElements,
        surveyResults,
        surveys,
        users,
    },
    state: {
        debug: import.meta.env.VITE_DEBUG === 'true',
        app: null,
        language: 'de',
    },
    mutations: {
        setApp(state, app) {
            state.app = app
        },
        setLanguage(state, language) {
            state.language = language
        },
    },
    actions: {
        async getApp({ commit }) {
            const app = await APP.getApp()
            commit('setApp', app)
        },
        async setLanguage({ commit }, language) {
            commit('setLanguage', language)
        },
    },
})

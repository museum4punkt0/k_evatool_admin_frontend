import { createStore } from 'vuex'
import surveys from './surveys'
import languages from './surveyLanguages'
import elementTypes from './surveyElementTypes'
import surveyElements from './surveyElements'
import surveyResults from './surveyResults'
import surveySettings from './surveySettings'
import notifications from './notifications'
import assets from './assets'
import users from './users'
import stats from './stats'

import APP from '../services/appService'

export default createStore({
    modules: {
        assets,
        elementTypes,
        languages,
        notifications,
        surveyElements,
        surveyResults,
        surveySettings,
        surveys,
        stats,
        users,
    },
    state: {
        debug: import.meta.env.VITE_DEBUG === 'true',
        app: null,
        languageCode: localStorage.getItem('languageCode')
            ? localStorage.getItem('languageCode')
            : 'de',
    },
    mutations: {
        setApp(state, app) {
            state.app = app
        },
        setLanguageCode(state, languageCode) {
            state.languageCode = languageCode
        },
    },
    actions: {
        async getApp({ commit }) {
            const app = await APP.getApp()
            commit('setApp', app)
        },
        async setLanguageCode({ commit }, languageCode) {
            localStorage.setItem('languageCode', languageCode)
            commit('setLanguageCode', languageCode)
        },
    },
})

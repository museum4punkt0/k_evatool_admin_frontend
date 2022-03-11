import { createStore } from 'vuex'
import surveys from './surveys'
import languages from './surveyLanguages'
import elementTypes from './surveyElementTypes'
import surveyElements from './surveyElements'
import surveyResults from './surveyResults'
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
        appInfo: null,
    },
    mutations: {
        setApp(state, app) {
            state.app = app
        },
        setAppInfo(state, appInfo) {
            state.appInfo = appInfo
        },
        setLanguageCode(state, languageCode) {
            state.languageCode = languageCode
        },
    },
    actions: {
        async getApp({ commit }) {
            const app = await APP.getApp()
            if (app.status && app.status === 'warning') {
                commit('setAppInfo', app)
            } else {
                commit('setApp', app)
                commit('setAppInfo', { message: 'app ready', status: 'ready' })
            }
        },
        async setLanguageCode({ commit }, languageCode) {
            localStorage.setItem('languageCode', languageCode)
            commit('setLanguageCode', languageCode)
        },
    },
})

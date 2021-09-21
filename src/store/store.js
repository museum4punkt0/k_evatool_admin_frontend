import { createStore } from 'vuex'
import surveys from './surveys'
import languages from './surveyLanguages'
import elementTypes from './surveyElementTypes'
import surveyElements from './surveyElements'
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
        surveys,
        users,
    },
    state: {
        debug: import.meta.env.VITE_DEBUG === 'true',
        app: null,
    },
    mutations: {
        setApp(state, app) {
            state.app = app
        },
    },
    actions: {
        async getApp({ commit }) {
            const app = await APP.getApp()
            commit('setApp', app)
        },
    },
})

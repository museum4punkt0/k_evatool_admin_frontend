import { createStore } from 'vuex'
import surveys from './surveys'
import surveySteps from './surveySteps'
import languages from './surveyLanguages'
import elementTypes from './surveyElementTypes'
import surveyElements from './surveyElements'
import localizations from './surveyLocalizations'
import notifications from './notifications'
import assets from './assets'

export default createStore({
    modules: {
        assets,
        elementTypes,
        languages,
        localizations,
        notifications,
        surveyElements,
        surveys,
        surveySteps,
    },
    state: {
        debug: true,
    },
    actions: {},
})

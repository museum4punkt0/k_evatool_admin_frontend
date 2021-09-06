import { createStore } from 'vuex'
import surveys from './surveys'
import surveySteps from './surveySteps'
import languages from './surveyLanguages'
import elementTypes from './surveyElementTypes'
import localizations from './surveyLocalizations'
import notifications from './notifications'
import assets from './assets'

export default createStore({
    modules: {
        elementTypes,
        surveys,
        surveySteps,
        languages,
        localizations,
        notifications,
        assets,
    },
    state: {},
    actions: {},
})

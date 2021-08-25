import { createStore } from 'vuex'
import surveys from './surveys'
import surveySteps from './surveySteps'
import languages from './languages'
import localizations from './localizations'

export default createStore({
    modules: {
        surveys,
        surveySteps,
        languages,
        localizations,
    },
    state: {},
})

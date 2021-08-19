import { createStore } from 'vuex'
import languages from './languages/languages'
import surveys from './surveys/surveys'
import currentSurvey from './currentSurvey/currentSurvey'

export default createStore({
    modules: {
        languages,
        surveys,
        currentSurvey,
    },
    state: {
        title: 'Vue3 Store',
    },
})

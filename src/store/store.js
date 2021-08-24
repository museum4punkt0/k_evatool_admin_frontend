import { createStore } from 'vuex'
import languages from './languages/languages'
import surveys from './surveys/surveys'
import surveySteps from './surveySteps/surveySteps'

export default createStore({
    modules: {
        languages,
        surveys,
        surveySteps,
    },
    state: {},
})

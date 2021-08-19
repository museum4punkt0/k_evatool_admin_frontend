import { createStore } from 'vuex'
import languages from './languages/languages'
import surveys from './surveys/surveys'

export default createStore({
    modules: {
        languages,
        surveys,
    },
    state: {
        title: 'Vue3 Store',
    },
})

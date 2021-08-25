import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Surveys from '../components/Surveys/Surveys.vue'
import Survey from '../components/Surveys/Survey.vue'
import NewSurvey from '../components/Surveys/New.vue'
import SurveySteps from '../components/SurveySteps/SurveySteps.vue'
import NewSurveyStep from '../components/SurveySteps/New.vue'
import SurveySurveySteps from '../components/Surveys/SurveySteps/SurveySteps.vue'
import Languages from '../components/Languages/Languages.vue'
import Language from '../components/Languages/Language.vue'
import NewLanguage from '../components/Languages/New.vue'
import Localizations from '../components/Localizations/Localizations.vue'
import Localization from '../components/Localizations/Localization.vue'
import NewLocalization from '../components/Localizations/New.vue'
import Settings from '../components/Settings.vue'

const routes = [
    { path: '/', component: Home },

    { name: 'surveys', path: '/surveys', component: Surveys },
    { name: 'surveys/new', path: '/surveys/new', component: NewSurvey },
    { name: 'surveys/selected', path: '/surveys/selected', component: Survey },
    {
        name: 'survey',
        path: '/surveys/:id',
        component: Survey,
        children: [
            {
                name: 'surveySurveySteps',
                path: 'steps',
                component: SurveySurveySteps,
            },
        ],
    },
    { name: 'surveySteps', path: '/survey-steps', component: SurveySteps },
    {
        name: 'surveySteps/new',
        path: '/survey-steps/new',
        component: NewSurveyStep,
    },
    { name: 'languages', path: '/languages', component: Languages },
    { name: 'languages/new', path: '/languages/new', component: NewLanguage },
    { name: 'language', path: '/languages/:id', component: Language },
    { name: 'localizations', path: '/localizations', component: Localizations },
    {
        name: 'localization/new',
        path: '/localizations/new',
        component: NewLocalization,
    },
    {
        name: 'localization',
        path: '/localization/:id',
        component: Localization,
    },
    { path: '/settings', component: Settings },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router

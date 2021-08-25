import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../components/Home.vue'

import ListSurveys from '../components/Surveys/List.vue'
import ViewSurvey from '../components/Surveys/View.vue'
import NewSurvey from '../components/Surveys/New.vue'
import EditSurvey from '../components/Surveys/Edit.vue'

import SurveySteps from '../components/SurveySteps/SurveySteps.vue'
import NewSurveyStep from '../components/SurveySteps/New.vue'

import ListLanguages from '../components/Languages/List.vue'
import ViewLanguage from '../components/Languages/View.vue'
import NewLanguage from '../components/Languages/New.vue'
import EditLanguage from '../components/Languages/Edit.vue'

import Localizations from '../components/Localizations/Localizations.vue'
import Localization from '../components/Localizations/Localization.vue'
import NewLocalization from '../components/Localizations/New.vue'
import Settings from '../components/Settings.vue'

const routes = [
    { path: '/', component: Home },
    { name: 'surveys', path: '/surveys', component: ListSurveys },
    { name: 'surveys/new', path: '/surveys/new', component: NewSurvey },
    {
        name: 'survey/view',
        path: '/surveys/:id(\\d+)',
        component: ViewSurvey,
    },
    {
        name: 'survey/edit',
        path: '/surveys/:id/edit',
        component: EditSurvey,
    },
    {
        name: 'survey/results',
        path: '/surveys/:id/results',
        component: EditSurvey,
    },
    { name: 'surveySteps', path: '/survey-steps', component: SurveySteps },
    {
        name: 'surveySteps/new',
        path: '/survey-steps/new',
        component: NewSurveyStep,
    },
    { name: 'languages', path: '/languages', component: ListLanguages },
    { name: 'languages/new', path: '/languages/new', component: NewLanguage },
    { name: 'language/view', path: '/languages/:id', component: ViewLanguage },
    {
        name: 'language/edit',
        path: '/languages/:id/edit',
        component: EditLanguage,
    },

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
    // { path: '*', redirect: '/' },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router

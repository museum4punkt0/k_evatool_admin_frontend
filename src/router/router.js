import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../components/Home.vue'

import ListSurveys from '../components/Surveys/Surveys.vue'
import ViewSurvey from '../components/Surveys/View.vue'
import NewSurvey from '../components/Surveys/New.vue'
import EditSurvey from '../components/Surveys/Edit.vue'

import SurveySteps from '../components/SurveySteps/SurveySteps.vue'
import NewSurveyStep from '../components/SurveySteps/New.vue'

import ListLanguages from '../components/Languages/Languages.vue'
import ViewLanguage from '../components/Languages/View.vue'
import NewLanguage from '../components/Languages/New.vue'
import EditLanguage from '../components/Languages/Edit.vue'

import Localizations from '../components/Localizations/Localizations.vue'
import Localization from '../components/Localizations/Localization.vue'
import NewLocalization from '../components/Localizations/New.vue'
import Settings from '../components/Settings.vue'
import Assets from '../components/Assets/Assets.vue'

import SurveyElements from '../components/SurveyElements/SurveyElements.vue'

import Login from '../components/Login.vue'

const routes = [
    { path: '/', component: Home },
    { path: '/login', component: Login },
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
        name: 'surveyElements',
        path: '/survey-elements',
        component: SurveyElements,
    },
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
    { path: '/users/register', component: Settings },
    { path: '/users/login', component: Settings },
    { path: '/users/password-reset', component: Settings },
    { path: '/user/logout', component: Settings },
    { path: '/user/settings', component: Settings },
    { path: '/assets', component: Assets },
    // { path: '*', redirect: '/' },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router

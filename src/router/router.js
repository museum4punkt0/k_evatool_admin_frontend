import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../components/Home.vue'

import Surveys from '../components/Surveys/Surveys.vue'
import Survey from '../components/Surveys/Survey.vue'

import ListLanguages from '../components/Languages/Languages.vue'

import Settings from '../components/Settings.vue'
import Assets from '../components/Assets/Assets.vue'

import SurveyElements from '../components/SurveyElements/SurveyElements.vue'

import Login from '../components/Login.vue'

import Users from '../components/Users/Users.vue'

import SurveyStats from '../components/stats/SurveyStats.vue'

const routes = [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { name: 'surveys', path: '/surveys', component: Surveys },
    {
        path: '/surveys/:id',
        component: Survey,
    },
    {
        name: 'surveyElements',
        path: '/survey-elements',
        component: SurveyElements,
    },

    { name: 'languages', path: '/languages', component: ListLanguages },

    { path: '/stats/:id', component: SurveyStats },

    { path: '/assets', component: Assets },

    { path: '/users/register', component: Settings },
    { path: '/users/login', component: Settings },
    { path: '/users/password-reset', component: Settings },
    { path: '/user/logout', component: Settings },
    { path: '/user/settings', component: Settings },
    { name: 'users', path: '/users', component: Users },
    // { path: '*', redirect: '/' },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router

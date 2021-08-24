import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Surveys from '../components/Surveys/Surveys.vue'
import Survey from '../components/Surveys/Survey.vue'
import SurveySteps from '../components/SurveySteps/SurveySteps.vue'
import SurveySurveySteps from '../components/Surveys/SurveySteps/SurveySteps.vue'
import Languages from '../components/Languages/Languages.vue'
import Language from '../components/Languages/Language.vue'
import Settings from '../components/Settings.vue'

const routes = [
    { path: '/', component: Home },
    { name: 'languages', path: '/languages', component: Languages },
    { name: 'languages.new', path: '/languages/new', component: Languages },
    { name: 'language', path: '/languages/:id', component: Language },
    { path: '/surveys', component: Surveys },
    { name: 'survey.new', path: '/surveys/new', component: Surveys },
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
    { path: '/settings', component: Settings },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router

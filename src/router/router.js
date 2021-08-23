import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Surveys from '../components/Surveys/Surveys.vue'
import Survey from '../components/Surveys/Survey.vue'
import SurveySteps from '../components/Surveys/SurveySteps/SurveySteps.vue'
import Languages from '../components/Languages/Languages.vue'
import Language from '../components/Languages/Language.vue'
import Settings from '../components/Settings.vue'

const routes = [
    { path: '/', component: Home },
    { path: '/surveys', component: Surveys },
    {
        name: 'survey',
        path: '/surveys/:id',
        component: Survey,
        children: [
            { name: 'surveySteps', path: 'steps', component: SurveySteps },
        ],
    },
    { name: 'languages', path: '/languages', component: Languages },
    { name: 'language', path: '/languages/:id', component: Language },
    { path: '/settings', component: Settings },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router

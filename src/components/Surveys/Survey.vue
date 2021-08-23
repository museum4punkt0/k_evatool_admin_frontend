<template>
    <Record :title="survey.name" :data="survey" :title-selector="titleSelector">
        <h2>
            {{ $t('survey') }}
        </h2>
        id (param): {{ id }}
        <br />
        <ul v-if="survey">
            <li>id: {{ survey.id }}</li>
            <li>name: {{ survey.name }}</li>
            <li>description: {{ survey.description }}</li>
            <li>step count: {{ survey.surveyStepsCount }}</li>
        </ul>
        <Button>
            <router-link :to="{ name: 'surveySteps', params: { id } }">
                steps
            </router-link>
        </Button>
        <router-view></router-view>
    </Record>
</template>

<script>
import { createNamespacedHelpers } from 'vuex-composition-helpers'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
import Button from '../Button'
import Record from '../record/Record.vue'

const { useState, useActions } = createNamespacedHelpers('currentSurvey')

export default {
    components: {
        Button,
        Record,
    },
    setup(props) {
        const id = ref()
        const route = useRoute()
        const { survey } = useState(['survey'])
        const { clear, setSurvey } = useActions(['clear', 'setSurvey'])

        const titleSelector = (item) => {
            return item.name
        }
        onBeforeRouteUpdate(async (to, from) => {
            console.log('before route update')
            if (to.params.id !== from.params.id) {
                console.log('param changed on update', to.params.id)
                //     TODO: fetch survey with id
            }
        })
        id.value = route.params.id
        setSurvey(id.value)
        watch(
            () => route.params.id,
            (newId) => {
                id.value = newId
                setSurvey(newId)
            },
        )
        return {
            id,
            survey,
            titleSelector,
        }
    },
}
</script>

<style></style>

<template>
    <div class="flex-1 flex items-stretch overflow-hidden">
        <main class="flex-1 overflow-y-auto p-3">
            {{ store.state.surveyResults.results }}
        </main>
        <aside></aside>
    </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

export default {
    name: 'SurveyStat',
    setup() {
        const { t } = useI18n()
        const route = useRoute()
        const store = useStore()

        const surveyId = route.params.survey_id
        const stepId = route.params.step_id

        store.dispatch('stats/getStats', {
            surveyId,
        })
        store.dispatch('surveyResults/getSurveyStepResults', {
            surveyId,
            stepId,
        })

        return {
            t,
            store,
            surveyId,
            stepId,
        }
    },
}
</script>

<style scoped></style>

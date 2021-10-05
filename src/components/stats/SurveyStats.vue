<template>
    <div class="flex-1 flex items-stretch overflow-hidden">
        <main class="flex-1 overflow-y-auto p-3">
            <h1>
                {{ t('stats', 1) }}
                <strong>{{ store.state.surveys.survey.name }}</strong>
            </h1>
        </main>
    </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { onBeforeUnmount } from 'vue'

export default {
    name: 'SurveyStats',
    setup() {
        const { t } = useI18n()
        const route = useRoute()
        const store = useStore()

        const surveyId = route.params.id
        store.dispatch('surveys/setSurveyId', surveyId)

        store.dispatch('surveyResults/getSurveyResults', surveyId)

        onBeforeUnmount(() => {
            store.dispatch('surveys/resetSurveyId')
        })

        return {
            surveyId,
            t,
            store,
        }
    },
}
</script>

<style scoped></style>

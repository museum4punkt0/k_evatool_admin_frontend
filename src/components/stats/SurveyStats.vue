<template>
    <div class="flex-1 flex items-stretch overflow-hidden">
        <main class="flex-1 overflow-y-auto p-3">
            <h1>
                {{ t('stats', 1) }}
                <strong>{{ store.state.surveys.survey.name }}</strong>
            </h1>
            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="step in store.state.surveys.survey.steps"
                            :key="step.id"
                        >
                            <td>{{ step.name }}</td>
                            <td>
                                {{
                                    store.state.surveyElements.surveyElements.find(
                                        (x) => x.id === step.surveyElementId,
                                    ).name
                                }}
                            </td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
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

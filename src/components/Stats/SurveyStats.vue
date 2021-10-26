<template>
    <div class="flex-1 flex items-stretch overflow-hidden">
        <main class="flex-1 overflow-y-auto p-3">
            {{ store.state.surveyResults }}
            <h1>
                {{ t('stats', 1) }}
                <strong>{{ store.state.surveys.survey?.name }}</strong>
            </h1>
            <div class="table-wrap mt-3">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>{{ t('steps', 1) }}</th>
                            <th>{{ t('elements', 1) }}</th>
                            <th>{{ t('parent_elements', 1) }}</th>
                            <th># {{ t('results', 2) }}</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody v-if="store.state.surveys.survey?.steps">
                        <tr
                            v-for="step in store.state.surveys.survey.steps"
                            :key="step.id"
                        >
                            <td class="text-lg">{{ step.id }}</td>
                            <td>
                                {{ step.name }}
                                <p class="text-gray-500 text-xs">
                                    {{
                                        store.state.surveyElements.surveyElements.find(
                                            (x) =>
                                                x.id === step.surveyElementId,
                                        ).name
                                    }}
                                </p>
                            </td>
                            <td>
                                <template
                                    v-if="
                                        store.state.surveyElements.surveyElements.find(
                                            (x) =>
                                                x.id === step.surveyElementId,
                                        ).params?.question
                                    "
                                >
                                    {{
                                        store.state.surveyElements.surveyElements.find(
                                            (x) =>
                                                x.id === step.surveyElementId,
                                        ).params?.question[
                                            store.state.languages
                                                .defaultLanguage.code
                                        ]
                                    }}
                                </template>
                            </td>
                            <td>{{ step.parentStepId }}</td>
                            <td>
                                <span v-if="step.resultCount > 0">
                                    {{ step.resultCount }}
                                </span>
                                <span v-else>-</span>
                            </td>
                            <td>
                                <eye-icon
                                    class="mx-1 h-5 w-5 pointer"
                                    @click.prevent.stop="goToStep(step.id)"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </main>
    </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { onBeforeUnmount } from 'vue'

import { EyeIcon } from '@heroicons/vue/outline'

export default {
    name: 'SurveyStats',
    components: { EyeIcon },
    setup() {
        const { t } = useI18n()
        const route = useRoute()
        const router = useRouter()
        const store = useStore()

        const surveyId = route.params.survey_id
        store.dispatch('surveys/setSurveyId', surveyId)

        store.dispatch('surveyResults/getSurveySteps', surveyId)

        onBeforeUnmount(() => {
            store.dispatch('surveys/resetSurveyId')
        })

        const goToStep = (stepId) => {
            router.push('/stats/' + surveyId + '/' + stepId)
        }

        return {
            surveyId,
            t,
            store,
            goToStep,
        }
    },
}
</script>

<style scoped></style>

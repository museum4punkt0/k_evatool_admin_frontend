<template>
    <div class="flex-1 flex items-stretch overflow-hidden">
        <main class="flex-1 overflow-y-auto p-3">
            <div class="flex flex-row justify-between">
                <h1>
                    {{ surveyElements.length }}
                    {{ t('survey_elements', surveyElements.length) }}
                </h1>
                <button class="primary" @click="getSurveyElements">
                    <refresh-icon class="h-4 w-4 mr-2" />
                    {{ t('action_reload') }}
                </button>
            </div>
            <div class="table-wrap mt-3">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>{{ t('names', 1) }}</th>
                            <th>{{ t('types', 1) }}</th>
                            <th># {{ t('steps', 2) }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="surveyElement in surveyElements"
                            :key="surveyElement.id"
                        >
                            <td class="text-lg">{{ surveyElement.id }}</td>
                            <td>
                                {{ surveyElement.name }}
                                <!--                                <p class="text-sm text-gray-500">
                    {{ surveyElement.description }}
                </p>-->
                            </td>
                            <td>{{ surveyElement.surveyElementType }}</td>
                            <td class="text-sm">
                                <template
                                    v-if="surveyElement.surveyStepsCount > 0"
                                >
                                    {{ surveyElement.surveyStepsCount }}
                                </template>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </main>
        <aside>
            <survey-element @saved="getSurveyElements" />
        </aside>
    </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
import SurveyElement from '../Surveys/SurveyElement.vue'
import { computed } from 'vue'
import { useStore } from 'vuex'
import { RefreshIcon } from '@heroicons/vue/outline'

export default {
    name: 'SurveyElements',
    components: { SurveyElement, RefreshIcon },
    setup() {
        const { t } = useI18n()
        const store = useStore()

        const surveyElements = computed({
            get: () => store.state.surveyElements.data,
        })

        const getSurveyElements = () => {
            store.dispatch('surveyElements/getSurveyElements')
        }

        return {
            t,
            surveyElements,
            getSurveyElements,
        }
    },
}
</script>

<style scoped></style>

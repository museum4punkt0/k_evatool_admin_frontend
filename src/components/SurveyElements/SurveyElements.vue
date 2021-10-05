<template>
    <div class="flex-1 flex items-stretch overflow-hidden">
        <main class="flex-1 overflow-y-auto p-3">
            <div class="flex flex-row justify-between">
                <h1>
                    {{ surveyElements?.length }}
                    {{ t('survey_elements', surveyElements?.length) }}
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
                            <th># {{ t('surveys', 2) }}</th>
                            <th></th>
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
                            <td class="text-sm">
                                <template v-if="surveyElement.surveysCount > 0">
                                    {{ surveyElement.surveysCount }}
                                </template>
                            </td>
                            <td class="px-6 py-4 flex flex-row justify-end">
                                <pencil-alt-icon
                                    class="w-5 h-5 pointer"
                                    @click="editSurveyElement(surveyElement.id)"
                                />
                                <trash-icon
                                    v-if="surveyElement.surveyStepsCount > 0"
                                    class="
                                        ml-3
                                        h-5
                                        w-5
                                        text-gray-500
                                        cursor-not-allowed
                                    "
                                />
                                <trash-icon
                                    v-else
                                    class="ml-3 h-5 w-5 text-red-500 pointer"
                                    @click.prevent.stop="
                                        deleteSurveyElement(surveyElement.id)
                                    "
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </main>
        <aside>
            <survey-element
                :survey-element-id="surveyElementId"
                @cancel="resetSurveyElement"
                @saved="getSurveyElements"
            />
        </aside>
    </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { RefreshIcon, PencilAltIcon, TrashIcon } from '@heroicons/vue/outline'

import SurveyElement from '../Surveys/SurveyElement.vue'

export default {
    name: 'SurveyElements',
    components: { SurveyElement, RefreshIcon, PencilAltIcon, TrashIcon },
    setup() {
        const { t } = useI18n()
        const store = useStore()
        const isBusy = ref(false)
        const surveyElementId = ref(-1)

        const surveyElements = computed({
            get: () => store.state.surveyElements.surveyElements,
        })

        const getSurveyElements = () => {
            store.dispatch('surveyElements/getSurveyElements')
        }

        const editSurveyElement = async (selectedSurveyElementId) => {
            surveyElementId.value = selectedSurveyElementId
        }

        const resetSurveyElement = async () => {
            surveyElementId.value = -1
        }

        const deleteSurveyElement = async (surveyElementId) => {
            const confirmSurveyElementDelete = confirm(
                t('confirm_delete_survey_element'),
            )
            if (confirmSurveyElementDelete) {
                isBusy.value = true
                await store.dispatch(
                    'surveyElements/deleteSurveyElement',
                    surveyElementId,
                )
                getSurveyElements()
                isBusy.value = false
            }
        }

        return {
            t,
            surveyElements,
            getSurveyElements,
            editSurveyElement,
            deleteSurveyElement,
            store,
            surveyElementId,
            resetSurveyElement,
        }
    },
}
</script>

<style scoped></style>

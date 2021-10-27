<template>
    <div class="flex overflow-hidden">
        <main class="flex h-full w-full flex-col p-3">
            <div class="flex flex-row justify-between">
                <h1>
                    {{ surveyElements?.length }}
                    {{ t('survey_elements', surveyElements?.length) }}
                </h1>
                <!-- <button class="primary" @click="getSurveyElements">
                    <refresh-icon class="h-4 w-4 mr-2" />
                    {{ t('action_reload') }}
                </button> -->
                <button
                    class="primary mr-1"
                    @click="setShowNewElement(!showNewElement)"
                >
                    {{ t('action_new_survey_element') }}
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
                            <td>
                                {{
                                    store.getters[
                                        'elementTypes/getDisplayNameForKey'
                                    ](surveyElement.surveyElementType)
                                }}
                            </td>
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
        <aside v-if="showNewElement">
            <survey-element
                :survey-element-id="surveyElementId"
                @cancel="resetSurveyElement"
                @saved="savedSurveyElement"
            />
        </aside>
    </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { useState } from '../../composables/state'
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
        const [showNewElement, setShowNewElement] = useState(false)

        const surveyElements = computed({
            get: () => store.state.surveyElements.surveyElements,
        })

        const getSurveyElements = () => {
            store.dispatch('surveyElements/getSurveyElements')
        }

        const editSurveyElement = async (selectedSurveyElementId) => {
            setShowNewElement(true)
            surveyElementId.value = selectedSurveyElementId
        }

        const savedSurveyElement = async () => {
            setShowNewElement(false)
            getSurveyElements()
            surveyElementId.value = -1
        }

        const resetSurveyElement = async () => {
            setShowNewElement(false)
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

        onMounted(() => {
            store.dispatch('surveyElements/getSurveyElements')
        })

        return {
            t,
            surveyElements,
            getSurveyElements,
            editSurveyElement,
            deleteSurveyElement,
            store,
            surveyElementId,
            resetSurveyElement,
            savedSurveyElement,
            showNewElement,
            setShowNewElement,
        }
    },
}
</script>

<style scoped></style>

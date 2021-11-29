<template>
    <div class="flex flex-grow overflow-hidden">
        <main class="flex h-full w-full flex-col p-3">
            <div class="flex flex-row justify-between">
                <h1
                    v-if="
                        filteredSurveyElements.length > 0 &&
                        filteredSurveyElements.length < surveyElements.length
                    "
                >
                    {{ filteredSurveyElements.length }} {{ t('of') }}
                    {{ surveyElements.length }}
                    {{ t('survey_elements', surveyElements.length) }}
                </h1>
                <h1 v-else>
                    {{ filteredSurveyElements.length }}
                    {{ t('survey_elements', filteredSurveyElements.length) }}
                </h1>
                <div class="flex-1 flex flex-row justify-end">
                    <form-input
                        v-model:value="searchQuery"
                        name="name"
                        type="text"
                        label=""
                        :placeholder="`${t('filter', 1)}: ${t('id')}, ${t(
                            'names',
                            1,
                        )}, ${t('types', 1)}`"
                        class="mr-4"
                    />
                    <button
                        class="primary mr-1"
                        @click="setShowNewElement(!showNewElement)"
                    >
                        {{ t('action_new_survey_element') }}
                    </button>
                </div>
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
                            v-for="surveyElement in surveyElements.filter(
                                filter,
                            )"
                            :key="`survey_element-${surveyElement.id}`"
                            @click="editSurveyElement(surveyElement.id)"
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
                                    class="ml-3 h-5 w-5 text-gray-500 cursor-not-allowed"
                                    @click.prevent.stop="null"
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
import { computed, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useState } from '../../composables/state'
import { RefreshIcon, PencilAltIcon, TrashIcon } from '@heroicons/vue/outline'

import SurveyElement from '../Surveys/SurveyElement.vue'
import FormInput from '../Forms/FormInput.vue'

import { searchForWordsInString } from '../../utils/search'

export default {
    name: 'SurveyElements',
    components: {
        FormInput,
        SurveyElement,
        RefreshIcon,
        PencilAltIcon,
        TrashIcon,
    },
    setup() {
        const { t } = useI18n()
        const store = useStore()
        const isBusy = ref(false)
        const surveyElementId = ref(-1)
        const searchQuery = ref('')
        const [showNewElement, setShowNewElement] = useState(false)

        const surveyElements = computed({
            get: () => store.state.surveyElements.surveyElements,
        })
        const [filteredSurveyElements, setFilteredSurveyElements] = useState(
            surveyElements.value,
        )
        const elementTypes = computed(
            () => store.state.elementTypes.elementTypes,
        )

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

        const filter = (surveyElement) => {
            const languageKeys = surveyElement.params.text
                ? Object.keys(surveyElement.params.text)
                : surveyElement.params.question
                ? Object.keys(surveyElement.params.question)
                : []
            const includedInQuestionOrText =
                searchForWordsInString(
                    [surveyElement.params.text, surveyElement.params.question],
                    searchQuery.value,
                    languageKeys,
                ).length > 0

            const elementType = elementTypes.value.find(
                (elementType) =>
                    elementType.key === surveyElement.surveyElementType,
            )

            const includedInElementTypeTitles =
                elementType &&
                searchForWordsInString(
                    [elementType.descriptions.title],
                    searchQuery.value,
                    Object.keys(elementType.descriptions.title),
                ).length > 0

            return (
                includedInQuestionOrText ||
                includedInElementTypeTitles ||
                searchForWordsInString([surveyElement], searchQuery.value, [
                    'id',
                    'name',
                    'description',
                    'surveyElementType',
                ]).length > 0
            )
        }
        watch(searchQuery, () => {
            const filteredSurveyElements = surveyElements.value.filter(filter)
            setFilteredSurveyElements(filteredSurveyElements)
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
            searchQuery,
            filter,
            filteredSurveyElements,
        }
    },
}
</script>

<style scoped></style>

<template>
    <div class="flex mb-3 justify-between items-center">
        <h2>{{ t('elements', 2) }}</h2>
        <div class="justify-between items-center flex">
            <button
                v-if="!showSurveyElementForm"
                class="primary"
                @click="setShowSurveyElementForm(true)"
            >
                {{ t('action_new_survey_element') }}
            </button>
        </div>
    </div>

    <survey-element
        v-if="showSurveyElementForm"
        @saved="onElementCreated($event)"
        @cancel="setShowSurveyElementForm(false)"
    ></survey-element>
    <div v-if="!showSurveyElementForm">
        <form-input
            v-model:value="elementSearchQuery"
            name="name"
            type="text"
            :label="t('search', 1)"
        />
        <div
            v-for="element in surveyElements
                .filter(filter)
                .sort((a, b) => b.createdAt - a.createdAt)"
            :key="element.id"
            class="p-0 rounded-lg border-0 bg-white shadow overflow-hidden h-full flex flex-col overflow-y-auto mt-4"
        >
            <element-content :element="element"></element-content>
            <div class="w-full border-t">
                <div class="flex flex-row">
                    <action-button
                        class="p-1 m-2 flex-grow"
                        color="secondary"
                        :action-text="t('action_add_to_survey')"
                        @execute="addElementToSurvey(element)"
                    />
                    <action-button
                        class="p-1 m-2"
                        color="secondary"
                        @execute="editElement(element)"
                    >
                        <span class="flex h-full justify-center items-center">
                            <PencilIcon class="h-5 w-5" />
                            <span v-if="element.surveyStepsCount > 1">(!)</span>
                        </span>
                    </action-button>
                    <action-button
                        class="p-1 m-2 disabled:opacity-25"
                        color="danger"
                        :disabled="element.surveyStepsCount > 0"
                        @execute="deleteElement(element)"
                    >
                        <span class="flex h-full justify-center items-center">
                            <TrashIcon class="h-5 w-5" />
                        </span>
                    </action-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { useState } from '@/composables/state'
import FormInput from '../Forms/FormInput.vue'
import SurveyElement from '../Surveys/SurveyElement.vue'
import ElementContent from './ElementContent.vue'
import SURVEY_SERVICE from '../../services/surveyService'
import ActionButton from '../Common/ActionButton.vue'
import { PencilIcon, TrashIcon } from '@heroicons/vue/outline'
import { TYPES } from '@/store/notifications'
import { searchForWordsInString } from '@/utils/search'

export default {
    name: 'NodeBrowser',
    components: {
        ActionButton,
        FormInput,
        SurveyElement,
        ElementContent,
        PencilIcon,
        TrashIcon,
    },
    props: {},
    setup() {
        const store = useStore()
        const survey = computed(() => store.state.surveys.survey)
        const surveyElements = computed(
            () => store.state.surveyElements.surveyElements,
        )
        const defaultLanguage = computed(
            () => store.state.languages.defaultLanguage,
        )
        const elementTypes = computed(
            () => store.state.elementTypes.elementTypes,
        )
        const elementSearchQuery = ref('')
        const savingSurveyStep = ref(false)
        const { t } = useI18n()

        const onElementCreated = (event) => {
            elementSearchQuery.value =
                store.state.surveyElements.surveyElements.find(
                    (item) => item.id === event,
                )?.name
            setShowSurveyElementForm(false)
            store.dispatch('notifications/add', {
                type: TYPES.SUCCESS,
                message: 'notification_success_survey_element_added',
            })
        }
        const addElementToSurvey = async (element) => {
            savingSurveyStep.value = true
            const savedSurveyStep = await SURVEY_SERVICE.saveSurveyStep(
                {
                    name: `${element.name} step`,
                    surveyElementId: element.id,
                    params: null,
                    allowSkip: false,
                },
                survey.value.id,
            )
            await store.dispatch('surveys/setSurveyStepId', savedSurveyStep.id)
            await store.dispatch('surveys/getSurvey')
            await store.dispatch('surveys/getSurveySteps', survey.value.id)
            // const adminLayout = store.state.surveys.survey.adminLayout
            // const nodeIndex = adminLayout.findIndex(
            //     (node) => node.id === savedSurveyStep.id,
            // )
            // let mostRightPosition = { x: 0, y: 0 }
            // adminLayout.forEach((node) => {
            //     if (node.position.x > mostRightPosition.x) {
            //         mostRightPosition = node.position
            //     }
            // })

            // adminLayout[nodeIndex].position = { ...mostRightPosition }
            // adminLayout[nodeIndex].position.x =
            //     adminLayout[nodeIndex].position.x + 200
            savingSurveyStep.value = false
            store.dispatch('notifications/add', {
                type: TYPES.SUCCESS,
                message: 'notification_success_survey_step_added',
            })
        }
        const editElement = async (element) => {
            await store.dispatch('surveyElements/setSurveyElement', element)
        }
        const deleteElement = async (element) => {
            await store.dispatch(
                'surveyElements/deleteSurveyElement',
                element.id,
            )
        }

        const [showSurveyElementForm, setShowSurveyElementForm] =
            useState(false)

        const filter = (item) => {
            const languageKeys = item.params.text
                ? Object.keys(item.params.text)
                : item.params.question
                ? Object.keys(item.params.question)
                : []
            const includedInQuestionOrText =
                searchForWordsInString(
                    [item.params.text, item.params.question],
                    elementSearchQuery.value,
                    languageKeys,
                ).length > 0

            const elementType = elementTypes.value.find(
                (elementType) => elementType.key === item.surveyElementType,
            )

            const includedInElementTypeTitles =
                elementType &&
                searchForWordsInString(
                    [elementType.descriptions.title],
                    elementSearchQuery.value,
                    Object.keys(elementType.descriptions.title),
                ).length > 0

            return (
                includedInQuestionOrText ||
                includedInElementTypeTitles ||
                searchForWordsInString([item], elementSearchQuery.value, [
                    'name',
                    'description',
                    'surveyElementType',
                ]).length > 0
            )
        }
        return {
            store,
            t,
            surveyElements,
            elementSearchQuery,
            defaultLanguage,
            onElementCreated,
            addElementToSurvey,
            editElement,
            deleteElement,
            showSurveyElementForm,
            setShowSurveyElementForm,
            filter,
        }
    },
}
</script>

<style></style>

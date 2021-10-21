<template>
    <div class="bg-gray-200 p-4">
        <div class="flex mb-3 justify-between items-center">
            <h2>{{ t('elements', 2) }}</h2>
            <div class="justify-between items-center flex">
                <button
                    v-if="!showSurveyElementForm"
                    class="primary"
                    @click="setShowSurveyElementForm(true)"
                >
                    new element
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
                :label="t('suche', 1)"
            />
            <div
                v-for="element in surveyElements
                    .filter(filter)
                    .sort((a, b) => b.createdAt - a.createdAt)"
                :key="element.id"
                class="
                    p-0
                    rounded-lg
                    border-0
                    bg-white
                    shadow
                    overflow-hidden
                    h-full
                    flex flex-col
                    overflow-y-scroll
                    mt-4
                "
            >
                <element-content :element="element"></element-content>

                <div class="w-full border-t">
                    <div class="flex flex-row">
                        <action-button
                            class="p-1 m-2"
                            color="bg-gray-200"
                            :action-text="'add to survey'"
                            @execute="addElementToSurvey(element)"
                        ></action-button>
                        <action-button
                            class="p-1 m-2"
                            color="bg-gray-200"
                            @execute="editElement(element)"
                        >
                            <span
                                class="flex h-full justify-center items-center"
                            >
                                <PencilIcon class="h-5 w-5" />
                                <span v-if="element.surveyStepsCount > 1">
                                    (!)
                                </span>
                            </span>
                        </action-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { useState } from '../../composables/state'
import FormInput from '../Forms/FormInput.vue'
import SurveyElement from '../Surveys/SurveyElement.vue'
import ElementContent from './ElementContent.vue'
import SURVEY_SERVICE from '../../services/surveyService'
import ActionButton from '../Common/ActionButton.vue'
import { PencilIcon } from '@heroicons/vue/outline'

export default {
    name: 'NodeBrowser',
    components: {
        ActionButton,
        FormInput,
        SurveyElement,
        ElementContent,
        PencilIcon,
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
        const elementSearchQuery = ref('')
        const savingSurveyStep = ref(false)
        const { t } = useI18n()

        const onElementCreated = (event) => {
            elementSearchQuery.value =
                store.state.surveyElements.surveyElements.find(
                    (item) => item.id === event,
                )?.name
            setShowSurveyElementForm(false)
            store.dispatch('notifications/addSuccess', {
                message:
                    'successfully created survey element. it can be added to the survey now.',
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
            // await getSurveyStep()
            // emit('saved')
            savingSurveyStep.value = false
            store.dispatch('notifications/addSuccess', {
                message:
                    'successfully added survey step. it can be patched now.',
            })
        }
        const editElement = async (element) => {
            await store.dispatch('surveyElements/setSurveyElement', element)
        }

        const [showSurveyElementForm, setShowSurveyElementForm] =
            useState(false)

        const filter = (item) => {
            const questionEntries = item.params.question
                ? Object.entries(item.params.question)
                : []
            const textEntries = item.params.text
                ? Object.entries(item.params.text)
                : []
            let includedInQuestionOrText = false
            const allEntries = [...questionEntries, ...textEntries]
            allEntries.forEach((entry) => {
                if (
                    entry[1]
                        .toLowerCase()
                        .includes(elementSearchQuery.value.toLowerCase())
                )
                    includedInQuestionOrText = true
            })
            return (
                includedInQuestionOrText ||
                item.name
                    .toLowerCase()
                    .includes(elementSearchQuery.value.toLowerCase()) ||
                item.description
                    .toLowerCase()
                    .includes(elementSearchQuery.value.toLowerCase()) ||
                item.surveyElementType
                    .toLowerCase()
                    .includes(elementSearchQuery.value.toLowerCase())
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
            showSurveyElementForm,
            setShowSurveyElementForm,
            filter,
        }
    },
}
</script>

<style></style>

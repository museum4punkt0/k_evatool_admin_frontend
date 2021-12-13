<template>
    <template v-if="surveyElementId < 0">
        <h1>
            {{ t('steps', 1) }}
            <span v-if="surveyStep.id" class="text-sm text-gray-500">
                ID: {{ surveyStep.id }}
            </span>
        </h1>

        <div v-if="surveyStep">
            <form-input
                v-model:value="surveyStep.name"
                :placeholder="t('optional_name')"
                :label="t('names', 1)"
                name="surveyStep"
            />

            <!-- <form-toggle
                v-model:enabled="surveyStep.allowSkip"
                class="mt-3 mb-3"
                :label="t('allow_skip')"
            /> -->

            <div class="flex flex-row">
                <form-select
                    v-model:selected="surveyStep.surveyElementId"
                    :options="surveyElements"
                    title-key="name"
                    value-key="id"
                    class="flex-1"
                    :default-value="-1"
                    :label="t('elements', 1)"
                />
                <action-button
                    v-if="surveyStep.surveyElementId > 0"
                    class="mt-6 ml-6"
                    color="secondary"
                    @execute="editSurveyElement"
                >
                    <PencilIcon class="h-5 w-5" />
                </action-button>
            </div>

            <div class="flex flex-row">
                <action-button
                    class="mr-2"
                    color="secondary"
                    :executing="false"
                    :action-text="t('action_cancel')"
                    @execute="cancel"
                />

                <action-button
                    v-if="surveyStep.id"
                    color="danger"
                    :disabled="surveyStep.resultCount > 0"
                    :executing="deletingSurveyStep"
                    class="mr-2"
                    @execute="deleteSurveyStep"
                >
                    <TrashIcon class="h-5 w-5" />
                </action-button>
                <action-button
                    :executing="savingSurveyStep"
                    :disabled="v$.surveyStep.$invalid"
                    :action-text="t('action_save')"
                    class="flex-grow"
                    @execute="saveSurveyStep"
                >
                    <!-- <SaveIcon class="h-5 w-5" /> -->
                </action-button>
            </div>

            <p
                v-if="surveyStep.resultCount > 0"
                class="text-xs mt-1 text-gray-500"
            >
                {{
                    t('survey_step_has_result', {
                        resultCount: surveyStep.resultCount,
                    })
                }}
            </p>

            <data-viewer class="mt-3" :data="surveyStep" />

            <!-- <hr class="mt-4 mb-2" />
            <button class="primary" @click="newSurveyElement">
                {{ t('action_new_survey_element') }}
            </button> -->
        </div>
    </template>
    <survey-element
        v-if="surveyElementId > -1"
        :survey-element-id="surveyElementId"
        @saved="savedSurveyElement($event)"
        @cancel="resetSurveyElement"
    />
</template>

<script>
import { computed, ref, watch } from 'vue'

import { useStore } from 'vuex'
import useVuelidate from '@vuelidate/core'
import { required, minLength, minValue } from '@vuelidate/validators'

// default params
import DataViewer from '../Common/DataViewer.vue'
import FormToggle from '../Forms/FormToggle.vue'
import SurveyElement from './SurveyElement.vue'
import FormInput from '../Forms/FormInput.vue'
import FormSelect from '../Forms/FormSelect.vue'
import ActionButton from '../Common/ActionButton.vue'

import { useI18n } from 'vue-i18n'

import SURVEY_SERVICE from '../../services/surveyService'
import { useRoute } from 'vue-router'
import { PencilIcon, TrashIcon, SaveIcon } from '@heroicons/vue/outline'

export default {
    name: 'SurveyStep',
    components: {
        ActionButton,
        FormSelect,
        FormInput,
        SurveyElement,
        FormToggle,
        DataViewer,
        PencilIcon,
        TrashIcon,
        SaveIcon,
    },
    emits: ['saved', 'deleted', 'cancel'],
    setup(props, { emit }) {
        const { t } = useI18n()
        const store = useStore()
        const route = useRoute()
        const surveyId = route.params.id
        const surveySteps = computed(() => store.state.surveys.survey.steps)
        const surveyStepId = computed(() => store.state.surveys.surveyStepId)
        const surveyElementId = ref(-1)
        const savingSurveyStep = ref(false)
        const deletingSurveyStep = ref(false)

        const surveyStep = ref({
            name: '',
            surveyElementId: -1,
            params: null,
            allowSkip: false,
        })

        const surveyElement = ref(null)

        const surveyElements = computed({
            get: () => store.state.surveyElements.surveyElements,
        })

        const getSurveyStep = async () => {
            if (surveyStepId.value > 0) {
                surveyStep.value = await SURVEY_SERVICE.getSurveyStep(
                    surveyId,
                    surveyStepId.value,
                )
            }
        }

        if (surveyStepId.value) {
            getSurveyStep()
        }

        watch(
            () => surveyStep.value.surveyElementId,
            (value) => {
                // Do not display survey element on update
                // surveyElementId.value = value
                if (!surveyStep.value.name) {
                    surveyStep.value.name =
                        store.state.surveyElements.surveyElements.find(
                            (x) => x.id === value,
                        )?.name
                }
            },
        )

        watch(
            () => store.state.surveys.surveyStep,
            (step) => {
                if (step?.id === surveyStepId.value) {
                    surveyStep.value = step
                }
            },
        )

        const saveSurveyStep = async () => {
            savingSurveyStep.value = true
            const savedSurveyStep = await SURVEY_SERVICE.saveSurveyStep(
                surveyStep.value,
                surveyId,
            )

            await store.dispatch('surveys/setSurveyStepId', savedSurveyStep.id)
            await getSurveyStep()
            emit('saved')
            savingSurveyStep.value = false
        }

        const deleteSurveyStep = async () => {
            const confirmDelete = confirm(t('confirm_delete_survey_step'))
            if (confirmDelete) {
                deletingSurveyStep.value = true
                await store.dispatch('surveys/deleteSurveyStep', {
                    surveyId: surveyId,
                    surveyStepId: surveyStep.value.id,
                })
                await store.dispatch('surveys/setSurveyStepId', -1)
                emit('deleted')
                deletingSurveyStep.value = false
            }
        }

        const newSurveyElement = () => {
            surveyElementId.value = 0
        }

        const resetSurveyElement = () => {
            surveyElementId.value = -1
        }

        const savedSurveyElement = (surveyElementIdSaved) => {
            surveyStep.value.surveyElementId = surveyElementIdSaved
            surveyElementId.value = -1
        }

        const editSurveyElement = () => {
            if (surveyStep.value.surveyElementId) {
                surveyElementId.value = surveyStep.value.surveyElementId
            }
        }

        return {
            v$: useVuelidate(),
            surveyStep,
            surveyStepId,
            surveySteps,
            store,
            saveSurveyStep,
            editSurveyElement,
            deleteSurveyStep,
            t,
            newSurveyElement,
            resetSurveyElement,
            savingSurveyStep,
            deletingSurveyStep,
            surveyElement,
            surveyElements,
            surveyElementId,
            savedSurveyElement,
            cancel: () => {
                emit('cancel')
            },
        }
    },
    data() {
        return {
            name: '',
        }
    },
    validations: {
        surveyStep: {
            name: {
                required,
                minLength: minLength(1),
            },
            surveyElementId: {
                required,
                minValue: minValue(1),
            },
        },
    },
}
</script>

<style scoped></style>

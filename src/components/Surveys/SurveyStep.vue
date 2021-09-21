<template>
    <h1>
        {{ t('steps', 1) }}
        <span v-if="surveyStep.id" class="text-sm text-gray-500">
            ID: {{ surveyStep.id }}
        </span>
    </h1>

    <div v-if="surveyStep">
        <form-input
            v-model:value="surveyStep.name"
            :placeholder="t('names', 1)"
            :label="t('names', 1)"
            name="surveyStep"
        />

        <form-toggle
            v-model:enabled="surveyStep.allowSkip"
            class="mt-3 mb-3"
            :label="t('allow_skip')"
        />

        <form-select
            v-model:selected="surveyStep.surveyElementId"
            :options="surveyElements"
            title-key="name"
            value-key="id"
            :default-value="-1"
            label="Test"
        />

        <action-button
            :executing="savingSurveyStep"
            :disabled="v$.surveyStep.$invalid"
            :action-text="t('action_save')"
            @execute="saveSurveyStep"
        />
        <action-button
            v-if="surveyStep.id"
            color="danger"
            class="ml-2"
            :executing="savingSurveyStep"
            :action-text="t('action_delete')"
            @execute="saveSurveyStep"
        />

        <data-viewer class="mt-3" :data="surveyStep" />

        <hr class="mt-4 mb-2" />
        <button
            v-if="surveyElementId < 0"
            class="primary"
            @click="newSurveyElement"
        >
            {{ t('action_new_survey_element') }}
        </button>
        <survey-element
            v-else
            :survey-element-id="surveyElementId"
            @saved="savedSurveyElement($event)"
        />
    </div>
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

import SURVEY_SERVICE from '../../services/surveys'
// import SURVEY_ELEMENT_SERVICE from '../../services/surveyElements'
import { useRoute } from 'vue-router'
// import defaultParams from '../SurveySteps/ElementTypes/defaultParams'

export default {
    name: 'SurveyStep',
    components: {
        ActionButton,
        FormSelect,
        FormInput,
        SurveyElement,
        FormToggle,
        DataViewer,
    },
    emits: ['saved'],
    setup(props, { emit }) {
        const { t } = useI18n()
        const store = useStore()
        const route = useRoute()
        const surveyId = route.params.id
        // const surveyStepId = ref(store.state.surveys.selectedSurveyStepId)
        const surveyStepId = computed(
            () => store.state.surveys.selectedSurveyStepId,
        )
        const surveyElementId = ref(-1)
        const savingSurveyStep = ref(false)

        const surveyStep = ref({
            name: '',
            surveyElementId: -1,
            params: null,
            allowSkip: false,
        })

        const surveyElement = ref(null)

        const surveyElements = computed({
            get: () => store.state.surveyElements.data,
        })

        const getSurveyStep = async () => {
            surveyStep.value = await SURVEY_SERVICE.getSurveyStep(
                surveyId,
                surveyStepId.value,
            )
        }

        if (surveyStepId.value) {
            getSurveyStep()
        }

        watch(
            () => surveyStepId.value,
            () => {
                getSurveyStep()
            },
        )
        watch(
            () => surveyStep.value.surveyElementId,
            (value) => {
                surveyElementId.value = value
            },
        )

        const saveSurveyStep = async () => {
            savingSurveyStep.value = true
            const savedSurvey = await SURVEY_SERVICE.saveSurveyStep(
                surveyStep.value,
                surveyId,
            )
            surveyStepId.value = savedSurvey.id
            await getSurveyStep()
            emit('saved')
            savingSurveyStep.value = false
        }

        const newSurveyElement = () => {
            surveyElementId.value = 0
        }

        const savedSurveyElement = (surveyElementId) => {
            surveyStep.value.surveyElementId = surveyElementId
        }

        return {
            v$: useVuelidate(),
            surveyStep,
            surveyStepId,
            store,
            saveSurveyStep,
            t,
            newSurveyElement,
            savingSurveyStep,
            surveyElement,
            surveyElements,
            surveyElementId,
            savedSurveyElement,
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

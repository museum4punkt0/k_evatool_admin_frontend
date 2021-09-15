<template>
    <h1>{{ $tc('steps', 1) }}</h1>

    {{ surveyStepId }}

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
            :options="store.state.surveyElements.data"
            title-key="name"
            value-key="id"
            default-value="-1"
            label="Test"
        />

        <action-button
            :disabled="v$.$invalid"
            :executing="savingSurveyStep"
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
        <survey-element v-else :survey-element-id="surveyElementId" />
    </div>
</template>

<script>
import { ref, watch } from 'vue'

import { useStore } from 'vuex'
import useVuelidate from '@vuelidate/core'
import { required, minLength } from '@vuelidate/validators'

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
        const surveyStepId = ref(store.state.surveys.selectedSurveyStepId)
        const surveyElementId = ref(-1)
        const savingSurveyStep = ref(false)

        const surveyStep = ref({
            name: '',
            surveyElementId: -1,
            params: null,
            allowSkip: false,
        })

        const surveyElement = ref(null)

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
            () => surveyStep.value.surveyElementId,
            (value) => {
                surveyElementId.value = value
            },
        )

        const saveSurveyStep = async () => {
            savingSurveyStep.value = true
            await SURVEY_SERVICE.saveSurveyStep(surveyStep.value, surveyId)
            await getSurveyStep()
            emit('saved')
            savingSurveyStep.value = false
        }

        const newSurveyElement = () => {
            surveyElementId.value = 0
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
            surveyElementId,
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
            },
        },
    },
}
</script>

<style scoped></style>

<template>
    <h1>{{ $tc('steps', 1) }}</h1>

    <div>
        <form-input
            v-model:value="surveyStep.name"
            :placeholder="t('names', 1)"
            :label="t('names', 1)"
            name="surveyStep"
        />

        <form-toggle
            v-model:enabled="surveyStep.allowSkip"
            class="mt-3"
            :label="t('allow_skip')"
        />

        <button
            type="button"
            class="primary mt-3"
            :disabled="v$.$invalid"
            @click="saveSurveyStep"
        >
            {{ $t('action_save') }}
        </button>

        <form-select
            v-model="surveyStep.surveyElementId"
            class="mt-3"
            :options="store.state.surveyElements.data"
            title-key="name"
            value-key="id"
            label="Test"
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
        <survey-element v-else />
    </div>
</template>

<script>
import { reactive, ref } from 'vue'

import { useStore } from 'vuex'
import useVuelidate from '@vuelidate/core'
import { required, minLength } from '@vuelidate/validators'

// default params
import DataViewer from '../Common/DataViewer.vue'
import FormToggle from '../Forms/FormToggle.vue'
import SurveyElement from './SurveyElement.vue'
import FormInput from '../Forms/FormInput.vue'
import FormSelect from '../Forms/FormSelect.vue'

import { useI18n } from 'vue-i18n'

export default {
    name: 'SurveyStep',
    components: {
        FormSelect,
        FormInput,
        SurveyElement,
        FormToggle,
        DataViewer,
    },
    setup() {
        const { t } = useI18n()
        const store = useStore()
        const surveyElementId = ref(-1)
        let surveyStep = reactive({ name: '', params: null, allowSkip: false })

        const saveSurveyStep = () => {
            console.log('save')
        }

        const newSurveyElement = () => {
            surveyElementId.value = 0
        }

        return {
            v$: useVuelidate(),
            surveyStep,
            store,
            saveSurveyStep,
            t,
            surveyElementId,
            newSurveyElement,
        }
    },
    data() {
        return {
            name: '',
        }
    },
    validations: {
        survey: {
            name: {
                required,
                minLength: minLength(1),
            },
        },
    },
}
</script>

<style scoped></style>

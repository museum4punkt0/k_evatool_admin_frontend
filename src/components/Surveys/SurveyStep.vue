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

        <data-viewer class="mt-3" :data="surveyStep" />

        <hr class="mt-4 mb-2" />
        <survey-element />
    </div>
</template>

<script>
import { reactive } from 'vue'

import { useStore } from 'vuex'
import useVuelidate from '@vuelidate/core'
import { required, minLength } from '@vuelidate/validators'

// default params
import DataViewer from '../Common/DataViewer.vue'
import FormToggle from '../Forms/FormToggle.vue'
import SurveyElement from './SurveyElement.vue'
import FormInput from '../Forms/FormInput.vue'
import { useI18n } from 'vue-i18n'

export default {
    name: 'SurveyStep',
    components: {
        FormInput,
        SurveyElement,
        FormToggle,
        DataViewer,
    },
    setup() {
        const { t } = useI18n()
        const store = useStore()
        let surveyStep = reactive({ name: '', params: null, allowSkip: false })

        const saveSurveyStep = () => {
            console.log('save')
        }

        return {
            v$: useVuelidate(),
            surveyStep,
            store,
            saveSurveyStep,
            t,
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

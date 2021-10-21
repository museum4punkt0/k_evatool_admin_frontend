<template>
    <h1>{{ surveyTitle }}</h1>

    <form-input
        v-model:value="survey.name"
        class="mt-3"
        name="name"
        type="text"
        :label="t('names', 1)"
    />
    <form-input
        v-if="survey.id"
        v-model:value="survey.slug"
        name="slug"
        class="mt-3"
        type="text"
        :label="t('slugs', 1)"
    />
    <div class="flex flex-row">
        <action-button
            :action-text="t('action_cancel')"
            class="mr-2"
            :color="'bg-gray-200'"
            :executing="false"
            @click="saveSurvey"
        />
        <action-button
            class="flex-grow"
            :disabled="v$.$invalid || surveySaving"
            :action-text="t('action_save')"
            @click="store.dispatch('surveyElements/setSurveyElement', null)"
        />
    </div>

    <data-viewer class="mt-3" :data="survey" />
</template>

<script>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import SURVEYS from '../../services/surveyService'
import useVuelidate from '@vuelidate/core'
import { maxLength, minLength, required } from '@vuelidate/validators'

import ActionButton from '../Common/ActionButton.vue'
import DataViewer from '../Common/DataViewer.vue'
import FormInput from '../Forms/FormInput.vue'

export default {
    name: 'SurveyDetails',
    components: { FormInput, ActionButton, DataViewer },
    props: {
        surveyId: { type: Number, default: -1 },
        resetAfterSave: { type: Boolean, default: true },
    },
    emits: ['saved', 'cancel'],
    setup: function (props, { emit }) {
        const { t } = useI18n()
        const store = useStore()
        const survey = ref({
            name: '',
        })
        const surveyTitle = ref(t('new_survey'))
        const surveySaving = ref(false)

        watch(
            () => props.surveyId,
            (surveyId) => {
                setSurvey(surveyId)
            },
        )

        const setSurvey = async (surveyId) => {
            if (surveyId > 0) {
                survey.value = await SURVEYS.getSurvey(surveyId)
                surveyTitle.value = t('edit_survey')
            } else {
                initSurvey()
            }
        }

        const saveSurvey = async () => {
            surveySaving.value = true
            await store.dispatch('surveys/saveSurvey', survey.value)
            emit('saved')
            if (props.resetAfterSave) {
                initSurvey()
            }
            surveySaving.value = false
        }

        const initSurvey = () => {
            survey.value = {
                name: '',
            }
            surveyTitle.value = t('new_survey')
        }

        setSurvey(props.surveyId)

        return {
            survey,
            v$: useVuelidate(),
            saveSurvey,
            surveyTitle,
            t,
            store,
            surveySaving,
        }
    },
    validations: {
        survey: {
            name: {
                required,
                minLength: minLength(1),
            },
            slug: {
                maxLength: maxLength(100),
            },
        },
    },
}
</script>

<style scoped></style>

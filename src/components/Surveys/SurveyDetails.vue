<template>
    <h1>{{ surveyTitle }}</h1>

    <input v-model="survey.name" class="mt-3" type="text" />
    <action-button
        :disabled="v$.$invalid"
        :action-text="t('action_save')"
        @click="saveSurvey"
    />

    <data-viewer class="mt-3" :data="survey" />
</template>

<script>
import { ref, watch } from 'vue'
import SURVEYS from '../../services/surveyService'
import useVuelidate from '@vuelidate/core'
import { minLength, required } from '@vuelidate/validators'
import { useI18n } from 'vue-i18n'
import DataViewer from '../Common/DataViewer.vue'
import ActionButton from '../Common/ActionButton.vue'

export default {
    name: 'SurveyDetails',
    components: { ActionButton, DataViewer },
    props: {
        surveyId: { type: Number, default: -1 },
        resetAfterSave: { type: Boolean, default: true },
    },
    emits: ['saved'],
    setup: function (props, { emit }) {
        const { t } = useI18n()
        const survey = ref({
            name: '',
        })
        const surveyTitle = ref(t('new_survey'))

        watch(
            () => props.surveyId,
            (surveyId) => {
                setSurvey(surveyId)
            },
        )

        const setSurvey = async (surveyId) => {
            if (surveyId > 0) {
                survey.value = await SURVEYS.getOne(surveyId)
                surveyTitle.value = t('edit_survey')
            } else {
                initSurvey()
            }
        }

        const saveSurvey = async () => {
            const savedSurvey = await SURVEYS.save(survey.value)
            if (savedSurvey.id) {
                emit('saved')
                if (props.resetAfterSave) {
                    initSurvey()
                }
            }
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

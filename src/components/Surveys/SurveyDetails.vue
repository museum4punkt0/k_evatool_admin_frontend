<template>
    <h1>{{ surveyTitle }}</h1>

    <input v-model="survey.name" class="mt-3" type="text" />
    <button
        class="primary w-full mt-3"
        :disabled="v$.$invalid"
        @click="saveSurvey"
    >
        {{ $t('action_save') }}
    </button>
</template>

<script>
import { ref, watch } from 'vue'
import SURVEYS from '../../services/surveys'
import useVuelidate from '@vuelidate/core'
import { minLength, required } from '@vuelidate/validators'
import { useI18n } from 'vue-i18n'

export default {
    name: 'SurveyDetails',
    props: {
        surveyId: { type: Number, default: -1 },
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
                initSurvey()
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

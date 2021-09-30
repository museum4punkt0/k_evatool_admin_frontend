<template>
    <div>
        <div
            v-if="surveyStep.resultBasedNextSteps?.length > 0"
            class="table-wrap"
        >
            <table>
                <tr
                    v-for="(step, index) in surveyStep.resultBasedNextSteps"
                    :key="index"
                >
                    <td>{{ step.type }}</td>
                    <td>{{ step.stepId }}</td>
                    <td
                        class="pointer float-right"
                        @click="removeResultBasedStep(index)"
                    >
                        <TrashIcon class="h-5 w-5" />
                    </td>
                </tr>
            </table>
        </div>

        <h2>add new result based step</h2>
        <div class="grid grid-cols-3 gap-4">
            <form-select
                v-model:selected="nextStep.type"
                :options="surveyElementParams.emojis"
                title-key="type"
                value-key="type"
                :default-value="-1"
                label="type"
            />
            <form-select
                v-model:selected="nextStep.stepId"
                :options="surveySteps"
                title-key="name"
                value-key="id"
                :default-value="-1"
                label="step"
            />
            <action-button
                :action-text="t('action_save')"
                :disabled="v$.$invalid"
                @execute="addResultBasedStep"
            />
        </div>
    </div>
</template>
<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { TrashIcon, PlusIcon } from '@heroicons/vue/outline'
import FormInput from '../../Forms/FormInput.vue'
import FormSelect from '../../Forms/FormSelect.vue'
import ActionButton from '../../Common/ActionButton.vue'

export default {
    components: { FormInput, FormSelect, ActionButton, TrashIcon, PlusIcon },
    setup() {
        const store = useStore()
        const { t } = useI18n()
        const surveyStep = computed(() => store.state.surveys.surveyStep)
        const surveySteps = computed(() => store.state.surveys.survey.steps)
        const surveyElementParams = computed(
            () =>
                store.state.surveyElements.surveyElements.find((element) => {
                    return element.id === surveyStep.value.id
                })?.params,
        )

        const nextStep = ref({
            startValue: 1,
            endValue: surveyElementParams.value.numberOfStars,
            type: null,
            stepId: -1,
        })

        const addResultBasedStep = () => {
            // add to array
            if (!surveyStep.value.resultBasedNextSteps) {
                surveyStep.value.resultBasedNextSteps = []
            }
            surveyStep.value.resultBasedNextSteps.push(nextStep.value)

            // reset
            nextStep.value = {
                startValue: 1,
                endValue: surveyElementParams.value.numberOfStars,
                stepId: -1,
            }

            store.dispatch('surveys/saveSurveyStep', surveyStep.value)
        }
        const removeResultBasedStep = (index) => {
            const resultBasedSteps = surveyStep.value.resultBasedNextSteps
            resultBasedSteps.splice(index, 1)
            surveyStep.value.resultBasedNextSteps = resultBasedSteps

            store.dispatch('surveys/saveSurveyStep', surveyStep.value)
        }

        // const saveSurveyStep = async () => {
        //         savingTimeBasedSteps.value = true
        //         surveyStep.value.timeBasedSteps = timeBasedSteps.value
        //         await SURVEYS.saveSurveyStep(surveyStep, surveyStep.value.surveyId)
        //         savingTimeBasedSteps.value = false
        // }

        const validations = computed({
            get: () => {
                return {
                    type: {
                        required,
                        isType: (value) => {
                            return surveyElementParams.value.emojis.find(
                                (emoji) => emoji.type === value,
                            )
                                ? true
                                : false
                        },
                    },
                    stepId: {
                        required,
                        isStep: (value) => {
                            return surveySteps.value.find(
                                (step) => step.id === value,
                            )
                                ? true
                                : false
                        },
                    },
                }
            },
            set: () => {},
        })

        return {
            v$: useVuelidate(validations, nextStep),
            store,
            t,
            surveyStep,
            surveySteps,
            surveyElementParams,
            nextStep,
            addResultBasedStep,
            removeResultBasedStep,
        }
    },
}
</script>

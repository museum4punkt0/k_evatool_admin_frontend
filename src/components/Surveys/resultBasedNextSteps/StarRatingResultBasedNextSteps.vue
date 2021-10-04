<template>
    <div>
        <ul>
            <li>number of stars: {{ surveyElementParams?.numberOfStars }}</li>
        </ul>
        <div
            v-if="surveyStep.resultBasedNextSteps?.length > 0"
            class="table-wrap"
        >
            <table>
                <tr
                    v-for="(step, index) in surveyStep.resultBasedNextSteps"
                    :key="index"
                >
                    <td>{{ step.start }}</td>
                    <td>{{ step.end }}</td>
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
        <div class="grid grid-cols-4 gap-4">
            <form-input
                v-model:value="nextStep.start"
                class="mt-3"
                label="start"
                name="start"
            />
            <form-input
                v-model:value="nextStep.end"
                class="mt-3"
                label="end"
                name="end"
            />
            <form-select
                v-model:selected="nextStep.stepId"
                class="mt-3"
                :options="surveySteps"
                title-key="name"
                value-key="id"
                :default-value="-1"
                label="step"
            />
            <button
                class="primary mt-3"
                :disabled="v$.$invalid"
                @click="addResultBasedStep()"
            >
                <PlusIcon />
            </button>
        </div>
    </div>
</template>
<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import useVuelidate from '@vuelidate/core'
import { required, between } from '@vuelidate/validators'
import { TrashIcon, PlusIcon } from '@heroicons/vue/outline'
import FormInput from '../../Forms/FormInput.vue'
import FormSelect from '../../Forms/FormSelect.vue'

export default {
    components: { FormInput, FormSelect, TrashIcon, PlusIcon },
    setup() {
        const store = useStore()
        const { t } = useI18n()
        const surveyStep = computed(() => store.state.surveys.surveyStep)
        const surveySteps = computed(() => store.state.surveys.survey.steps)
        const surveyElementParams = computed(
            () =>
                store.state.surveyElements.surveyElements.find((element) => {
                    console.log(element.value)
                    return element.id === surveyStep.value.id
                })?.params,
        )

        const nextStep = ref({
            start: 1,
            end: surveyElementParams.value.numberOfStars,
            stepId: -1,
        })

        const addResultBasedStep = () => {
            console.log(typeof surveyStep.value.resultBasedNextSteps)
            // add to array
            if (!surveyStep.value.resultBasedNextSteps) {
                surveyStep.value.resultBasedNextSteps = []
            }
            surveyStep.value.resultBasedNextSteps.push(nextStep.value)

            // reset
            nextStep.value = {
                start: 1,
                end: surveyElementParams.value.numberOfStars,
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

        console.log(surveyElementParams.value)
        const validations = computed({
            get: () => {
                return {
                    start: {
                        required,
                        between: between(
                            1,
                            surveyElementParams.value.numberOfStars,
                        ),
                    },
                    end: {
                        required,
                        between: between(
                            nextStep.value.start,
                            surveyElementParams.value.numberOfStars,
                        ),
                    },
                    stepId: {
                        exists: (value) =>
                            surveySteps.value.find((step) => step.id === value),
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

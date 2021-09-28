<template>
    <div>
        <h1>star rating next steps</h1>
        <ul>
            <li>number of stars: {{ surveyElementParams.numberOfStars }}</li>
        </ul>
        <ul>
            <li
                v-for="(nextStep, index) in surveyStep.resultBasedNextSteps"
                :key="index"
            >
                <div class="grid grid-cols-4 gap-4">
                    <span>start: {{ nextStep.startValue }}</span>
                    <span>end: {{ nextStep.endValue }}</span>
                    <span>id: {{ nextStep.stepId }}</span>
                    <button
                        class="primary"
                        @click="removeResultBasedStep(index)"
                    >
                        trash
                    </button>
                </div>
            </li>
        </ul>

        <h2>add new result based step</h2>
        <div class="grid grid-cols-4 gap-4">
            <form-input
                v-model:value="params.startValue"
                class="mt-3"
                label="start"
            />
            <form-input
                v-model:value="params.endValue"
                class="mt-3"
                label="end"
            />
            <form-select
                v-model:selected="params.nextStep.id"
                :options="surveySteps"
                title-key="name"
                value-key="id"
                :default-value="-1"
                label="step"
            />
            <button
                class="primary"
                :disabled="v$.$invalid"
                @click="addResultBasedStep()"
            >
                add
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
import FormInput from '../../Forms/FormInput.vue'
import FormSelect from '../../Forms/FormSelect.vue'
export default {
    components: { FormInput, FormSelect },
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

        const params = ref({
            startValue: 0,
            endValue: 0,
            nextStep: { id: -1 },
        })

        const addResultBasedStep = () => {
            // create new step
            const newStep = {
                startValue: params.value.startValue,
                endValue: params.value.endValue,
                stepId: params.value.nextStep.id,
            }

            // add to array
            surveyStep.value.resultBasedNextSteps = surveyStep.value
                .resultBasedNextSteps
                ? [...surveyStep.value.resultBasedNextSteps, newStep]
                : [newStep]

            // TODO: reset default values
            // TODO: dispatch to store/cms
        }
        const removeResultBasedStep = (index) => {
            const resultBasedSteps = surveyStep.value.resultBasedNextSteps
            resultBasedSteps.splice(index, 1)
            surveyStep.value.resultBasedNextSteps = resultBasedSteps
            // TODO: dispatch to store/cms
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
                    startValue: {
                        required,
                        between: between(
                            0,
                            surveyElementParams.value.numberOfStars,
                        ),
                    },
                    endValue: {
                        required,
                        between: between(
                            params.value.startValue,
                            surveyElementParams.value.numberOfStars,
                        ),
                    },
                }
            },
            set: () => {},
        })

        return {
            v$: useVuelidate(validations, params),
            store,
            t,
            surveyStep,
            surveySteps,
            surveyElementParams,
            params,
            addResultBasedStep,
            removeResultBasedStep,
        }
    },
}
</script>

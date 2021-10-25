<template>
    <div>
        <div class="mt-2 mb-6">
            <ul>
                <li>
                    {{ t('questions', 1) }}:
                    {{
                        surveyStep.surveyElement?.params.question[language.code]
                    }}
                </li>
                <li>
                    {{ t('number_of_stars') }}:
                    {{ surveyElementParams?.numberOfStars }}
                </li>
                <li>
                    {{ t('label_lowest_value') }}:
                    {{ surveyElementParams?.lowestValueLabel[language.code] }}
                </li>
                <li>
                    {{ t('label_highest_value') }}:
                    {{ surveyElementParams?.highestValueLabel[language.code] }}
                </li>
            </ul>
        </div>
        <div
            v-if="surveyStep?.resultBasedNextSteps?.length > 0"
            class="table-wrap mb-6"
        >
            <table>
                <thead class="bg-blue-500">
                    <tr>
                        <th>{{ t('from') }}</th>
                        <th>{{ t('to') }}</th>
                        <th>{{ t('steps', 1) }}</th>
                        <th>{{ t('actions', 2) }}</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr
                        v-for="(step, index) in surveyStep.resultBasedNextSteps"
                        :key="index"
                    >
                        <td>{{ step.start }}</td>
                        <td>{{ step.end }}</td>
                        <td>
                            {{
                                surveySteps.find(
                                    (item) => item.id === step.stepId,
                                ).name
                            }}
                        </td>
                        <td
                            class="pointer float-right"
                            @click="removeResultBasedStep(index)"
                        >
                            <TrashIcon class="h-5 w-5" />
                        </td>
                    </tr>
                    <!-- TODO: fix dropdown not overlapping bug -->
                    <!-- <tr>
                        <td>
                            <form-input
                                v-model:value="nextStep.start"
                                label=""
                            />
                        </td>
                        <td>
                            <form-input v-model:value="nextStep.end" label="" />
                        </td>
                        <td>
                            <form-select
                                v-model:selected="nextStep.stepId"
                                :options="surveySteps"
                                title-key="name"
                                value-key="id"
                                :default-value="-1"
                                label=""
                            />
                        </td>
                        <td>
                            <action-button
                                :action-text="t('action_add')"
                                @execute="addResultBasedStep"
                            />
                        </td>
                    </tr> -->
                </tbody>
            </table>
        </div>

        <div class="grid grid-cols-12 gap-4">
            <form-input
                v-model:value="nextStep.start"
                class="mt-3 col-span-2"
                :label="t('from')"
                name="start"
            />
            <form-input
                v-model:value="nextStep.end"
                class="mt-3 col-span-2"
                :label="t('to')"
                name="end"
            />
            <form-select
                v-model:selected="nextStep.stepId"
                class="mt-3 col-span-5"
                :options="surveySteps"
                title-key="name"
                value-key="id"
                :default-value="-1"
                :label="t('steps', 1)"
            />
            <action-button
                class="mt-9 col-span-3"
                :action-text="t('action_add')"
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
import { required, between } from '@vuelidate/validators'
import { TrashIcon, PlusIcon } from '@heroicons/vue/outline'
import FormInput from '../../Forms/FormInput.vue'
import FormSelect from '../../Forms/FormSelect.vue'
import ActionButton from '../../Common/ActionButton.vue'

export default {
    components: { ActionButton, FormInput, FormSelect, TrashIcon, PlusIcon },
    setup() {
        const store = useStore()
        const { t } = useI18n()
        const surveyStep = computed(() => store.state.surveys.surveyStep)
        const surveySteps = computed(() => store.state.surveys.survey.steps)
        const surveyElementParams = computed(
            () =>
                store.state.surveyElements.surveyElements.find((element) => {
                    // console.log(element.value)
                    return element.id === surveyStep.value.id
                })?.params,
        )

        const nextStep = ref({
            start: 1,
            end: surveyElementParams.value.numberOfStars,
            stepId: -1,
        })
        const language = store.state.languages.language
            ? store.state.languages.language
            : store.state.languages.languages.find(
                  (language) => language.default,
              )

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
            language,
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

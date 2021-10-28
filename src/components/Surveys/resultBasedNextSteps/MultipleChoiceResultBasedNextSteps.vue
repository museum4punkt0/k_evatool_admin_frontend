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
            </ul>
        </div>
        <div
            v-if="surveyStep?.resultBasedNextSteps?.length > 0"
            class="table-wrap"
        >
            <table>
                <thead>
                    <tr>
                        <th>{{ t('options', 1) }}</th>
                        <th>{{ t('steps', 1) }}</th>
                        <th>{{ t('actions', 2) }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(step, s) in surveyStep.resultBasedNextSteps"
                        :key="s"
                    >
                        <td>{{ step.value }}</td>
                        <td>
                            {{
                                surveySteps.find(
                                    (item) => item.id === step.stepId,
                                ).name
                            }}
                        </td>
                        <td
                            class="pointer float-right"
                            @click="deleteResultBasedStep(s)"
                        >
                            <TrashIcon class="h-5 w-5" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="surveyStep?.surveyElement" class="grid grid-cols-5 gap-4">
            <form-select
                v-model:selected="nextStep.value"
                class="mt-3 col-span-2"
                :options="
                    surveyStep.surveyElement.params.options.filter(
                        (option) =>
                            surveyStep.resultBasedNextSteps.find(
                                (resultBasedStep) =>
                                    resultBasedStep.value === option.value,
                            ) == null,
                    )
                "
                title-key="value"
                value-key="value"
                :label="t('options', 1)"
            />
            <form-select
                v-model:selected="nextStep.stepId"
                class="mt-3 col-span-2"
                :options="surveySteps.filter((x) => x.id !== surveyStep.id)"
                title-key="name"
                value-key="id"
                :default-value="-1"
                :label="t('steps', 1)"
            />
            <action-button
                class="mt-9 col-span-1"
                :disabled="v$.$invalid"
                @execute="setNextStep"
            >
                <PlusIcon class="h-5 w-5" />
            </action-button>
        </div>
    </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

import FormSelect from '../../Forms/FormSelect.vue'
import ActionButton from '../../Common/ActionButton.vue'

import { TrashIcon, PlusIcon } from '@heroicons/vue/outline'

export default {
    components: { ActionButton, FormSelect, TrashIcon, PlusIcon },
    setup() {
        const store = useStore()
        const { t } = useI18n()
        const surveyStep = computed(() => store.state.surveys.surveyStep)
        const surveySteps = computed(() => store.state.surveys.survey.steps)

        const nextStep = ref({
            value: '',
            stepId: -1,
        })
        const language = store.state.languages.language
            ? store.state.languages.language
            : store.state.languages.languages.find(
                  (language) => language.default,
              )

        const setNextStep = () => {
            // Todo: Check if step is not already assigned
            if (!surveyStep.value.resultBasedNextSteps) {
                surveyStep.value.resultBasedNextSteps = []
            }
            surveyStep.value.resultBasedNextSteps.push({ ...nextStep.value })

            store.dispatch('surveys/saveSurveyStep', surveyStep.value)
            nextStep.value = {
                value: '',
                stepId: -1,
            }
        }

        const deleteResultBasedStep = (index) => {
            const confirmDelete = confirm(t('confirm_delete_result_based_step'))
            if (confirmDelete) {
                surveyStep.value.resultBasedNextSteps.splice(index, 1)

                store.dispatch('surveys/saveSurveyStep', surveyStep.value)
            }
        }

        const validations = {
            value: {
                required,
            },
            stepId: {
                required,
                exists: (value) => {
                    return (
                        surveySteps.value.find((step) => step.id === value) !=
                        null
                    )
                },
            },
        }
        const v$ = useVuelidate(validations, nextStep, {
            scope: 'multipleChoiceResultBasedNextSteps',
        })

        return {
            v$,
            store,
            t,
            surveyStep,
            surveySteps,
            nextStep,
            setNextStep,
            deleteResultBasedStep,
            language,
        }
    },
}
</script>

<template>
    <div>
        <div class="mt-2 mb-6">
            <ul>
                <li>
                    <div class="flex flex-row gap-1">
                        {{ t('questions', 1) }}:
                        <span
                            v-html="
                                surveyStep.surveyElement?.params.question[
                                    language.code
                                ]
                            "
                        ></span>
                    </div>
                </li>
            </ul>
        </div>
        <div
            v-if="surveyStep.resultBasedNextSteps?.length > 0"
            class="table-wrap mb-3"
        >
            <table>
                <thead>
                    <tr>
                        <th class="sticky">{{ t('emoji', 1) }}</th>
                        <th class="sticky">{{ t('steps', 1) }}</th>
                        <th class="sticky">{{ t('actions', 2) }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(step, index) in surveyStep.resultBasedNextSteps"
                        :key="index"
                    >
                        <td>{{ step.type }}</td>
                        <td>
                            {{
                                surveySteps.find(
                                    (item) => item.id === step.stepId,
                                ).name
                            }}
                        </td>
                        <td
                            class="pointer float-right text-red-600"
                            @click="removeResultBasedStep(index)"
                        >
                            <TrashIcon class="h-5 w-5" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="flex">
            <form-select
                v-model:selected="nextStep.type"
                class="w-1/6 mr-4"
                :options="
                    surveyElementParams?.emojis.filter(
                        (emoji) =>
                            surveyStep.resultBasedNextSteps?.find(
                                (step) => step.type === emoji.type,
                            ) == null,
                    )
                "
                title-key="type"
                value-key="type"
                :default-value="-1"
                :label="t('emoji')"
            />
            <form-select
                v-model:selected="nextStep.stepId"
                class="flex-grow mr-4"
                :options="surveySteps.filter((x) => x.id !== surveyStep.id)"
                title-key="name"
                value-key="id"
                :default-value="-1"
                :label="t('steps', 1)"
            />
            <action-button
                class="mt-6"
                :disabled="v$.$invalid"
                @execute="addResultBasedStep"
            >
                <plus-icon class="h-5 w-5" />
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
            () => store.state.surveys.surveyStep.surveyElement?.params,
            // () =>
            //     store.state.surveyElements.surveyElements.find((element) => {
            //         return element.id === surveyStep.value.id
            //     })?.params,
        )

        const nextStep = ref({
            type: null,
            stepId: -1,
        })
        const language = store.state.languages.language
            ? store.state.languages.language
            : store.state.languages.languages.find(
                  (language) => language.default,
              )

        const addResultBasedStep = () => {
            // add to array
            if (!surveyStep.value.resultBasedNextSteps) {
                surveyStep.value.resultBasedNextSteps = []
            }
            surveyStep.value.resultBasedNextSteps.push(nextStep.value)

            // reset
            nextStep.value = {
                type: null,
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
            language,
        }
    },
}
</script>

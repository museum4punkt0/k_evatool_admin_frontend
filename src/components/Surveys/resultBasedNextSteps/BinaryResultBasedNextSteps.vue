<template>
    <div>
        <div class="mt-2 mb-6">
            <ul>
                <li>
                    <div class="flex flex-row gap-1">
                        {{ t('questions', 1) }}:
                        <span
                            v-html="
                                surveyElementParams?.question[language.code]
                            "
                        ></span>
                    </div>
                </li>
            </ul>
        </div>
        <form-select
            v-model:selected="nextSteps.trueNextStep.stepId"
            :options="surveySteps.filter((x) => x.id !== surveyStep.id)"
            title-key="name"
            value-key="id"
            :label="surveyElementParams?.trueLabel[language.code]"
        />
        <form-select
            v-model:selected="nextSteps.falseNextStep.stepId"
            :options="surveySteps.filter((x) => x.id !== surveyStep.id)"
            title-key="name"
            value-key="id"
            :label="surveyElementParams?.falseLabel[language.code]"
        />

        <div class="flex flex-row justify-end">
            <action-button
                v-if="surveyStep.id"
                color="danger"
                :disabled="surveyStep.resultCount > 0"
                :executing="deletingSurveyStep"
                class="mr-2"
                @execute="remove"
            >
                <TrashIcon class="h-5 w-5" />
            </action-button>

            <action-button
                :disabled="v$.$invalid"
                :action-text="t('action_save')"
                @execute="save"
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
    name: 'BinaryResultBasedNextSteps',
    components: {
        FormInput,
        FormSelect,
        ActionButton,
        TrashIcon,
        PlusIcon,
    },
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

        const nextSteps = ref(
            surveyStep.value.resultBasedNextSteps
                ? surveyStep.value.resultBasedNextSteps
                : {
                      trueNextStep: { stepId: null },
                      falseNextStep: { stepId: null },
                  },
        )
        const language = store.state.languages.language
            ? store.state.languages.language
            : store.state.languages.languages.find(
                  (language) => language.default,
              )

        const save = () => {
            store.dispatch('surveys/saveSurveyStep', {
                ...surveyStep.value,
                resultBasedNextSteps: nextSteps.value,
            })
        }
        const remove = () => {
            store.dispatch('surveys/saveSurveyStep', {
                ...surveyStep.value,
                resultBasedNextSteps: null,
            })
            // TODO: only on success
            nextSteps.value = {
                trueNextStep: { stepId: null },
                falseNextStep: { stepId: null },
            }
        }

        const validations = computed({
            get: () => {
                return {
                    trueNextStep: {
                        required,
                        stepId: {
                            required,
                        },
                    },
                    falseNextStep: {
                        required,
                        stepId: {
                            required,
                        },
                        unique: () =>
                            nextSteps.value.trueNextStep.stepId !=
                            nextSteps.value.falseNextStep.stepId,
                    },
                }
            },
            set: () => {},
        })

        return {
            v$: useVuelidate(validations, nextSteps),
            store,
            t,
            surveyStep,
            surveySteps,
            surveyElementParams,
            nextSteps,
            save,
            remove,
            language,
        }
    },
}
</script>

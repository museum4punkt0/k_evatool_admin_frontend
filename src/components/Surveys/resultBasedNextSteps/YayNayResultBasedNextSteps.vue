<template>
    <div>
        <form-select
            v-model:selected="nextSteps.trueNextStep"
            :options="surveySteps"
            title-key="name"
            value-key="id"
            :label="surveyElementParams?.trueValue"
        />
        <form-select
            v-model:selected="nextSteps.falseNextStep"
            :options="surveySteps"
            title-key="name"
            value-key="id"
            :label="surveyElementParams?.falseValue"
        />
        <action-button :action-text="t('action_save')" @execute="save" />
    </div>
</template>
<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import useVuelidate from '@vuelidate/core'
import { TrashIcon, PlusIcon } from '@heroicons/vue/outline'
import FormInput from '../../Forms/FormInput.vue'
import FormSelect from '../../Forms/FormSelect.vue'
import ActionButton from '../../Common/ActionButton.vue'

export default {
    name: 'YayNayResultBasedNextSteps',
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
        // console.log('params', typeof surveyStep.value.resultBasedNextSteps)
        // TODO: check what type api returns

        const nextSteps = ref(
            surveyStep.value.resultBasedNextSteps
                ? JSON.parse(surveyStep.value.resultBasedNextSteps)
                : {
                      trueNextStep: null,
                      falseNextStep: null,
                  },
        )

        const save = () => {
            store.dispatch('surveys/saveSurveyStep', {
                ...surveyStep.value,
                resultBasedNextSteps: nextSteps.value,
            })
        }

        const validations = computed({
            get: () => {
                return { trueNextStep: {}, falseNextStep: {} }
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
        }
    },
}
</script>

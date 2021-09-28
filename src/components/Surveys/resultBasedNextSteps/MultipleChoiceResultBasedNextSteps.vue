<template>
    <div v-if="surveyStep.resultBasedNextSteps?.length > 0" class="table-wrap">
        <table>
            <tr v-for="(step, s) in surveyStep.resultBasedNextSteps" :key="s">
                <td>{{ step.value }}</td>
                <td>{{ step.stepId }}</td>
                <td
                    class="pointer float-right"
                    @click="deleteResultBasedStep(s)"
                >
                    <TrashIcon class="h-5 w-5" />
                </td>
            </tr>
        </table>
    </div>

    <div class="grid grid-cols-5 gap-4">
        <form-select
            v-model:selected="nextStep.value"
            class="mt-3 col-span-2"
            :options="surveyStep.surveyElement.params.options"
            title-key="value"
            value-key="value"
            :label="t('options', 1)"
        />

        <form-select
            v-model:selected="nextStep.stepId"
            class="mt-3 col-span-2"
            :options="surveySteps"
            title-key="name"
            value-key="id"
            :default-value="-1"
            :label="t('steps', 1)"
        />
        <action-button
            class="mt-9"
            :action-text="t('action_save')"
            @execute="setNextStep"
        />
    </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

import useVuelidate from '@vuelidate/core'

import FormSelect from '../../Forms/FormSelect.vue'
import ActionButton from '../../Common/ActionButton.vue'

import { TrashIcon } from '@heroicons/vue/outline'

export default {
    components: { ActionButton, FormSelect, TrashIcon },
    setup() {
        const store = useStore()
        const { t } = useI18n()
        const surveyStep = computed(() => store.state.surveys.surveyStep)
        const surveySteps = computed(() => store.state.surveys.survey.steps)

        const nextStep = ref({
            value: '',
            stepId: -1,
        })

        const setNextStep = () => {
            // Todo: Check if step is not already assigned
            if (!surveyStep.value.resultBasedNextSteps) {
                surveyStep.value.resultBasedNextSteps = []
            }
            surveyStep.value.resultBasedNextSteps.push({ ...nextStep.value })
            // Todo: Implement survey step save
        }

        const deleteResultBasedStep = (index) => {
            const confirmDelete = confirm(t('confirm_delete_result_based_step'))
            if (confirmDelete) {
                surveyStep.value.resultBasedNextSteps.splice(index, 1)
                // Todo: Implement survey step save
            }
        }

        return {
            v$: useVuelidate(),
            store,
            t,
            surveyStep,
            nextStep,
            setNextStep,
            deleteResultBasedStep,
            surveySteps,
        }
    },
}
</script>

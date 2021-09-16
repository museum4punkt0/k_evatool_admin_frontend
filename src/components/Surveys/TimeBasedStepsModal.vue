<template>
    <TransitionRoot appear :show="isOpen" as="template">
        <Dialog as="div" @close="closeModal">
            <div class="fixed inset-0 z-10 overflow-y-auto">
                <div class="min-h-screen px-4 text-center">
                    <TransitionChild
                        as="template"
                        enter="duration-300 ease-out"
                        enter-from="opacity-0"
                        enter-to="opacity-100"
                        leave="duration-200 ease-in"
                        leave-from="opacity-100"
                        leave-to="opacity-0"
                    >
                        <DialogOverlay class="fixed inset-0" />
                    </TransitionChild>

                    <span
                        class="inline-block h-screen align-middle"
                        aria-hidden="true"
                    >
                        &#8203;
                    </span>

                    <TransitionChild
                        as="template"
                        enter="duration-300 ease-out"
                        enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100"
                        leave="duration-200 ease-in"
                        leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95"
                    >
                        <div
                            class="
                                inline-block
                                w-full
                                max-w-md
                                p-6
                                my-8
                                overflow-hidden
                                text-left
                                align-middle
                                transition-all
                                transform
                                bg-white
                                shadow-xl
                                rounded-2xl
                            "
                        >
                            <!--                            <DialogTitle
                                as="h3"
                                class="
                                    text-lg
                                    font-medium
                                    leading-6
                                    text-gray-900
                                "
                            >
                                Title
                            </DialogTitle>-->
                            <div class="mt-2">
                                <p class="text-sm text-gray-500">
                                    {{ timeBasedSteps }}
                                </p>
                                <div class="table-wrap mb-3">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th colspan="4">
                                                    {{ t('steps', 2) }}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr
                                                v-for="(
                                                    timeBasedStep, tIndex
                                                ) in timeBasedSteps"
                                                :key="tIndex"
                                            >
                                                <td>
                                                    {{ timeBasedStep.stepId }}
                                                    <p
                                                        class="
                                                            text-xs
                                                            text-gray-500
                                                        "
                                                    >
                                                        {{
                                                            timeBasedStep.description
                                                        }}
                                                    </p>
                                                </td>
                                                <td
                                                    class="
                                                        text-gray-500 text-sm
                                                    "
                                                >
                                                    {{ timeBasedStep.timecode }}
                                                </td>
                                                <td>
                                                    <StopIcon
                                                        v-if="
                                                            timeBasedStep.stopsVideo
                                                        "
                                                        class="h-5 w-5"
                                                    />
                                                </td>
                                                <td
                                                    class="pointer"
                                                    @click="
                                                        deleteTimeBasedStep(
                                                            tIndex,
                                                        )
                                                    "
                                                >
                                                    <TrashIcon
                                                        class="h-5 w-5"
                                                    />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div class="w-full bg-blue-200 p-2 rounded-lg">
                                    <form-select
                                        v-model:selected="
                                            selectedTimeBasedStep.stepId
                                        "
                                        :options="
                                            store.state.surveys.selectedSurvey
                                                .steps
                                        "
                                        title-key="name"
                                        value-key="id"
                                        :default-value="-1"
                                        :label="t('videos', 1)"
                                    />
                                    <form-input
                                        v-model:value="
                                            selectedTimeBasedStep.timecode
                                        "
                                        :placeholder="t('timestamps', 1)"
                                        :label="t('timestamps', 1)"
                                    />
                                    <form-input
                                        v-model:value="
                                            selectedTimeBasedStep.description
                                        "
                                        :placeholder="t('descriptions', 1)"
                                        :label="t('descriptions', 1)"
                                    />
                                    <form-toggle
                                        v-model:enabled="
                                            selectedTimeBasedStep.stopsVideo
                                        "
                                        class="my-3"
                                        :label="t('stops_video')"
                                    />
                                    <button
                                        class="primary"
                                        :disabled="savingTimeBasedSteps"
                                        @click="addTimeBasedStep"
                                    >
                                        Add step
                                    </button>
                                </div>
                            </div>

                            <div class="mt-4">
                                <button
                                    class="primary"
                                    :disabled="savingTimeBasedSteps"
                                    @click="closeModal"
                                >
                                    {{ t('action_close') }}
                                </button>
                            </div>
                        </div>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script>
import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
    DialogTitle,
} from '@headlessui/vue'

import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import FormToggle from '../Forms/FormToggle.vue'
import { useI18n } from 'vue-i18n'
import FormInput from '../Forms/FormInput.vue'
import FormSelect from '../Forms/FormSelect.vue'

import SURVEYS from '../../services/surveys'

import { TrashIcon, StopIcon } from '@heroicons/vue/outline'

export default {
    name: 'TimeBasedStepsModal',
    components: {
        FormSelect,
        FormInput,
        FormToggle,
        TransitionRoot,
        TransitionChild,
        Dialog,
        DialogOverlay,
        DialogTitle,
        TrashIcon,
        StopIcon,
    },
    props: {
        isOpen: {
            type: Boolean,
            default: false,
        },
        surveyStepId: {
            type: Number,
            default: -1,
        },
    },
    emits: ['update:is-open'],
    setup(props, { emit }) {
        const store = useStore()
        const { t } = useI18n()
        const savingTimeBasedSteps = ref(false)

        const initTimeBasedStep = {
            stepId: -1,
            timecode: '00:00:00:00',
            stopsVideo: true,
            description: '',
        }

        const selectedTimeBasedStep = ref(initTimeBasedStep)

        const modalIsOpen = computed({
            get: () => props.isOpen,
            set: (val) => emit('update:is-open', val),
        })

        const timeBasedSteps = ref(
            store.state.surveys.selectedSurvey.steps.find(
                (x) => x.id === props.surveyStepId,
            ).timeBasedSteps,
        )

        const addTimeBasedStep = async () => {
            timeBasedSteps.value.push(selectedTimeBasedStep.value)
            await saveSurveyStep()
            selectedTimeBasedStep.value = {
                stepId: -1,
                timecode: '00:00:00:00',
                stopsVideo: true,
                description: '',
            }
        }

        const deleteTimeBasedStep = (index) => {
            timeBasedSteps.value.splice(index, 1)
            saveSurveyStep()
        }

        const saveSurveyStep = async () => {
            savingTimeBasedSteps.value = true
            const surveyStep = {
                ...store.state.surveys.selectedSurvey.steps.find(
                    (x) => x.id === props.surveyStepId,
                ),
            }

            surveyStep.timeBasedSteps = timeBasedSteps.value

            await SURVEYS.saveSurveyStep(surveyStep, surveyStep.surveyId)

            savingTimeBasedSteps.value = false
        }

        return {
            modalIsOpen,
            savingTimeBasedSteps,
            selectedTimeBasedStep,
            store,
            t,
            timeBasedSteps,
            addTimeBasedStep,
            deleteTimeBasedStep,
            closeModal() {
                modalIsOpen.value = false
            },
        }
    },
}
</script>

<style scoped></style>

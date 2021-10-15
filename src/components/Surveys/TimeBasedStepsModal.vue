<template>
    <TransitionRoot appear :show="isOpen" as="template">
        <Dialog as="div" @close="closeModal">
            <DialogOverlay class="fixed inset-0 bg-black opacity-70 z-10" />
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
                                max-w-2xl
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
                            <DialogTitle
                                as="h3"
                                class="
                                    text-lg
                                    font-medium
                                    leading-6
                                    text-gray-900 text-capitalize
                                "
                            >
                                {{ t('time_based_steps', 2) }}
                            </DialogTitle>

                            <div class="mt-2">
                                <video
                                    v-if="asset?.urls?.url"
                                    class="w-full rounded-lg mb-3"
                                    controls
                                    muted
                                    @timeupdate="videoTimeUpdate"
                                    @play="videoPlay"
                                    @ended="videoEnded"
                                >
                                    <source
                                        :type="asset.mime"
                                        :src="asset.urls.url"
                                    />
                                </video>
                                <div
                                    v-if="timeBasedSteps?.length > 0"
                                    class="table-wrap mb-3"
                                >
                                    <table>
                                        <tbody>
                                            <tr
                                                v-for="(
                                                    timeBasedStep, tIndex
                                                ) in timeBasedSteps"
                                                :key="tIndex"
                                            >
                                                <td>
                                                    {{
                                                        store.state.surveys.survey.steps.find(
                                                            (x) =>
                                                                x.id ===
                                                                timeBasedStep.stepId,
                                                        ).name
                                                    }}
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
                                                <!--Todo: Add edit button and functionality-->
                                                <!--Todo: Add uuid for each element-->
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
                                            store.state.surveys?.survey?.steps
                                                ?.filter(
                                                    (item) =>
                                                        item.surveyElementType !==
                                                        'video',
                                                )
                                                ?.map(mapStepsAlreadyInUse)
                                        "
                                        title-key="name"
                                        value-key="id"
                                        :default-value="-1"
                                        :label="t('steps', 1)"
                                    />
                                    <form-input
                                        v-model:value="
                                            selectedTimeBasedStep.timecode
                                        "
                                        class="mt-3"
                                        :placeholder="t('timestamps', 1)"
                                        :label="t('timestamps', 1)"
                                        name="timecode"
                                    />
                                    <form-input
                                        v-model:value="
                                            selectedTimeBasedStep.description
                                        "
                                        class="mt-3"
                                        :placeholder="t('descriptions', 1)"
                                        :label="t('descriptions', 1)"
                                        name="description"
                                    />
                                    <form-toggle
                                        v-model:enabled="
                                            selectedTimeBasedStep.stopsVideo
                                        "
                                        class="my-3"
                                        :label="t('stops_video')"
                                    />
                                    <form-input
                                        v-if="!selectedTimeBasedStep.stopsVideo"
                                        v-model:value="
                                            selectedTimeBasedStep.displayTime
                                        "
                                        class="mt-3"
                                        :placeholder="t('display_time')"
                                        :label="t('display_time')"
                                        name="display-time"
                                    />
                                    <form-toggle
                                        v-model:enabled="
                                            selectedTimeBasedStep.allowChangingAnswer
                                        "
                                        class="my-3"
                                        :label="t('allow_changing_answer')"
                                    />
                                    <button
                                        class="primary"
                                        :disabled="savingTimeBasedSteps"
                                        @click="addTimeBasedStep"
                                    >
                                        {{ t('action_add_time_based_step') }}
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

import { v4 as uuidv4 } from 'uuid'

import SURVEYS from '../../services/surveyService'
import ASSETS from '../../services/assetService'

import { TrashIcon, StopIcon } from '@heroicons/vue/outline'

import useVuelidate from '@vuelidate/core'
import { maxLength, required, minValue } from '@vuelidate/validators'

import msToTimecode from 'ms-to-timecode'

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
    },
    emits: ['update:is-open'],
    setup(props, { emit }) {
        const store = useStore()
        const { t } = useI18n()
        const surveyStepId = store.state.surveys.surveyStepId
        const surveyStep = store.state.surveys.surveyStep
        const savingTimeBasedSteps = ref(false)

        const initTimeBasedStep = {
            uuid: uuidv4(),
            stepId: -1,
            timecode: '00:00:00:00',
            stopsVideo: true,
            displayTime: 0,
            description: '',
            allowChangingAnswer: false,
        }

        const asset = ref(null)

        const getAsset = async () => {
            asset.value = await ASSETS.getAsset(
                store.state.surveys.surveyStep.surveyElement.params
                    .videoAssetId,
            )
        }

        getAsset()

        const selectedTimeBasedStep = ref(initTimeBasedStep)

        const modalIsOpen = computed({
            get: () => props.isOpen,
            set: (val) => emit('update:is-open', val),
        })

        const timeBasedSteps = ref(surveyStep.timeBasedSteps)

        const addTimeBasedStep = async () => {
            if (!timeBasedSteps.value || !Array.isArray(timeBasedSteps.value)) {
                timeBasedSteps.value = []
            }
            timeBasedSteps.value.push(selectedTimeBasedStep.value)
            await saveSurveyStep()
            selectedTimeBasedStep.value = {
                uuid: uuidv4(),
                stepId: -1,
                timecode: '00:00:00:00',
                displayTime: 5,
                stopsVideo: true,
                description: '',
                allowChangingAnswer: false,
            }
        }

        const deleteTimeBasedStep = (index) => {
            const confirmDelete = confirm(t('confirm_delete_time_based_step'))
            if (confirmDelete) {
                timeBasedSteps.value.splice(index, 1)
                saveSurveyStep()
            }
        }

        const saveSurveyStep = async () => {
            savingTimeBasedSteps.value = true

            surveyStep.timeBasedSteps = timeBasedSteps.value

            await SURVEYS.saveSurveyStep(surveyStep, surveyStep.surveyId)

            savingTimeBasedSteps.value = false
        }

        const videoPlay = () => {}

        const videoEnded = () => {}

        const videoTimeUpdate = (event) => {
            const timestamp = parseInt(event.target.currentTime * 1000)
            const timecode = msToTimecode(timestamp, 25)
            selectedTimeBasedStep.value.timecode = timecode
        }

        const mapStepsAlreadyInUse = (step) => {
            if (
                timeBasedSteps?.value
                    ?.map((item) => item.stepId)
                    .includes(step.id)
            ) {
                return { ...step, name: `${step.name} (already in use)` }
            }
            return step
        }

        return {
            v$: useVuelidate(),
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
            surveyStep,
            asset,
            surveyStepId,
            videoTimeUpdate,
            videoPlay,
            videoEnded,
            mapStepsAlreadyInUse,
        }
    },
    validations: {
        selectedTimeBasedStep: {
            description: {
                maxLength: maxLength(100),
            },
            stepId: {
                required,
                minValue: minValue(1),
            },
        },
    },
}
</script>

<style scoped></style>

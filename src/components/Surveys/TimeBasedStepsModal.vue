<template>
    <TransitionRoot appear :show="isOpen" as="template">
        <Dialog as="div" @close="closeModal">
            <DialogOverlay class="fixed inset-0 bg-black opacity-70 z-10" />
            <div class="fixed inset-0 z-10 overflow-y-scroll">
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
                        <DialogOverlay class="fixed inset-0 mx-4" />
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
                            class="inline-block max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
                        >
                            <div class="flex justify-between">
                                <DialogTitle
                                    as="h3"
                                    class="text-lg font-medium leading-6 text-gray-900 text-capitalize"
                                >
                                    {{ t('headline_timebased_steps_modal') }}
                                </DialogTitle>
                                <x-icon
                                    class="h-6 w-6 pointer"
                                    @click="closeModal"
                                />
                            </div>

                            <div class="mt-2">
                                <video
                                    v-if="asset?.urls?.original"
                                    class="w-full rounded-lg mb-3"
                                    controls
                                    autoplay
                                    muted
                                    preload="metadata"
                                    @timeupdate="videoTimeUpdate"
                                    @play="videoPlay"
                                    @canplaythrough="videoCanPlay"
                                    @ended="videoEnded"
                                >
                                    <!--source
                                        :type="asset.mime"
                                        :src="
                                            asset.urls.original +
                                            '#t=' +
                                            convertTimecodeToSeconds(
                                                selectedTimecodes.startTimecode,
                                            ) +
                                            ',' +
                                            convertTimecodeToSeconds(
                                                selectedTimecodes.stopTimecode,
                                            )
                                        "
                                    /http://localhost:8085/evaluation-tool/eva_tool_demo_video.mp4#t=0.0,21.23-->
                                    <source
                                        :type="asset.mime"
                                        :src="
                                            'http://192.168.179.116:8085/evaluation-tool/eva_tool_demo_video.mp4' +
                                            '#t=' +
                                            convertTimecodeToSeconds(
                                                selectedTimecodes.startTimecode,
                                            ) +
                                            ',' +
                                            convertTimecodeToSeconds(
                                                selectedTimecodes.stopTimecode,
                                            )
                                        "
                                    />
                                </video>

                                <div v-if="videoDuration" class="my-3">
                                    <h4 class="my-2">
                                        {{ t('sub_headline_trim_video') }}
                                    </h4>
                                    <div class="flex justify-between">
                                        <div class="flex items-end">
                                            <form-input
                                                v-model:value="
                                                    selectedTimecodes.startTimecode
                                                "
                                                :invalid="
                                                    vtc$.startTimecode.$invalid
                                                "
                                                :placeholder="
                                                    t('timestamp_start')
                                                "
                                                :label="t('timestamp_start')"
                                                name="start"
                                            />
                                            <button
                                                class="secondary ml-1 h-10"
                                                :disabled="
                                                    vtc$.startTimecode
                                                        .$invalid ||
                                                    selectedTimecodes?.startTimecode ===
                                                        selectedTimeBasedStep?.timecode ||
                                                    (selectedTimecodes?.startTimecode ===
                                                        initTimecodes?.startTimecode &&
                                                        selectedTimeBasedStep?.timecode ===
                                                            selectedTimecodes.startTimecode)
                                                "
                                                @click="setTimecode('start')"
                                            >
                                                <clock-icon class="h-5 w-5" />
                                            </button>
                                            <button
                                                class="danger ml-1 h-10"
                                                :disabled="
                                                    initTimecodes?.startTimecode ===
                                                    selectedTimecodes.startTimecode
                                                "
                                                @click="resetTimecode('start')"
                                            >
                                                <reply-icon class="h-5 w-5" />
                                            </button>
                                        </div>
                                        <div class="flex items-end">
                                            <form-input
                                                v-model:value="
                                                    selectedTimecodes.stopTimecode
                                                "
                                                :invalid="
                                                    vtc$.stopTimecode.$invalid
                                                "
                                                :placeholder="
                                                    t('timestamp_stop')
                                                "
                                                :label="t('timestamp_stop')"
                                                name="start"
                                            />
                                            <button
                                                class="secondary ml-1 h-10"
                                                :disabled="
                                                    vtc$.stopTimecode
                                                        .$invalid ||
                                                    selectedTimecodes?.stopTimecode ===
                                                        selectedTimeBasedStep?.timecode ||
                                                    (selectedTimecodes?.stopTimecode ===
                                                        initTimecodes?.stopTimecode &&
                                                        selectedTimeBasedStep?.timecode ===
                                                            selectedTimecodes.stopTimecode)
                                                "
                                                @click="setTimecode('stop')"
                                            >
                                                <clock-icon class="h-5 w-5" />
                                            </button>
                                            <button
                                                class="danger ml-1 h-10"
                                                :disabled="
                                                    videoDuration ===
                                                    selectedTimecodes.stopTimecode
                                                "
                                                @click="resetTimecode('stop')"
                                            >
                                                <reply-icon class="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
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
                                                        class="text-xs text-gray-500"
                                                    >
                                                        {{
                                                            timeBasedStep.description
                                                        }}
                                                    </p>
                                                </td>
                                                <td
                                                    class="text-gray-500 text-sm"
                                                >
                                                    {{ timeBasedStep.timecode }}
                                                </td>
                                                <td>
                                                    <div class="flex">
                                                        <div class="mx-1">
                                                            <StopIcon
                                                                v-if="
                                                                    timeBasedStep.stopsVideo
                                                                "
                                                                v-tippy="{
                                                                    content: t(
                                                                        'tooltip_time_based_steps_modal_stop_icon',
                                                                    ),
                                                                }"
                                                                class="h-5 w-5"
                                                            />
                                                            <span
                                                                v-else
                                                                v-tippy="{
                                                                    content: t(
                                                                        'tooltip_time_based_steps_modal_stop_time',
                                                                    ),
                                                                }"
                                                            >
                                                                {{
                                                                    timeBasedStep.displayTime
                                                                }}s
                                                            </span>
                                                        </div>
                                                        <div
                                                            class="mx-1 pointer text-blue-800"
                                                            @click="
                                                                editTimeBasedStep(
                                                                    timeBasedStep.stepId,
                                                                )
                                                            "
                                                        >
                                                            <PencilAltIcon
                                                                class="h-5 w-5"
                                                            />
                                                        </div>
                                                        <div
                                                            class="mx-1 pointer text-red-600"
                                                            @click="
                                                                deleteTimeBasedStep(
                                                                    tIndex,
                                                                )
                                                            "
                                                        >
                                                            <TrashIcon
                                                                class="h-5 w-5"
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div class="w-full bg-blue-200 p-2 rounded-lg">
                                    <h4 class="mb-3">
                                        {{
                                            t(
                                                isEditingTimeBasedStep
                                                    ? 'sub_headline_change_timebase_step'
                                                    : 'sub_headline_add_timebase_step',
                                            )
                                        }}
                                    </h4>
                                    <form-input
                                        v-model:value="
                                            selectedTimeBasedStep.timecode
                                        "
                                        :invalid="v$.timecode.$invalid"
                                        class="mb-3"
                                        :placeholder="t('timestamps', 1)"
                                        :label="t('timestamps', 1)"
                                        name="timecode"
                                    />
                                    <form-select
                                        v-if="!isEditingTimeBasedStep"
                                        v-model:selected="
                                            selectedTimeBasedStep.stepId
                                        "
                                        :invalid="v$.stepId.$invalid"
                                        :options="timeBasedStepOptions"
                                        title-key="name"
                                        value-key="id"
                                        :default-value="-1"
                                        :label="t('steps', 1)"
                                    />
                                    <template v-else>
                                        <label>
                                            {{ t('steps', 1) }}
                                        </label>
                                        <h2>
                                            {{
                                                store.state.surveys?.survey?.steps?.find(
                                                    (x) =>
                                                        x.id ===
                                                        selectedTimeBasedStep.stepId,
                                                )?.name
                                            }}
                                        </h2>
                                    </template>
                                    <form-input
                                        v-model:value="
                                            selectedTimeBasedStep.description
                                        "
                                        :invalid="v$.description.$invalid"
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
                                    <template v-if="!isEditingTimeBasedStep">
                                        <button
                                            class="primary"
                                            :disabled="
                                                savingTimeBasedSteps ||
                                                v$.timecode.$invalid ||
                                                v$.stepId.$invalid ||
                                                v$.description.$invalid
                                            "
                                            @click="addTimeBasedStep"
                                        >
                                            {{
                                                t('action_add_time_based_step')
                                            }}
                                        </button>
                                    </template>
                                    <template v-else>
                                        <button
                                            class="secondary mr-3"
                                            @click="resetTimeBasedStep"
                                        >
                                            {{ t('action_cancel') }}
                                        </button>
                                        <button
                                            class="primary"
                                            :disabled="
                                                savingTimeBasedSteps ||
                                                v$.timecode.$invalid ||
                                                v$.stepId.$invalid ||
                                                v$.description.$invalid
                                            "
                                            @click="saveChangeTimeBasedStep"
                                        >
                                            {{ t('action_save') }}
                                        </button>
                                    </template>
                                </div>
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
    Dialog,
    DialogOverlay,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
} from '@headlessui/vue'
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import FormToggle from '../Forms/FormToggle.vue'
import { useI18n } from 'vue-i18n'
import FormInput from '../Forms/FormInput.vue'
import FormSelect from '../Forms/FormSelect.vue'
import { v4 as uuidv4 } from 'uuid'
import ASSETS from '../../services/assetService'
import {
    ClockIcon,
    PencilAltIcon,
    ReplyIcon,
    StopIcon,
    TrashIcon,
    XIcon,
} from '@heroicons/vue/outline'

import useVuelidate from '@vuelidate/core'
import { helpers, maxLength, minValue, required } from '@vuelidate/validators'
import msToTimecode from 'ms-to-timecode'

const timecodeValidator = helpers.regex(
    /^(?:(?:[0-1][0-9]|[0-2][0-3]):)(?:[0-5][0-9]:){2}(?:[0-2][0-9])$/,
)

export default {
    name: 'TimeBasedStepsModal',
    components: {
        FormSelect,
        FormInput,
        FormToggle,
        TransitionRoot,
        TransitionChild,
        ClockIcon,
        Dialog,
        DialogOverlay,
        DialogTitle,
        TrashIcon,
        PencilAltIcon,
        XIcon,
        StopIcon,
        ReplyIcon,
    },
    props: {
        isOpen: {
            type: Boolean,
            default: false,
        },
        timecodes: {
            type: Object,
            default: () => {},
        },
    },
    emits: ['update:is-open', 'update:timecodes'],
    setup(props, { emit }) {
        const store = useStore()
        const { t } = useI18n()
        const surveyStepId = store.state.surveys.surveyStepId
        const surveyStep = store.state.surveys.surveyStep
        const savingTimeBasedSteps = ref(false)

        const initTimecodes = {
            startTimecode: '00:00:00:00',
            stopTimecode: '00:00:00:00',
        }

        const initTimeBasedStep = {
            uuid: uuidv4(),
            stepId: -1,
            timecode: '00:00:00:00',
            stopsVideo: true,
            displayTime: 5,
            description: '',
            allowChangingAnswer: false,
        }

        const asset = ref(null)
        const videoFps = ref(25)

        const getAsset = async () => {
            asset.value = await ASSETS.getAsset(
                store.state.surveys?.surveyStep?.surveyElement?.params
                    ?.videoAssetId,
            )
            videoFps.value = asset.value.meta.video.frame_rate
        }

        getAsset()

        const videoDuration = ref(null)

        const selectedTimeBasedStep = ref({
            uuid: uuidv4(),
            stepId: -1,
            timecode: '00:00:00:00',
            stopsVideo: true,
            displayTime: 5,
            description: '',
            allowChangingAnswer: false,
        })

        const modalIsOpen = computed({
            get: () => props.isOpen,
            set: (val) => emit('update:is-open', val),
        })

        const timeBasedStepOptions = computed({
            get: () => {
                return store.state.surveys?.survey?.steps
                    ?.filter(
                        (item) =>
                            item.surveyElementType !== 'video' &&
                            !timeBasedSteps.value?.find(
                                (x) => x.stepId === item.id,
                            ) &&
                            item.previousStepsResultBased.length === 0 &&
                            item.previousSteps.length === 0 &&
                            !item.isFirstStep,
                    )
                    ?.map(mapStepsAlreadyInUse)
            },
        })

        const selectedTimecodes = computed({
            get: () => props.timecodes,
        })

        const timeBasedSteps = ref(surveyStep.timeBasedSteps)

        const addTimeBasedStep = async () => {
            if (!timeBasedSteps.value || !Array.isArray(timeBasedSteps.value)) {
                timeBasedSteps.value = []
            }
            timeBasedSteps.value.push(selectedTimeBasedStep.value)
            await saveSurveyStep()
            selectedTimeBasedStep.value = Object.assign({}, initTimeBasedStep)
        }

        const saveChangeTimeBasedStep = async () => {
            await saveSurveyStep()
            selectedTimeBasedStep.value = Object.assign({}, initTimeBasedStep)
        }

        const deleteTimeBasedStep = (index) => {
            const confirmDelete = confirm(t('confirm_delete_time_based_step'))
            if (confirmDelete) {
                timeBasedSteps.value.splice(index, 1)
                saveSurveyStep()
            }
        }

        const editTimeBasedStep = (id) => {
            const timeBasedStep = timeBasedSteps.value.find(
                (x) => x.stepId === id,
            )
            if (timeBasedStep) {
                selectedTimeBasedStep.value = timeBasedStep
            }
        }

        const resetTimeBasedStep = () => {
            // TODO: RESET THE STATE BACK
            selectedTimeBasedStep.value = initTimeBasedStep
        }

        const saveSurveyStep = async () => {
            savingTimeBasedSteps.value = true
            surveyStep.timeBasedSteps = timeBasedSteps.value
            store.dispatch('surveys/saveSurveyStep', surveyStep)

            // // TODO: dispatch action and let store handle save and update step
            // const step = await SURVEYS.saveSurveyStep(
            //     surveyStep,
            //     surveyStep.surveyId,
            // )
            // console.log('saved survey step', step)
            // store.dispatch('surveys/setSurveyStep', step)

            savingTimeBasedSteps.value = false
        }

        const videoPlay = () => {}

        const videoEnded = () => {}

        const videoTimeUpdate = (event) => {
            const timestamp = parseInt(event.target.currentTime * 1000)
            selectedTimeBasedStep.value.timecode = msToTimecode(
                timestamp,
                videoFps.value,
            )
        }

        const videoCanPlay = (event) => {
            // console.log(event.target.duration)
            const timestamp = parseInt(event.target.duration * 1000)
            videoDuration.value = msToTimecode(timestamp, videoFps.value)
            if (
                selectedTimecodes.value.stopTimecode ===
                initTimecodes.stopTimecode
            ) {
                selectedTimecodes.value.stopTimecode = msToTimecode(
                    timestamp,
                    videoFps.value,
                )
            }
        }

        const setTimecode = (value) => {
            if (value === 'start') {
                selectedTimecodes.value.startTimecode =
                    selectedTimeBasedStep.value.timecode
            } else {
                selectedTimecodes.value.stopTimecode =
                    selectedTimeBasedStep.value.timecode
            }
            emit('update:timecodes', selectedTimecodes)
        }

        const resetTimecode = (value) => {
            if (value === 'start') {
                selectedTimecodes.value.startTimecode =
                    initTimecodes.startTimecode
            } else {
                selectedTimecodes.value.stopTimecode = videoDuration.value
            }
            emit('update:timecodes', selectedTimecodes)
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

        const isEditingTimeBasedStep = computed({
            get: () => {
                // console.log(
                //     timeBasedSteps.value,
                //     selectedTimeBasedStep.value.stepId,
                // )
                return timeBasedSteps.value?.find(
                    (x) => x.stepId === selectedTimeBasedStep.value.stepId,
                )
            },
        })

        const newTimeBasedStepTimecodeValidator = () => {
            return (
                selectedTimecodes.value.startTimecode <=
                    selectedTimeBasedStep.value.timecode &&
                selectedTimecodes.value.stopTimecode >=
                    selectedTimeBasedStep.value.timecode
            )
        }

        const validations = computed({
            get: () => {
                return {
                    description: {
                        maxLength: maxLength(100),
                    },
                    stepId: {
                        required,
                        minValue: minValue(1),
                    },
                    timecode: {
                        required,
                        timecodeValidator,
                        newTimeBasedStepTimecodeValidator,
                    },
                }
            },
            set: () => {},
        })

        const timeBasedStepsMappedTimecodes = () => {
            return timeBasedSteps.value.map((step) => step.timecode)
        }

        const timeBasedStepLowestTimecode = () => {
            if (timeBasedStepsMappedTimecodes().length > 0) {
                return timeBasedStepsMappedTimecodes().reduce(function (p, v) {
                    return p < v ? p : v
                })
            } else {
                return selectedTimecodes.value.stopTimecode
            }
        }

        const timeBasedStepHighestTimecode = () => {
            if (timeBasedStepsMappedTimecodes().length > 0) {
                return timeBasedStepsMappedTimecodes().reduce(function (p, v) {
                    return p > v ? p : v
                })
            } else {
                return selectedTimecodes.value.startTimecode
            }
        }

        const startTimecodeValidator = () => {
            return !(
                selectedTimecodes.value.startTimecode >
                    timeBasedStepLowestTimecode() ||
                selectedTimecodes.value.startTimecode >=
                    selectedTimecodes.value.stopTimecode
            )
        }

        const stopTimecodeValidator = () => {
            return !(
                selectedTimecodes.value.stopTimecode <
                    timeBasedStepHighestTimecode() ||
                selectedTimecodes.value.startTimecode >=
                    selectedTimecodes.value.stopTimecode ||
                selectedTimecodes.value.stopTimecode > videoDuration.value
            )
        }

        const validateTimecodes = computed({
            get: () => {
                return {
                    startTimecode: {
                        required,
                        timecodeValidator,
                        startTimecodeValidator,
                    },
                    stopTimecode: {
                        required,
                        timecodeValidator,
                        stopTimecodeValidator,
                    },
                }
            },
            set: () => {},
        })

        const convertTimecodeToSeconds = (timecode) => {
            const timecodeParts = timecode.split(':')
            let hours = parseInt(timecodeParts[0])
            let minutes = parseInt(timecodeParts[1])
            let seconds = parseInt(timecodeParts[2])
            let ms = parseInt(timecodeParts[3])

            return seconds + minutes * 60 + hours * 60 * 60 + '.' + ms
        }

        return {
            v$: useVuelidate(validations, selectedTimeBasedStep, {
                scope: 'timeBaseSteps',
            }),
            vtc$: useVuelidate(validateTimecodes, selectedTimecodes, {
                scope: 'timecodesInModal',
            }),
            modalIsOpen,
            savingTimeBasedSteps,
            resetTimeBasedStep,
            saveChangeTimeBasedStep,
            selectedTimeBasedStep,
            selectedTimecodes,
            store,
            t,
            timeBasedSteps,
            initTimecodes,
            addTimeBasedStep,
            convertTimecodeToSeconds,
            setTimecode,
            resetTimecode,
            deleteTimeBasedStep,
            editTimeBasedStep,
            isEditingTimeBasedStep,
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
            videoDuration,
            videoCanPlay,
            timeBasedStepOptions,
        }
    },
}
</script>

<style scoped></style>

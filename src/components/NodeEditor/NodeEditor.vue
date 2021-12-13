<template>
    <div
        ref="nodeEditor"
        class="node-editor-wrap relative bg-blue-300 rounded-lg"
        @mousemove="onMouseMove"
    >
        <div class="zoom-menu m-1 fixed bg-gray-500 bg-opacity-50 rounded-lg">
            <button
                class="pointer disabled:opacity-50"
                :disabled="zoomFactor >= 1"
                @click.prevent.stop="zoom(0.1)"
            >
                <div class="p-2 flex h-full justify-center items-center">
                    <ZoomInIcon class="h-6 w-6" />
                </div>
            </button>
            <button
                class="pointer disabled:opacity-50"
                :disabled="zoomFactor <= 0.5"
                @click.prevent.stop="zoom(-0.1)"
            >
                <div class="p-2 flex h-full justify-center items-center">
                    <ZoomOutIcon class="h-6 w-6" />
                </div>
            </button>
        </div>
        <connection
            v-for="connection in connections"
            :id="connection.id"
            :key="'connection_' + connection.id"
            :style="{
                height: `${height}px`,
                width: `${width}px`,
                transform: 'scale(' + zoomFactor + ')',
            }"
            :start="
                getStepElementPosition(
                    connection.start.id,
                    connection.start.outlet === 'next' ? 'bottom' : 'right',
                )
            "
            :end="
                getStepElementPosition(
                    connection.end,
                    connection.start.outlet === 'next' ? 'top' : 'left',
                )
            "
            :dashed="connection.start.outlet !== 'next'"
            :label="connection.label"
            @click.prevent.stop="deselectStep"
        />
        <div
            ref="nodeCanvas"
            :style="{ transform: 'scale(' + zoomFactor + ')' }"
            class="node-canvas relative"
        >
            <div
                v-for="step in adminLayout"
                :key="'step_element_' + step.id"
                :ref="(el) => (stepElements[step.id] = el)"
                class="step p-0 m-0 rounded-lg border-0 bg-white shadow overflow-hidden h-full flex"
                :style="{
                    top: step?.position.y + 'px',
                    left: step?.position.x + 'px',
                    zIndex: draggedStep?.id === step?.id ? 3 : 2,
                }"
                :class="{
                    'shadow-lg': surveyStepId === step.id,
                    'node-selected': surveyStepId === step.id,
                    'border border-1 border-red-600':
                        steps.find((item) => item.id === step.id)?.previousSteps
                            .length === 0 &&
                        steps.find((item) => item.id === step.id)
                            ?.nextStepId === null,
                    'ring-yellow-400 ring-offset-1 ring-2': steps?.find(
                        (x) => x?.id === step?.id,
                    )?.isFirstStep,
                    'z-10': draggedStep?.id === step.id,
                }"
            >
                <div
                    class="node-content flex-grow"
                    @mousedown.prevent.stop="onMouseDown(step, $event)"
                >
                    <div
                        class="pointer h-full flex-col items-center justify-center"
                    >
                        <div class="flex border-b-2">
                            <button
                                v-if="
                                    steps.find((item) => item.id === step.id)
                                        ?.previousSteps.length === 0
                                "
                                class="w-10 pointer border-r-2"
                                @click.prevent.stop="selectStart(step.id)"
                            >
                                <div
                                    class="flex h-full justify-center items-center"
                                >
                                    <StarIcon
                                        :class="
                                            steps?.find(
                                                (x) => x?.id === step?.id,
                                            )?.isFirstStep
                                                ? 'text-yellow-400'
                                                : 'text-gray-400'
                                        "
                                        class="h-5 w-5"
                                    />
                                </div>
                            </button>
                            <div
                                class="flex-grow font-bold text-center p-2 break-all"
                            >
                                {{
                                    steps?.find((x) => x?.id === step?.id)?.name
                                }}
                            </div>
                        </div>

                        <element-content
                            :element="
                                store.state.surveyElements.surveyElements.find(
                                    (element) =>
                                        element.id ===
                                        steps.find((x) => x.id === step.id)
                                            ?.surveyElementId,
                                )
                            "
                            class="m-2"
                        ></element-content>
                    </div>
                </div>
                <div class="flex flex-col w-9 border-l">
                    <button
                        class="flex-1 w-8 pointer disabled:opacity-50"
                        :class="{
                            'bg-blue-200': step.id === selectedInput,
                        }"
                        :disabled="
                            hasNextAndPreviousSockets(step) ||
                            steps?.find((x) => x?.id === step?.id)?.isFirstStep
                        "
                        @click.prevent.stop="selectInput(step.id)"
                    >
                        <div class="flex h-full justify-center items-center">
                            <ArrowUpIcon class="h-4 w-4" />
                        </div>
                    </button>

                    <button
                        class="flex-1 disabled:opacity-25"
                        :disabled="
                            steps.find((x) => x.id === step.id)
                                ?.surveyElementType !== 'video'
                        "
                        @click.prevent.stop="openTimeBasedModal(step.id)"
                    >
                        <span class="flex h-full justify-center items-center">
                            <ClockIcon class="h-5 w-5" />
                        </span>
                    </button>
                    <button
                        class="flex-1 disabled:opacity-25"
                        :disabled="hasResultBasedNextStepsButton(step)"
                        @click.prevent.stop="openResultBasedModal(step.id)"
                    >
                        <span class="flex h-full justify-center items-center">
                            <switch-horizontal-icon class="h-5 w-5" />
                        </span>
                    </button>
                    <!--                    SKIP TOGGLE BUTTON / FUNCTION NOT IMPLEMENTED -->
                    <!--                    <div
                        class="flex-1 pointer"
                        @click.prevent.stop="toggleSkippableStep(step.id)"
                    >
                        <div class="flex h-full justify-center items-center">
                            <FastForwardIcon
                                class="h-5 w-5"
                                :class="{
                                    'text-blue-800':
                                        store.state.surveys.survey.steps.find(
                                            (item) => item.id === step.id,
                                        )?.allowSkip,
                                }"
                            />
                        </div>
                    </div>-->
                    <button
                        class="flex-1 pointer"
                        @click.prevent.stop="selectSurveyStep(step.id)"
                    >
                        <div class="flex h-full justify-center items-center">
                            <PencilIcon class="h-4 w-4" />
                        </div>
                    </button>
                    <button
                        class="flex-1 pointer"
                        :class="{
                            'bg-blue-200': step.id === selectedOutput,
                            'opacity-50': hasNextAndPreviousSockets(step),
                        }"
                        :disabled="hasNextAndPreviousSockets(step)"
                        @click.prevent.stop="selectOutput(step.id)"
                    >
                        <div class="flex h-full justify-center items-center">
                            <ArrowDownIcon class="h-4 w-4" />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    </div>
    <time-based-steps-modal
        v-if="timeBasedModalStepId > 0 && timeBasedModalIsOpen"
        v-model:is-open="timeBasedModalIsOpen"
        v-model:timecodes="stepTimecodes"
    />
    <result-based-steps-modal
        v-if="resultBasedModalStepId > 0 && resultBasedModalIsOpen"
        v-model:is-open="resultBasedModalIsOpen"
    />
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { debounce } from 'lodash'
import Connection from './Connection.vue'
import { TYPES } from '../../store/notifications'

import {
    ArrowUpIcon,
    ArrowDownIcon,
    ClockIcon,
    PencilIcon,
    FastForwardIcon,
    SwitchHorizontalIcon,
    ZoomInIcon,
    ZoomOutIcon,
} from '@heroicons/vue/outline'
import { StarIcon } from '@heroicons/vue/solid'

import TimeBasedStepsModal from '../Surveys/TimeBasedStepsModal.vue'
import ResultBasedStepsModal from '../Surveys/resultBasedNextSteps/ResultBasedStepsModal.vue'
import ElementContent from './ElementContent.vue'

import SURVEYS from '../../services/surveyService'

export default {
    name: 'NodeEditor',
    components: {
        TimeBasedStepsModal,
        ResultBasedStepsModal,
        Connection,
        ClockIcon,
        ArrowUpIcon,
        ArrowDownIcon,
        PencilIcon,
        FastForwardIcon,
        StarIcon,
        SwitchHorizontalIcon,
        ElementContent,
        ZoomInIcon,
        ZoomOutIcon,
    },
    props: {
        steps: {
            type: Array,
            default: () => [],
        },
        adminLayout: {
            type: Array,
            required: true,
        },
        surveyId: {
            type: Number,
            default: -1,
        },
    },
    emits: ['updated'],
    setup(props, { emit }) {
        /** NEEDED IMPORTS **/
        const store = useStore()
        const { t } = useI18n()

        /** REFERENCES **/
        const draggedStep = ref(null)
        const connections = ref([])
        const stepElements = ref({})
        const selectedInput = ref(-1)
        const selectedOutput = ref(-1)
        const timeBasedModalIsOpen = ref(false)
        const timeBasedModalStepId = ref(-1)
        const resultBasedModalIsOpen = ref(false)
        const resultBasedModalStepId = ref(-1)
        const stepTimecodes = ref({})
        const nodeEditor = ref(null)
        const nodeCanvas = ref(null)
        const height = ref(0)
        const width = ref(0)
        const zoomFactor = ref(1)

        /** COMPUTED PROPERTIES **/
        const surveyStepId = computed(() => store.state.surveys.surveyStepId)
        const defaultLanguage = computed(
            () => store.state.languages.defaultLanguage,
        )

        /** ONMOUNTED **/
        onMounted(() => {
            store.dispatch('surveys/resetSurveyStep')
            initAdminLayout()
            initConnections()
            setCanvasSize()
        })

        /** METHODS **/
        const fixLayoutPosition = (position) => {
            if (position.x < 0) {
                position.x = 100
            }
            if (position.y < 0) {
                position.y = 100
            }
            return position
        }

        const initAdminLayout = () => {
            const adminLayoutInit = []

            props.steps
                .filter((x) => !x.parentStepId)
                .forEach((step, stepIndex) => {
                    if (props.adminLayout) {
                        const index = props.adminLayout.findIndex(
                            (x) => x.id === step.id,
                        )
                        if (index < 0) {
                            adminLayoutInit.push({
                                id: step.id,
                                position: {
                                    x: 150,
                                    y: 150 + stepIndex * 220,
                                },
                            })
                        } else {
                            let stepFound = props.adminLayout.find(
                                (x) => x.id === step.id,
                            )
                            stepFound.position = fixLayoutPosition(
                                stepFound.position,
                            )
                            adminLayoutInit.push(stepFound)
                        }
                    } else {
                        adminLayoutInit.push({
                            id: step.id,
                            position: {
                                x: 150,
                                y: 150 + stepIndex * 220,
                            },
                        })
                    }
                })
            store.dispatch('surveys/setSurveyAdminLayout', adminLayoutInit)
        }

        const initConnections = () => {
            connections.value = []
            props.steps.forEach((step) => {
                if (step.nextStepId > 0) {
                    connections.value.push({
                        id: `${step.id}_next-${step.nextStepId}`,
                        label: 'next',
                        start: { id: step.id, outlet: 'next' },
                        end: step.nextStepId,
                    })
                }
                if (step.resultBasedNextSteps) {
                    const type = step.surveyElementType

                    if (type === 'binary') {
                        if (step.resultBasedNextSteps.trueNextStep?.stepId) {
                            connections.value.push({
                                id: `${step.id}_true`,
                                start: {
                                    id: step.id,
                                    outlet: 'resultBasedNext_true',
                                },
                                end: step.resultBasedNextSteps.trueNextStep
                                    .stepId,
                                // TODO: get true label
                                label: `option: ${'true'}`,
                            })
                        }
                        if (step.resultBasedNextSteps.falseNextStep?.stepId) {
                            connections.value.push({
                                id: `${step.id}_false`,
                                start: {
                                    id: step.id,
                                    outlet: 'resultBasedNext_false',
                                },
                                end: step.resultBasedNextSteps.falseNextStep
                                    .stepId,
                                // TODO: get false label
                                label: `option: ${'false'}`,
                            })
                        }
                    } else if (type === 'starRating') {
                        step.resultBasedNextSteps.forEach((nextStep) => {
                            connections.value.push({
                                id: `${step.id}_${nextStep.start}-${nextStep.end}`,
                                start: {
                                    id: step.id,
                                    outlet: `resultBasedNext_${nextStep.start}-${nextStep.end}`,
                                },
                                end: nextStep.stepId,
                                label: `rating: ${nextStep.start} - ${nextStep.end}`,
                            })
                        })
                    } else if (type === 'multipleChoice') {
                        step.resultBasedNextSteps.forEach((nextStep) => {
                            connections.value.push({
                                id: `${step.id}_${nextStep.value}`,
                                start: {
                                    id: step.id,
                                    outlet: `resultBasedNext_${nextStep.value}`,
                                },
                                end: nextStep.stepId,
                                label: `option: ${nextStep.value}`,
                            })
                        })
                    } else if (type === 'emoji') {
                        step.resultBasedNextSteps.forEach((nextStep) => {
                            connections.value.push({
                                id: `${step.id}_${nextStep.type}`,
                                label: `type: ${nextStep.type}`,
                                start: {
                                    id: step.id,
                                    outlet: `resultBasedNext_${nextStep.type}`,
                                },
                                end: nextStep.stepId,
                            })
                        })
                    }
                }
            })
        }

        const setCanvasSize = () => {
            height.value = nodeCanvas.value.scrollHeight
            width.value = nodeCanvas.value.scrollWidth
        }

        const selectSurveyStep = async (stepId) => {
            if (stepId !== store.state.surveys.surveyStepId) {
                await deselectStep()
                await store.dispatch('surveys/setSurveyStepId', {
                    surveyId: props.surveyId,
                    surveyStepId: stepId,
                })
            }
        }

        const refreshSteps = () => {
            store.dispatch('surveys/getSurveySteps', props.surveyId)
        }

        /** MOUSEHANDLER **/
        const onMouseDown = (step) => {
            draggedStep.value = step
        }
        const onMouseMove = (e) => {
            if (draggedStep.value) {
                draggedStep.value.position.x =
                    draggedStep.value.position.x +
                    e.movementX * (1 / zoomFactor.value)

                draggedStep.value.position.y =
                    draggedStep.value.position.y +
                    e.movementY * (1 / zoomFactor.value)
            }
        }

        const debouncedAdminLayoutSaver = debounce(async () => {
            await SURVEYS.saveAdminLayout(props.surveyId, props.adminLayout)
        }, 2000)

        const onMouseUp = async () => {
            setCanvasSize()
            if (store.state.surveys.surveyStepId !== -1) {
                store.dispatch('surveys/unsetSurveyStepId')
            }
            draggedStep.value = null
            debouncedAdminLayoutSaver()
        }

        const deselectStep = () => {
            store.dispatch('surveys/unsetSurveyStepId')
            selectedOutput.value = -1
            selectedInput.value = -1
        }

        const selectInput = async (stepId) => {
            selectedInput.value = stepId
            if (selectedOutput.value > 0) {
                await linkNextStep(selectedOutput.value, selectedInput.value)
                emit('updated')
            }
        }

        const selectOutput = async (stepId) => {
            if (props.steps.find((step) => step.id === stepId).nextStepId) {
                unlinkNextStep(stepId)
            } else {
                selectedOutput.value = stepId
                if (selectedInput.value > 0) {
                    await linkNextStep(
                        selectedOutput.value,
                        selectedInput.value,
                    )
                    emit('updated')
                }
            }
        }

        const selectStart = async (stepId) => {
            const step = store.state.surveys.survey.steps.find(
                (step) => step.id === stepId,
            )

            if (
                (step && !step.previousSteps) ||
                (step && step.previousSteps.length === 0)
            ) {
                await SURVEYS.surveyStepSetStartStep(props.surveyId, stepId)
                refreshSteps()
            } else {
                store.dispatch('notifications/add', {
                    type: TYPES.ERROR,
                    message: 'notification_error_startstep_previous',
                })
            }
        }

        const updateStepParams = async (stepId, params) => {
            // await SURVEYS.surveyStepSetStartStep(props.surveyId, stepId)
            // refreshSteps()
        }

        const linkNextStep = async (stepId, nextStepId) => {
            await store.dispatch('surveys/setNextStep', {
                surveyId: props.surveyId,
                stepId,
                nextStepId,
            })
            refreshSteps()
            // TODO: only on success
            selectedInput.value = -1
            selectedOutput.value = -1
        }

        const unlinkNextStep = async (stepId) => {
            await store.dispatch('surveys/removeNextStep', {
                surveyId: props.surveyId,
                stepId,
            })
            refreshSteps()
        }

        const getStepElementPosition = (id, anchor) => {
            const element = stepElements.value[id]
            let offsetX = 0
            let offsetY = 0
            const normalizedWidth =
                (element?.getBoundingClientRect().width *
                    (1 / zoomFactor.value)) /
                2
            const normalizedHeight =
                (element?.getBoundingClientRect().height *
                    (1 / zoomFactor.value)) /
                2
            const offset = 10 * zoomFactor.value
            switch (anchor) {
                case 'left': {
                    offsetX = -normalizedWidth - offset
                    break
                }
                case 'right': {
                    offsetX = normalizedWidth + offset
                    break
                }
                case 'top': {
                    offsetY = -normalizedHeight - offset
                    break
                }
                case 'bottom': {
                    offsetY = normalizedHeight + offset
                    break
                }
            }
            return {
                x: parseInt(element?.style.left, 10) + offsetX,
                y: parseInt(element?.style.top, 10) + offsetY,
            }
        }

        const openTimeBasedModal = async (stepId) => {
            await selectSurveyStep(stepId)
            timeBasedModalIsOpen.value = true
            timeBasedModalStepId.value = stepId
            const params = store.state.surveys.survey.steps.find(
                (item) => item.id === timeBasedModalStepId.value,
            ).params
            stepTimecodes.value = params
                ? params
                : { startTimecode: '00:00:00:00', stopTimecode: '00:00:00:00' }
        }

        const openResultBasedModal = async (stepId) => {
            await selectSurveyStep(stepId)
            resultBasedModalIsOpen.value = true
            resultBasedModalStepId.value = stepId
        }

        const toggleSkippableStep = async (stepId) => {
            console.log('toggle skippable', stepId)
        }

        const hasNextAndPreviousSockets = (step) => {
            return (
                props.steps.find((item) => {
                    let found = false
                    item.timeBasedSteps?.forEach((timeBasedStep) => {
                        if (timeBasedStep.stepId === step.id) {
                            found = true
                        }
                    })
                    return found
                }) != null
            )
        }
        const hasResultBasedNextStepsButton = (step) => {
            return (
                !['multipleChoice', 'binary', 'starRating', 'emoji'].includes(
                    props.steps.find((x) => x.id === step.id)
                        ?.surveyElementType,
                ) ||
                /*
                                    TODO: tooltip
                                    multiple choice && min===max===1
                                    */
                (props.steps.find((x) => x.id === step.id)
                    ?.surveyElementType === 'multipleChoice' &&
                    !(
                        store.state.surveyElements.surveyElements.find(
                            (element) =>
                                element.id ===
                                props.steps.find((x) => x.id === step.id)
                                    ?.surveyElementId,
                        ).params.minSelectable === 1 &&
                        store.state.surveyElements.surveyElements.find(
                            (element) =>
                                element.id ===
                                props.steps.find((x) => x.id === step.id)
                                    ?.surveyElementId,
                        ).params.maxSelectable === 1
                    )) ||
                /*
                                    TODO: tooltip
                                    is time based next step
                                    */
                props.steps.find((item) => {
                    let found = false
                    item.timeBasedSteps?.forEach((timeBasedStep) => {
                        if (timeBasedStep.stepId === step.id) {
                            found = true
                        }
                    })
                    return found
                }) != null
            )
        }
        const zoom = (zoomfactor) => {
            if (zoomfactor < 0 && zoomFactor.value > 0.5) {
                zoomFactor.value = parseFloat(
                    (zoomFactor.value + zoomfactor).toFixed(1),
                )
            } else if (zoomfactor > 0 && zoomFactor.value < 1.0) {
                zoomFactor.value = parseFloat(
                    (zoomFactor.value + zoomfactor).toFixed(1),
                )
            }
            refreshSteps()
        }

        /** WATCHER **/
        watch(
            () => timeBasedModalIsOpen.value,
            (value) => {
                if (!value) {
                    refreshSteps()
                }
            },
        )
        watch(
            () => nodeCanvas.value,
            () => {
                setCanvasSize()
            },
            { deep: true },
        )
        watch(
            () => props.steps,
            () => {
                initAdminLayout()
                initConnections()
            },
        )
        watch(
            () => stepTimecodes,
            (value) => {
                let stepData = store.state.surveys.survey.steps.find(
                    (item) => item.id === timeBasedModalStepId.value,
                )
                stepData['params'] = value.value
                SURVEYS.saveSurveyStep(stepData, props.surveyId)
            },
            { deep: true },
        )

        return {
            connections,
            defaultLanguage,
            deselectStep,
            draggedStep,
            getStepElementPosition,
            hasNextAndPreviousSockets,
            hasResultBasedNextStepsButton,
            height,
            nodeCanvas,
            nodeEditor,
            onMouseDown,
            onMouseMove,
            onMouseUp,
            openResultBasedModal,
            openTimeBasedModal,
            refreshSteps,
            resultBasedModalIsOpen,
            resultBasedModalStepId,
            selectedOutput,
            selectedInput,
            selectInput,
            selectOutput,
            selectSurveyStep,
            selectStart,
            store,
            surveyStepId,
            stepElements,
            stepTimecodes,
            t,
            timeBasedModalIsOpen,
            timeBasedModalStepId,
            toggleSkippableStep,
            unlinkNextStep,
            updateStepParams,
            width,
            zoom,
            zoomFactor,
        }
    },
}
</script>

<style scoped>
.node-editor-wrap {
    width: 100%;
    height: 100%;
    overflow: auto;
}
.node-canvas {
    z-index: 3;
    transform-origin: left top;
    transition: all 250ms ease-in-out;
}
.step {
    width: 230px;
    height: fit-content;
    position: absolute;
    transform: translateX(-50%) translateY(-50%);
    hyphens: auto;
}
.zoom-menu {
    z-index: 10;
}
</style>

<template>
    <div>
        <div class="node-editor-wrap bg-blue-300 rounded-lg">
            <div
                id="nodeEditor"
                class="node-editor"
                :style="{ width: `${width}px`, height: `${height}px` }"
                @mousemove="onMouseMove"
                @mouseup.prevent.stop="onMouseUp"
                @mouseleave="onMouseUp"
            >
                <connection
                    v-for="connection in connections"
                    :id="connection.id"
                    :key="connection.id"
                    :start="
                        getStepElementPosition(
                            connection.start.id,
                            connection.start.outlet === 'next'
                                ? 'right'
                                : 'bottom',
                        )
                    "
                    :end="getStepElementPosition(connection.end, 'left')"
                    :height="height"
                    :width="width"
                    :dashed="connection.start.outlet !== 'next'"
                    :label="connection.label"
                    @click.prevent.stop="deselectStep"
                ></connection>
                <div
                    v-for="step in adminLayout"
                    :key="step.id"
                    :ref="(el) => (stepElements[step.id] = el)"
                    class="
                        step
                        p-0
                        m-0
                        rounded-lg
                        border-0
                        bg-white
                        shadow
                        overflow-hidden
                        h-full
                        flex flex-col
                    "
                    :style="{
                        top: step?.position.y + 'px',
                        left: step?.position.x + 'px',
                        zIndex: draggedStep?.id === step?.id ? 3 : 2,
                    }"
                    :class="{
                        'shadow-lg': surveyStepId === step.id,
                        'node-selected': surveyStepId === step.id,
                        'border-1': draggedStep,
                    }"
                >
                    <div
                        class="node-content flex-grow overflow-y-scroll"
                        @mousedown.prevent.stop="onMouseDown(step, $event)"
                    >
                        <div
                            class="
                                pointer
                                h-full
                                flex-col
                                items-center
                                justify-center
                            "
                        >
                            <div class="font-bold">
                                {{
                                    steps?.find((x) => x?.id === step?.id)?.name
                                }}
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
                    <div class="w-full border-t">
                        <div class="flex flex-row h-9">
                            <div
                                class="flex-1 w-8 pointer"
                                :class="{
                                    'bg-blue-200': step.id === selectedInput,
                                }"
                                @click.prevent.stop="selectInput(step.id)"
                            >
                                <div
                                    class="
                                        flex
                                        h-full
                                        justify-center
                                        items-center
                                    "
                                >
                                    <ArrowLeftIcon class="h-4 w-4" />
                                </div>
                            </div>

                            <button
                                class="flex-1 disabled:opacity-25"
                                :disabled="
                                    steps.find((x) => x.id === step.id)
                                        ?.surveyElementType !== 'video'
                                "
                                @click.prevent.stop="
                                    openTimeBasedModal(step.id)
                                "
                            >
                                <span
                                    class="
                                        flex
                                        h-full
                                        justify-center
                                        items-center
                                    "
                                >
                                    <ClockIcon class="h-5 w-5" />
                                </span>
                            </button>
                            <button
                                class="flex-1 disabled:opacity-25"
                                :disabled="
                                    ![
                                        'multipleChoice',
                                        'binary',
                                        'starRating',
                                        'emoji',
                                    ].includes(
                                        steps.find((x) => x.id === step.id)
                                            ?.surveyElementType,
                                    ) ||
                                    /*
                                    TODO: tooltip
                                    multiple choice && min===max===1*/
                                    (steps.find((x) => x.id === step.id)
                                        ?.surveyElementType ===
                                        'multipleChoice' &&
                                        store.state.surveyElements.surveyElements.find(
                                            (element) =>
                                                element.id ===
                                                steps.find(
                                                    (x) => x.id === step.id,
                                                )?.surveyElementId,
                                        ).params.minSelectable === 1 &&
                                        store.state.surveyElements.surveyElements.find(
                                            (element) =>
                                                element.id ===
                                                steps.find(
                                                    (x) => x.id === step.id,
                                                )?.surveyElementId,
                                        ).params.maxSelectable === 1)
                                "
                                @click.prevent.stop="
                                    openResultBasedModal(step.id)
                                "
                            >
                                <span
                                    class="
                                        flex
                                        h-full
                                        justify-center
                                        items-center
                                    "
                                >
                                    <switch-horizontal-icon class="h-5 w-5" />
                                </span>
                            </button>
                            <!-- <button
                                class="flex-1 disabled:opacity-25"
                                :disabled="
                                    store.state.surveys.selectedSurveyStepId ===
                                    step.id
                                "
                                @click.prevent.stop="selectSurveyStep(step.id)"
                            >
                                <span
                                    class="
                                        flex
                                        h-full
                                        justify-center
                                        items-center
                                    "
                                >
                                    <PencilIcon class="h-5 w-5" />
                                </span>
                            </button> -->
                            <!-- <button
                                class="flex-1 disabled:opacity-25"
                                @click.prevent.stop="
                                    toggleSkippableStep(step.id)
                                "
                            > -->
                            <span
                                class="flex h-full justify-center items-center"
                            >
                                <FastForwardIcon
                                    class="h-5 w-5"
                                    :class="{
                                        'text-blue-800':
                                            store.state.surveys.survey.steps.find(
                                                (item) => item.id === step.id,
                                            )?.allowSkip,
                                    }"
                                />
                            </span>
                            <!-- </button> -->

                            <!-- :label="t('allow_skip')" -->
                            <div
                                class="flex-1 pointer"
                                :class="{
                                    'bg-blue-200': step.id === selectedOutput,
                                }"
                                @click.prevent.stop="selectOutput(step.id)"
                            >
                                <div
                                    class="
                                        flex
                                        h-full
                                        justify-center
                                        items-center
                                    "
                                >
                                    <ArrowRightIcon class="h-4 w-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <time-based-steps-modal
        v-if="timeBasedModalStepId > 0 && timeBasedModalIsOpen"
        v-model:is-open="timeBasedModalIsOpen"
    />
    <result-based-steps-modal
        v-if="resultBasedModalStepId > 0 && resultBasedModalIsOpen"
        v-model:is-open="resultBasedModalIsOpen"
    />
</template>

<script>
import { computed, onMounted, onUpdated, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import Connection from './Connection.vue'

import {
    ArrowLeftIcon,
    ArrowRightIcon,
    ClockIcon,
    PencilIcon,
    FastForwardIcon,
    SwitchHorizontalIcon,
} from '@heroicons/vue/outline'

import TimeBasedStepsModal from '../Surveys/TimeBasedStepsModal.vue'
import ResultBasedStepsModal from '../Surveys/resultBasedNextSteps/ResultBasedStepsModal.vue'
import ElementContent from './ElementContent.vue'

import SURVEYS from '../../services/surveyService'

export default {
    name: 'NodeEditorTest',
    components: {
        TimeBasedStepsModal,
        ResultBasedStepsModal,
        Connection,
        ClockIcon,
        ArrowLeftIcon,
        ArrowRightIcon,
        PencilIcon,
        FastForwardIcon,
        SwitchHorizontalIcon,
        ElementContent,
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
        const store = useStore()
        const { t } = useI18n()
        const draggedStep = ref(null)
        const connections = ref([])
        const stepElements = ref({})
        const surveyStepId = computed(() => store.state.surveys.surveyStepId)
        const defaultLanguage = computed(
            () => store.state.languages.defaultLanguage,
        )
        const width = 2000
        const height = 2000

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
                .forEach((step) => {
                    const index = props.adminLayout.findIndex(
                        (x) => x.id === step.id,
                    )

                    if (index < 0) {
                        adminLayoutInit.push({
                            id: step.id,
                            position: {
                                x: 100,
                                y: 100,
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
                if (step.timeBasedSteps) {
                    const type = step.surveyElementType
                    if (type === 'video') {
                        step.timeBasedSteps.forEach((timeBasedStep, index) => {
                            console.log(timeBasedStep)
                            connections.value.push({
                                id: `${step.id}_time_${index}`,
                                start: {
                                    id: step.id,
                                    outlet: `timeBasedStep_${index}`,
                                },
                                end: timeBasedStep.stepId,
                                // TODO: get time
                                label: `time: ${index}`,
                            })
                        })
                    }
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

            console.log(connections)
        }

        onMounted(() => {
            initAdminLayout()
            initConnections()
        })

        onUpdated(() => {})

        const selectedInput = ref(-1)
        const selectedOutput = ref(-1)

        const timeBasedModalIsOpen = ref(false)
        const timeBasedModalStepId = ref(-1)

        const resultBasedModalIsOpen = ref(false)
        const resultBasedModalStepId = ref(-1)

        watch(
            () => props.steps,
            () => {
                initAdminLayout()
                initConnections()
            },
        )

        const onMouseDown = (step, e) => {
            const nodeEditor = document.getElementById('nodeEditor')
            const nodeEditorRect = nodeEditor.getBoundingClientRect()
            draggedStep.value = step
            draggedStep.value.position = {
                x: e.clientX - nodeEditorRect.left,
                y: e.clientY - nodeEditorRect.top,
            }
            selectSurveyStep(step.id)
        }

        const selectSurveyStep = async (stepId) => {
            await deselectStep()
            // Todo: Function is called everytime the button is clicked, even if disabled. Needs to be fixed.
            await store.dispatch('surveys/setSurveyStepId', {
                surveyId: props.surveyId,
                surveyStepId: stepId,
            })
        }

        const onMouseMove = (e) => {
            if (draggedStep.value) {
                const nodeEditor = document.getElementById('nodeEditor')
                const nodeEditorRect = nodeEditor.getBoundingClientRect()
                draggedStep.value.position.x = e.clientX - nodeEditorRect.left
                draggedStep.value.position.y = e.clientY - nodeEditorRect.top
            }
        }

        const onMouseUp = async () => {
            draggedStep.value = null
            await SURVEYS.saveAdminLayout(props.surveyId, props.adminLayout)
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

        const linkNextStep = async (stepId, nextStepId) => {
            await store.dispatch('surveys/setNextStep', {
                surveyId: props.surveyId,
                stepId,
                nextStepId,
            })
            // TODO: only on success
            selectedInput.value = -1
            selectedOutput.value = -1
        }

        const unlinkNextStep = async (stepId) => {
            await store.dispatch('surveys/removeNextStep', {
                surveyId: props.surveyId,
                stepId,
            })
        }

        const getStepElementPosition = (id, anchor) => {
            const element = stepElements.value[id]
            let offsetX = 0
            let offsetY = 0
            switch (anchor) {
                case 'left': {
                    offsetX = -element?.getBoundingClientRect().width / 2 - 10
                    break
                }
                case 'right': {
                    offsetX = element?.getBoundingClientRect().width / 2 + 10
                    break
                }
                case 'top': {
                    offsetY = -element?.getBoundingClientRect().height / 2 - 10
                    break
                }
                case 'bottom': {
                    offsetY = element?.getBoundingClientRect().height / 2 + 10
                    break
                }
            }
            return {
                x: parseInt(element?.style.left, 10) + offsetX,
                y: parseInt(element?.style.top, 10) + offsetY,
            }
        }

        watch(
            () => timeBasedModalIsOpen.value,
            (value) => {
                value.log
            },
        )

        const openTimeBasedModal = async (stepId) => {
            await selectSurveyStep(stepId)
            timeBasedModalIsOpen.value = true
            timeBasedModalStepId.value = stepId
        }

        const openResultBasedModal = async (stepId) => {
            await selectSurveyStep(stepId)
            resultBasedModalIsOpen.value = true
            resultBasedModalStepId.value = stepId
        }

        const toggleSkippableStep = async (stepId) => {
            console.log('toggle skippable', stepId)
        }

        return {
            t,
            defaultLanguage,
            draggedStep,
            onMouseDown,
            onMouseMove,
            onMouseUp,
            deselectStep,
            openTimeBasedModal,
            timeBasedModalIsOpen,
            timeBasedModalStepId,
            openResultBasedModal,
            resultBasedModalIsOpen,
            resultBasedModalStepId,
            selectedOutput,
            selectedInput,
            selectInput,
            selectOutput,
            selectSurveyStep,
            store,
            unlinkNextStep,
            surveyStepId,
            width,
            height,
            connections,
            stepElements,
            getStepElementPosition,
            toggleSkippableStep,
        }
    },
}
</script>

<style scoped>
.node-editor-wrap {
    width: 100%;
    height: calc(100vh - 138px);
    overflow: scroll;
}

.node-editor {
    position: relative;
    /* width: 2000px;
height: 2000px; */
}

.step {
    width: 200px;
    height: 150px;
    position: absolute;
    transform: translateX(-50%) translateY(-50%);
}
</style>

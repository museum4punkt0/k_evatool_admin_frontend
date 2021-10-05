<template>
    <div>
        <div class="node-editor-wrap bg-blue-300 rounded-lg">
            <div
                id="nodeEditor"
                class="node-editor"
                :style="{ width: `${width}px`, height: `${height}px` }"
                @mousemove="onMouseMove"
                @mouseup="onMouseUp"
                @click="deselectStep"
                @mouseleave="onMouseUp"
            >
                <connection
                    v-for="connection in connections"
                    :key="`connection_${connection.start.id}_${connection.end}`"
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
                        w-48
                        h-24
                        overflow-hidden
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
                    <div class="w-full flex flex-row h-16">
                        <div class="inlets flex-none w-8">
                            <div
                                class="
                                    h-full
                                    text-xs
                                    flex
                                    justify-center
                                    items-center
                                "
                            ></div>
                        </div>
                        <div
                            class="node-content flex-auto"
                            @mousedown.prevent.stop="onMouseDown(step, $event)"
                        >
                            <div
                                class="
                                    pointer
                                    h-full
                                    flex
                                    items-center
                                    justify-center
                                "
                            >
                                <div class="text-center">
                                    {{
                                        steps?.find((x) => x?.id === step?.id)
                                            ?.name
                                    }}
                                    <p class="w-full text-xs text-gray-500">
                                        {{
                                            steps?.find((x) => x.id === step.id)
                                                ?.surveyElementType
                                        }}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="outlets flex-none w-8">
                            <div
                                class="
                                    h-full
                                    text-xs
                                    flex
                                    justify-center
                                    items-center
                                "
                                @click="unlinkNextStep(step.id)"
                            ></div>
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
                                    ![
                                        'multipleChoice',
                                        'binary',
                                        'starRating',
                                        'emoji',
                                    ].includes(
                                        steps.find((x) => x.id === step.id)
                                            ?.surveyElementType,
                                    )
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
                            </button>
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
import Connection from './Connection.vue'

import {
    ArrowLeftIcon,
    ArrowRightIcon,
    ClockIcon,
    PencilIcon,
    SwitchHorizontalIcon,
} from '@heroicons/vue/outline'

import TimeBasedStepsModal from '../Surveys/TimeBasedStepsModal.vue'
import ResultBasedStepsModal from '../Surveys/resultBasedNextSteps/ResultBasedStepsModal.vue'

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
        SwitchHorizontalIcon,
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
        const draggedStep = ref(null)
        const connections = ref([])
        const stepElements = ref({})
        const surveyStepId = computed(() => store.state.surveys.surveyStepId)
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
                        start: { id: step.id, outlet: 'next' },
                        end: step.nextStepId,
                    })
                }
                if (step.resultBasedNextSteps) {
                    const type = step.surveyElementType
                    // if (Array.isArray(step.resultBasedNextSteps)) {
                    //     step.resultBasedNextSteps.forEach((nextStep) => {
                    //         connections.value.push({
                    //             start: {
                    //                 id: step.id,
                    //                 outlet: 'resultBasedNext',
                    //             },
                    //             end: nextStep.stepId,
                    //         })
                    //     })
                    // }
                    if (type === 'binary') {
                        connections.value.push({
                            start: {
                                id: step.id,
                                outlet: 'resultBasedNext_true',
                            },
                            end: step.resultBasedNextSteps.trueNextStep.stepId,
                        })
                        connections.value.push({
                            start: {
                                id: step.id,
                                outlet: 'resultBasedNext_true',
                            },
                            end: step.resultBasedNextSteps.falseNextStep.stepId,
                        })
                    } else if (type === 'starRating') {
                        step.resultBasedNextSteps.forEach((nextStep) => {
                            connections.value.push({
                                start: {
                                    id: step.id,
                                    outlet: `resultBasedNext_${step.start}-${step.end}`,
                                },
                                end: nextStep.stepId,
                            })
                        })
                    } else if (type === 'multipleChoice') {
                        step.resultBasedNextSteps.forEach((nextStep) => {
                            connections.value.push({
                                start: {
                                    id: step.id,
                                    outlet: `resultBasedNext_${step.value}`,
                                },
                                end: nextStep.stepId,
                            })
                        })
                    } else if (type === 'emoji') {
                        // TODO: add emoji result based next steps
                        console.log(step.resultBasedNextSteps)
                        // step.resultBasedNextSteps.forEach((nextStep) => {
                        //     connections.value.push({
                        //         start: {
                        //             id: step.id,
                        //             outlet: `resultBasedNext_${step.value}`,
                        //         },
                        //         end: nextStep.stepId,
                        //     })
                        // })
                    }
                }
            })
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
            selectedOutput.value = stepId
            if (selectedInput.value > 0) {
                await linkNextStep(selectedOutput.value, selectedInput.value)
                emit('updated')
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

        return {
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
    height: 100px;
    position: absolute;
    transform: translateX(-50%) translateY(-50%);
}
</style>

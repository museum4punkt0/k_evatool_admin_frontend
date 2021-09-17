<template>
    <div>
        <!--        <ul>
        <button
            v-if="selectedMode !== MODES.ADD"
            class="primary"
            @click="setSelectedMode(MODES.ADD)"
        >
            test add mode
        </button>
        <button
            v-if="selectedMode !== MODES.DELETE"
            class="primary"
            @click="setSelectedMode(MODES.DELETE)"
        >
            test delete
        </button>
        <li v-if="selectedMode === MODES.DELETE">
            click outlet to remove connection
        </li>
        <li v-if="selectedMode === MODES.ADD">
            click outlet and then inlet to add a connection
        </li>
    </ul>-->
        <div class="node-editor-wrap bg-blue-300 rounded-lg">
            <div
                id="nodeEditor"
                class="node-editor"
                :style="{ width: `${width}px`, height: `${height}px` }"
                @mousemove="onMouseMove"
                @mouseup="onMouseUp"
                @mousedown="deselectStep"
                @mouseleave="onMouseUp"
            >
                <div
                    v-for="step in adminLayout"
                    :key="step.id"
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
                        'shadow-lg':
                            draggedStep?.id === step.id &&
                            selectedStepId !== step.id,
                        'node-selected': selectedStepId === step.id,
                        'border-1': draggedStep,
                    }"
                >
                    <div class="w-full flex flex-row h-16">
                        <div class="inlets flex-none w-8">
                            <div
                                :ref="
                                    (el) =>
                                        (inletElements[`${step.id}_inlet`] = el)
                                "
                                @mousedown.prevent.stop="
                                    onInletClicked({ stepId: step.id })
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
                                        steps.find((x) => x.id === step.id).name
                                    }}
                                    <p class="w-full text-xs text-gray-500">
                                        {{
                                            steps.find((x) => x.id === step.id)
                                                .surveyElementType
                                        }}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="outlets flex-none w-8">
                            <div
                                :ref="
                                    (el) =>
                                        (outletElements[
                                            `${step.id}_outlet_next`
                                        ] = el)
                                "
                                class="bg-yellow-300"
                                @mousedown.prevent.stop="
                                    onOutletClicked({
                                        stepId: step.id,
                                        name: 'next',
                                    })
                                "
                            >
                                <!--                                {{
                    steps.find((x) => x.id === step.id)
                        .nextStepId
                }}-->
                            </div>
                        </div>
                    </div>
                    <div class="w-full border-t">
                        <div class="flex flex-row h-9">
                            <div
                                class="flex-1 w-8 pointer"
                                :class="{
                                    'bg-blue-200': step.id === selectedInput,
                                }"
                                @click="selectInput(step.id)"
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
                                        .surveyElementType !== 'video'
                                "
                                @click="openTimeBasedModal(step.id)"
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
                                @click="selectOutput(step.id)"
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
        v-if="timeBasedModalStepId > 0"
        v-model:is-open="timeBasedModalIsOpen"
        :survey-step-id="timeBasedModalStepId"
    />
</template>

<script>
import { ref, computed, onUpdated, onMounted } from 'vue'
import { useStore } from 'vuex'
import Connection from './Connection.vue'
import { useState } from '../../composables/state'

import {
    ClockIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
    PencilIcon,
} from '@heroicons/vue/outline'

import TimeBasedStepsModal from '../Surveys/TimeBasedStepsModal.vue'

import SURVEYS from '../../services/surveys'

const MODES = {
    NONE: 'NONE',
    ADD: 'ADD',
    DELETE: 'DELETE',
}

export default {
    name: 'NodeEditorTest',
    components: {
        TimeBasedStepsModal,
        Connection,
        ClockIcon,
        ArrowLeftIcon,
        ArrowRightIcon,
        PencilIcon,
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
    setup(props) {
        const store = useStore()
        const draggedStep = ref(null)
        const selectedStepId = computed(
            () => store.state.surveys.selectedSurveyStepId,
        )

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
            console.log('init admin layout')
            const adminLayoutInit = []

            props.steps.forEach((step) => {
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
                    stepFound.position = fixLayoutPosition(stepFound.position)
                    adminLayoutInit.push(stepFound)
                }
            })
            store.dispatch(
                'surveys/updateAdminLayoutOfSelectedSurvey',
                adminLayoutInit,
            )
        }

        onMounted(() => {
            initAdminLayout()
        })

        onUpdated(() => {})

        const selectedInput = ref(-1)
        const selectedOutput = ref(-1)

        const [selectedMode, setSelectedMode] = useState(MODES.ADD)
        const [selectedInlet, setSelectedInlet] = useState(null)
        const [selectedOutlet, setSelectedOutlet] = useState(null)
        const inletElements = ref({})
        const outletElements = ref({})
        const [connections, setConnections] = useState([])
        const [width] = useState(2000)
        const [height] = useState(2000)
        const timeBasedModalIsOpen = ref(false)
        const timeBasedModalStepId = ref(-1)

        const c = []
        props.steps.forEach((step) => {
            if (step.nextStepId) {
                c.push({
                    outletElement: `${step.id}_outlet_next`,
                    inletElement: `${step.nextStepId}_inlet`,
                })
            }
        })
        setConnections(c)

        const onMouseDown = (step, e) => {
            const nodeEditor = document.getElementById('nodeEditor')
            const nodeEditorRect = nodeEditor.getBoundingClientRect()
            draggedStep.value = step
            draggedStep.value.position = {
                x: e.clientX - nodeEditorRect.left,
                y: e.clientY - nodeEditorRect.top,
            }
        }

        const selectSurveyStep = (stepId) => {
            // Todo: Function is called everytime the button is clicked, even if disabled. Needs to be fixed.
            store.dispatch('surveys/setSurveyStepId', stepId)
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

        const addConnection = (outlet, inlet) => {
            store
                .dispatch('surveys/updateOneSurveyStepAndAddToSelected', {
                    data: {
                        ...props.steps.find(
                            (step) => step.id === outlet.stepId,
                        ),
                        nextStepId: inlet.stepId,
                    },
                })
                .then((data) => {
                    console.log('added connection', data)
                    setSelectedInlet(null)
                    setSelectedOutlet(null)
                    setSelectedMode(MODES.NONE)
                })
        }

        const onInletClicked = (inlet) => {
            console.log('inlet clicked', inlet)
            switch (selectedMode.value) {
                case MODES.ADD: {
                    setSelectedInlet(inlet)
                    if (selectedOutlet.value) {
                        addConnection(selectedOutlet.value, inlet)
                    }
                }
            }
        }
        const onOutletClicked = (outlet) => {
            console.log('outlet clicked', outlet)
            switch (selectedMode.value) {
                case MODES.ADD: {
                    setSelectedOutlet(outlet)
                    if (selectedInlet.value) {
                        addConnection(outlet, selectedInlet.value)
                    }
                    break
                }
                case MODES.DELETE: {
                    if (outlet.name === 'next') {
                        store.dispatch(
                            'surveys/updateOneSurveyStepAndAddToSelected',
                            {
                                data: {
                                    ...props.steps.find(
                                        (step) => step.id === outlet.stepId,
                                    ),
                                    nextStepId: null,
                                },
                            },
                        )
                        break
                    }
                }
            }
        }
        const deselectStep = () => {
            store.dispatch('surveys/setSurveyStepId', -1)
        }

        const selectInput = (stepId) => {
            selectedInput.value = stepId
        }

        const selectOutput = (stepId) => {
            selectedOutput.value = stepId
        }

        const getInletPosition = (inletElement) => {
            const element = inletElements.value[inletElement]
            const rect = element?.getBoundingClientRect()
            const offsetX = element?.offsetLeft - rect?.width / 2
            const offsetY = element?.offsetTop - rect?.height

            return {
                x: rect?.left - offsetX,
                y: rect?.top - offsetY,
            }
        }
        const getOutletPosition = (outletElement) => {
            const element = outletElements.value[outletElement]
            const rect = element?.getBoundingClientRect()
            const offsetX = element?.offsetLeft - rect?.width / 2
            const offsetY = element?.offsetTop - rect?.height

            return {
                x: rect?.right - offsetX,
                y: rect?.top - offsetY,
            }
        }

        const openTimeBasedModal = (stepId) => {
            timeBasedModalIsOpen.value = true
            timeBasedModalStepId.value = stepId
        }

        return {
            MODES,
            selectedMode,
            setSelectedMode,
            draggedStep,
            selectedStepId,
            selectedInlet,
            selectedOutlet,
            onMouseDown,
            onMouseMove,
            onMouseUp,
            onInletClicked,
            onOutletClicked,
            deselectStep,
            connections,
            inletElements,
            outletElements,
            getInletPosition,
            getOutletPosition,
            width,
            height,
            openTimeBasedModal,
            timeBasedModalIsOpen,
            timeBasedModalStepId,
            selectedOutput,
            selectedInput,
            selectInput,
            selectOutput,
            selectSurveyStep,
            store,
        }
    },
}
</script>

<style scoped>
.node-editor-wrap {
    width: 100%;
    height: calc(100vh - 150px);
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

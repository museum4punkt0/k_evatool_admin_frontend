<template>
    <div>
        <ul>
            <li v-if="draggedStep">draggedStep: {{ draggedStep?.id }}</li>
            <li v-if="selectedStepId !== -1">
                selectedStepId: {{ selectedStepId }}
            </li>
            <li v-if="selectedMode === MODES.DELETE">
                click outlet to remove connection
            </li>
            <li v-if="selectedMode === MODES.ADD">
                click outlet and then inlet to add a connection
            </li>
        </ul>
        <div class="node-editor-wrap bg-blue-300">
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
                        p-2
                        rounded-lg
                        border
                        bg-white
                        flex flex-row
                        justify-center
                        items-center
                        shadow
                    "
                    :style="{
                        top: step?.position.y + 'px',
                        left: step?.position.x + 'px',
                        zIndex: draggedStep?.id === step?.id ? 3 : 2,
                    }"
                    :class="{
                        'border-black':
                            draggedStep?.id === step.id &&
                            selectedStepId !== step.id,
                        'border-blue-900': selectedStepId === step.id,
                        'border-1': draggedStep,
                    }"
                    @mousedown.prevent.stop="onMouseDown(step, $event)"
                >
                    <div class="inlets bg-green-200 flex flow-col">
                        <div
                            :ref="
                                (el) => (inletElements[`${step.id}_inlet`] = el)
                            "
                            class="bg-yellow-200"
                            @mousedown.prevent.stop="
                                onInletClicked({ stepId: step.id })
                            "
                        >
                            in
                        </div>
                    </div>
                    <div class="node-content flex-1">
                        {{ steps.find((x) => x.id === step.id).name }}
                        {{ step.id }}
                    </div>
                    <div class="outlets bg-green-200">
                        <div
                            :ref="
                                (el) =>
                                    (outletElements[`${step.id}_outlet_next`] =
                                        el)
                            "
                            class="bg-yellow-200"
                            @mousedown.prevent.stop="
                                onOutletClicked({
                                    stepId: step.id,
                                    name: 'next',
                                })
                            "
                        >
                            next:
                            {{ steps.find((x) => x.id === step.id).nextStepId }}
                        </div>
                    </div>
                </div>
                <Connection
                    v-for="connection in connections"
                    :key="`${connection.outletElement}_${connection.inletElement}`"
                    :width="width"
                    :height="height"
                    :start="{
                        x: outletElements[
                            connection.outletElement
                        ]?.getBoundingClientRect().left,
                        y: outletElements[
                            connection.outletElement
                        ]?.getBoundingClientRect().top,
                    }"
                    :end="{
                        x: inletElements[
                            connection.inletElement
                        ]?.getBoundingClientRect().left,
                        y: inletElements[
                            connection.inletElement
                        ]?.getBoundingClientRect().top,
                    }"
                />
                <!-- <div v-for="(connection, index) in connections" :key="index">
                out:
                {{
                    outletElements[
                        connection.outletElement
                    ].getBoundingClientRect().left
                }}
                - in:
                {{
                    inletElements[
                        connection.inletElement
                    ].getBoundingClientRect().left
                }}
            </div> -->
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onUpdated } from 'vue'
import { useStore } from 'vuex'
import Connection from './Connection.vue'
import { useState } from '../../composables/state'

import SURVEYS from '../../services/surveys'

const MODES = {
    NONE: 'NONE',
    ADD: 'ADD',
    DELETE: 'DELETE',
}
export default {
    name: 'NodeEditorTest',
    components: {
        Connection,
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
        if (!props.adminLayout) {
            console.log('updating admin layout')
            store.dispatch(
                'surveys/updateAdminLayoutOfSelectedSurvey',
                props.steps.map((step, index) => {
                    return {
                        id: step.id,
                        position: {
                            x: 100 + index * 240,
                            y: 100,
                        },
                    }
                }),
            )
        }

        onUpdated(() => {
            console.log('component updated')
            // console.log(inletElements.value)
        })

        const [selectedMode, setSelectedMode] = useState(MODES.ADD)
        const [selectedInlet, setSelectedInlet] = useState(null)
        const [selectedOutlet, setSelectedOutlet] = useState(null)
        const inletElements = ref({})
        const outletElements = ref({})
        const [connections, setConnections] = useState([])
        const [width, setWidth] = useState(2000)
        const [height, setHeight] = useState(2000)

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
            store.dispatch('surveys/setSurveyStepId', step.id)
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

        return {
            MODES,
            selectedMode,
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
            width,
            height,
        }
    },
}
</script>

<style scoped>
.node-editor-wrap {
    width: 100%;
    height: 100%;
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

<template>
    <div class="node-editor-wrap bg-blue-300">
        <div
            id="nodeEditor"
            class="node-editor"
            @mousemove="onMouseMove"
            @mouseup="onMouseUp"
            @mouseleave="onMouseUp"
        >
            {{ selectedStep?.id }}
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
                }"
                @mousedown="onMouseDown(step, $event)"
            >
                <div class="inlets bg-green-200 flex flow-col">
                    <div
                        class="bg-yellow-200"
                        @click="onInletClicked({ stepId: step.id })"
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
                        class="bg-yellow-200"
                        @click="onOutletClicked({ stepId: step.id })"
                    >
                        next:
                        {{ steps.find((x) => x.id === step.id).nextStepId }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useState } from '../../composables/state'

const MODES = {
    NONE: 'NONE',
    ADD: 'ADD',
    DELETE: 'DELETE',
}

export default {
    name: 'NodeEditorTest',
    props: {
        steps: {
            type: Array,
            default: () => [],
        },
    },
    setup(props) {
        const selectedStep = ref(null)
        const adminLayout = ref(
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
        const store = useStore()
        const [mode, setMode] = useState(MODES.NONE)
        const [selectedInlet, setSelectedInlet] = useState(null)
        const [selectedOutlet, setSelectedOutlet] = useState(null)

        const onMouseDown = (step, e) => {
            console.log('onmousedown', step, e)
            const nodeEditor = document.getElementById('nodeEditor')
            const nodeEditorRect = nodeEditor.getBoundingClientRect()
            selectedStep.value = step
            step.value.position = {
                x: e.clientX - nodeEditorRect.left,
                y: e.clientY - nodeEditorRect.top,
            }
        }

        const onMouseMove = (e) => {
            if (!selectedStep.value) return
            const nodeEditor = document.getElementById('nodeEditor')
            const nodeEditorRect = nodeEditor.getBoundingClientRect()

            selectedStep.value.position = {
                x: e.clientX - nodeEditorRect.left,
                y: e.clientY - nodeEditorRect.top,
            }
        }

        const onMouseUp = () => {
            selectedStep.value = null
        }

        const onInletClicked = (inlet) => {
            console.log('inlet clicked', inlet)
            switch (mode.value) {
                case MODES.ADD: {
                    setSelectedInlet(inlet)
                    if (selectedOutlet.value) {
                        // store.dispatch(
                        //     'surveys/updateOneSurveyStepAndAddToSelected',
                        //     {
                        //         data: {
                        //             ...selectedOutlet.value.node,
                        //             nextStepId:
                        //                 selectedInlet.value.node.id,
                        //         },
                        //     },
                        // )
                        setSelectedInlet(null)
                        setSelectedOutlet(null)
                        setMode(MODES.NONE)
                    }
                }
            }
        }
        const onOutletClicked = (outlet) => {
            console.log('outlet clicked', outlet)
            switch (mode.value) {
                case MODES.ADD: {
                    setSelectedOutlet(outlet)
                    if (selectedInlet.value) {
                        console.log(
                            'TODO: update connection',
                            selectedInlet,
                            selectedOutlet,
                        )
                        setSelectedInlet(null)
                        setSelectedOutlet(null)
                        setMode(MODES.NONE)
                    }
                    break
                }
                case MODES.DELETE: {
                    console.log('TODO: remove connection')
                    // if (outlet.name === 'next') {
                    // store.dispatch(
                    //     'surveys/updateOneSurveyStepAndAddToSelected',
                    //     { data: { ...node, nextStepId: null } },
                    // )
                    setMode(MODES.NONE)
                    break
                    // }
                }
            }
        }

        return {
            selectedStep,
            selectedInlet,
            selectedOutlet,
            onMouseDown,
            onMouseMove,
            onMouseUp,
            adminLayout,
            onInletClicked,
            onOutletClicked,
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
    width: 2000px;
    height: 2000px;
}
.step {
    width: 200px;
    height: 100px;
    position: absolute;
    transform: translateX(-50%) translateY(-50%);
}
</style>

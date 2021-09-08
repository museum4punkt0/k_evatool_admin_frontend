<template>
    <div class="node-editor-wrap bg-blue-300">
        <div
            id="nodeEditor"
            class="node-editor"
            @mousemove="onMouseMove"
            @mouseup="onMouseUp"
            @mouseleave="onMouseUp"
        >
            <div
                v-for="step in adminLayout"
                :key="step.id"
                class="
                    step
                    p-10
                    rounded-lg
                    border
                    inline
                    bg-white
                    flex
                    justify-center
                    items-center
                    shadow
                "
                :style="{
                    top: step?.position.y + 'px',
                    left: step?.position.x + 'px',
                }"
                @mousedown="selectStep(step)"
            >
                {{ steps.find((x) => x.id === step.id).name }}
                {{ step.id }}
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue'

import SURVEYS from '../../services/surveys'

export default {
    name: 'NodeEditorTest',
    props: {
        steps: {
            type: Array,
            default: () => [],
        },
        surveyId: {
            type: Number,
            default: -1,
        },
    },
    setup(props) {
        const selectedStep = ref(null)
        const adminLayout = ref(
            props.steps.map((step) => {
                return {
                    id: step.id,
                    position: {
                        x: 200,
                        y: 100,
                    },
                }
            }),
        )

        const selectStep = (step) => {
            selectedStep.value = step
            if (!selectedStep.value.position) {
                selectedStep.value.position = {
                    x: 10,
                    y: 10,
                }
            }
        }

        const onMouseMove = (e) => {
            if (selectedStep.value) {
                const nodeEditor = document.getElementById('nodeEditor')
                const nodeEditorRect = nodeEditor.getBoundingClientRect()
                selectedStep.value.position.x = e.clientX - nodeEditorRect.left
                selectedStep.value.position.y = e.clientY - nodeEditorRect.top
            }
        }

        const onMouseUp = async () => {
            selectedStep.value = null
            const adminLayoutSaved = await SURVEYS.saveAdminLayout(
                props.surveyId,
                adminLayout.value,
            )
            console.log(adminLayoutSaved)
        }

        return {
            selectStep,
            selectedStep,
            onMouseMove,
            onMouseUp,
            adminLayout,
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

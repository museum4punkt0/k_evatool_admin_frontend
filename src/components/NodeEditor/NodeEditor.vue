<template>
    <div>
        <ul>
            <li>mode: {{ mode }}</li>
            <li>
                <Button @click="serializeLayout">test serialize layout</Button>
            </li>
            <li>
                <Button
                    @click="
                        () => {
                            setMode(mode === MODES.ADD ? MODES.NONE : MODES.ADD)
                        }
                    "
                >
                    add mode
                </Button>
                <span v-if="mode === MODES.ADD">click outlet and inlet</span>
            </li>
            <li>
                <Button
                    @click="
                        () => {
                            setMode(
                                mode === MODES.DELETE
                                    ? MODES.NONE
                                    : MODES.DELETE,
                            )
                        }
                    "
                >
                    delete mode
                </Button>
                <span v-if="mode === MODES.DELETE">click outlet</span>
            </li>
        </ul>
        <div
            class="node-editor relative overflow-scroll bg-green-300"
            :style="{
                width: `${canvasWidth}px`,
                height: `${canvasHeight}px`,
            }"
            @scroll="updateConnections"
            @click="resetSelectedSurveyStepId"
            @mouseup.prevent.stop="handlers.onMouseUp"
            @mousemove="handlers.onMouseMove"
            @onmouseleave="handlers.onMouseLeave"
        >
            <Node
                v-for="node in nodes"
                :id="'evtool_node_' + node.id"
                :ref="(el) => (nodeRefs[node.id] = el)"
                :key="'draggable_node' + node.id"
                :data="node"
                :inlets="getInletsForNode(node)"
                :outlets="getOutletsForNode(node)"
                :on-move="updateConnections"
                :selected="node.id === selectedNode?.id"
                :position="positions[node.id]"
                @click.prevent.stop="handlers.onNodeSelected(node, $event)"
                @mousedown.prevent.stop="handlers.onMouseDown(node, $event)"
                @drag.prevent.stop="handlers.onNodeDragged(node)"
                @inletClicked="handlers.onInletClicked"
                @outletClicked="handlers.onOutletClicked"
            />
        </div>
    </div>
</template>

<script>
import { ref, onUpdated, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import LeaderLine from 'vue3-leaderline'
import styled from 'vue3-styled-components'
import Node from './Node.vue'
import Button from '../Common/Button'
import { useState } from '../../composables/state'
// import { useReducer } from '../../composables/reducer'
const Container = styled.div`
    position: relative;
    overflow: scroll;
    background-color: CadetBlue;
`

const inletIdCreator = (nodeId, key) => {
    return `evtool_node_${nodeId}_inlet${key ? '_' + key : ''}`
}
const outletIdCreator = (nodeId, key) => {
    return `evtool_node_${nodeId}_outlet_${key}`
}

const MODES = {
    NONE: 'NONE',
    ADD: 'ADD',
    DELETE: 'DELETE',
}

let currentMousePosition
let currentElement

export default {
    name: 'NodeEditor',
    components: {
        Button,
        Container,
        Node,
    },
    props: {
        nodes: {
            type: Array,
            required: true,
        },
    },
    setup(props) {
        const nodeRefs = ref([])
        const connections = ref([])
        const connectionElements = ref([])
        const highlightInlets = ref(false)
        const highlightOutlets = ref(false)
        const [mode, setMode] = useState(null)
        const [mouseDown, setMouseDown] = useState(false)
        const [selectedInlet, setSelectedInlet] = useState(null)
        const [selectedOutlet, setSelectedOutlet] = useState(null)
        const [selectedNode, setSelectedNode] = useState(null)
        const [positions, setPositions] = useState({})
        const [canvasWidth, setCanvasWidth] = useState(2000)
        const [canvasHeight, setCanvasHeight] = useState(1000)
        const store = useStore()

        const createInitialPositions = () => {
            // TODO: get from admin layout
            const p = {}
            props.nodes.forEach((node, index) => {
                p[node.id] = { x: (1 + index) * 400, y: 0 }
            })
            console.log(p)
            setPositions(p)
        }
        const createConnections = () => {
            clearConnections()
            props.nodes.forEach((node) => {
                if (node.nextStepId) {
                    connections.value.push({
                        from: `evtool_node_${node.id}_outlet_next`,
                        to: `evtool_node_${node.nextStepId}_inlet`,
                    })
                }
            })
            connections.value.forEach((connection) => {
                const start = document.getElementById(connection.from)
                const end = document.getElementById(connection.to)
                if (start && end) {
                    const line = new LeaderLine(start, end, {
                        color: 'darkblue',
                        size: 4,
                    })
                    connectionElements.value.push(line)
                } else {
                    console.error('could not create connection')
                }
            })
        }
        const clearConnections = () => {
            connections.value = []
            connectionElements.value.forEach((connectionElement) => {
                connectionElement.remove()
            })
            connectionElements.value = []
        }

        const updateConnections = () => {
            console.log('update connections')
            connectionElements.value.forEach((connectionElement) => {
                // connectionElement.position()
            })
        }

        const serializeLayout = () => {
            nodeRefs.value.forEach((node) => {
                console.log('node', node.$el, node.$el.clientWidth)
            })
        }

        onUpdated(() => {
            // createConnections()
        })
        onMounted(() => {
            createInitialPositions()
            createConnections()
            document.addEventListener('scroll', updateConnections)
        })
        onBeforeUnmount(() => {
            clearConnections()
            document.removeEventListener('scroll', updateConnections)
        })

        const setSelectedSurveyStepId = (surveyStepId) => {
            store.dispatch('surveys/setSurveyStepId', surveyStepId)
        }

        const resetSelectedSurveyStepId = () => {
            store.dispatch('surveys/setSurveyStepId', -1)
        }

        return {
            positions,
            canvasWidth,
            canvasHeight,
            connections,
            highlightInlets,
            highlightOutlets,
            mode,
            setMode,
            MODES,
            selectedNode,
            setSelectedNode,
            mouseDown,
            getInletsForNode: (node) => [
                {
                    key: inletIdCreator(node.id),
                    name: 'in',
                },
            ],
            getOutletsForNode: (node) => {
                const outlets = [
                    {
                        key: outletIdCreator(node.id, 'next'),
                        name: 'next',
                        value: node.nextStepId,
                    },
                    {
                        key: outletIdCreator(node.id, 'dummy'),
                        name: 'dummy',
                        value: '',
                    },
                ]
                return outlets
            },
            nodeRefs,
            connectionElements,
            createConnections,
            updateConnections,
            clearConnections,
            serializeLayout,
            setSelectedSurveyStepId,
            resetSelectedSurveyStepId,
            handlers: {
                onMouseDown: (node, event) => {
                    currentMousePosition = {
                        x: event.clientX,
                        y: event.clientY,
                    }
                    currentElement = event.target
                    console.log(currentMousePosition.x)
                    setMouseDown(true)
                    setSelectedNode(node)
                },
                onMouseUp: () => {
                    setMouseDown(false)
                },
                onMouseMove: (event) => {
                    if (!selectedNode?.value) {
                        return
                    }
                    if (!mouseDown.value) {
                        return
                    }
                    const dx = event.clientX - currentMousePosition.x
                    const dy = event.clientY - currentMousePosition.y

                    const newPositionOfSelectedNode = {
                        x: currentElement.offsetLeft + dx,
                        y: currentElement.offsetTop + dy,
                    }
                    currentMousePosition = {
                        x: event.clientX,
                        y: event.clientY,
                    }
                    console.log(
                        currentElement.offsetLeft,
                        currentMousePosition.x,
                    )

                    const newPositions = {}
                    for (var i in positions) {
                        newPositions[i] = positions.value[i]
                    }
                    newPositions[selectedNode.value.id] =
                        newPositionOfSelectedNode
                    // console.log('TODO: calculate correct position', position.x)
                    setPositions(newPositions)
                },
                onMouseLeave: () => {
                    setMouseDown(false)
                },
                onNodeSelected: (node) => {
                    setSelectedNode(node)
                    console.log('TODO: select survey step in store')
                },
                onNodeDeSelected: () => {
                    console.log('reset')
                    setSelectedNode(null)
                    setMouseDown(false)
                },

                onInletClicked: ({ node, inlet }) => {
                    switch (mode.value) {
                        case MODES.ADD: {
                            setSelectedInlet({ node, inlet })
                            if (selectedOutlet.value) {
                                store.dispatch(
                                    'surveys/updateOneSurveyStepAndAddToSelected',
                                    {
                                        data: {
                                            ...selectedOutlet.value.node,
                                            nextStepId:
                                                selectedInlet.value.node.id,
                                        },
                                    },
                                )
                                setSelectedInlet(null)
                                setSelectedOutlet(null)
                                setMode(MODES.NONE)
                            }
                        }
                    }
                },
                onOutletClicked: ({ node, outlet }) => {
                    switch (mode.value) {
                        case MODES.ADD: {
                            setSelectedOutlet({ node, outlet })
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
                            if (outlet.name === 'next') {
                                store.dispatch(
                                    'surveys/updateOneSurveyStepAndAddToSelected',
                                    { data: { ...node, nextStepId: null } },
                                )
                                setMode(MODES.NONE)
                                break
                            }
                        }
                    }
                },
            },
        }
    },
}
</script>

<style></style>

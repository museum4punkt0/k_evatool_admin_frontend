<template>
    <Container @scroll="updateConnections">
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
        <Node
            v-for="node in nodes"
            :id="'evtool_node_' + node.id"
            :ref="(el) => (nodeRefs[node.id] = el)"
            :key="'draggable_node' + node.id"
            :data="node"
            :inlets="getInletsForNode(node)"
            :outlets="getOutletsForNode(node)"
            :on-move="updateConnections"
            @inletClicked="handlers.onInletClicked"
            @outletClicked="handlers.onOutletClicked"
        />
    </Container>
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
        const [selectedInlet, setSelectedInlet] = useState(null)
        const [selectedOutlet, setSelectedOutlet] = useState(null)
        const store = useStore()

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
            connectionElements.value.forEach((connectionElement) => {
                connectionElement.position()
            })
        }

        const serializeLayout = () => {
            nodeRefs.value.forEach((node) => {
                console.log('node', node.$el, node.$el.clientWidth)
            })
        }

        onUpdated(() => {
            createConnections()
        })
        onMounted(() => {
            createConnections()
            document.addEventListener('scroll', updateConnections)
        })
        onBeforeUnmount(() => {
            clearConnections()
            document.removeEventListener('scroll', updateConnections)
        })

        return {
            connections,
            highlightInlets,
            highlightOutlets,
            mode,
            setMode,
            MODES,
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
            handlers: {
                onInletClicked: ({ node, inlet }) => {
                    switch (mode.value) {
                        case MODES.ADD: {
                            setSelectedInlet({ node, inlet })
                            if (selectedOutlet.value) {
                                // console.log(
                                //     'TODO: update connection',
                                //     selectedInlet,
                                //     selectedOutlet,
                                // )
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
    methods: {
        nodeOutletClick(node) {
            console.log(node)
        },
    },
}
</script>

<style></style>

<template>
    <Container @scroll="updateConnections">
        <ul>
            <li>
                <Button @click="serializeLayout">test serialize layout</Button>
            </li>
            <li>
                <Button
                    @click="
                        () => {
                            setAddConnection(!addConnectionMode)
                        }
                    "
                >
                    add mode
                </Button>
                <span v-if="addConnectionMode">click outlet and inlet</span>
            </li>
            <li>
                <Button
                    @click="
                        () => {
                            setDeleteConnection(!deleteConnectionMode)
                        }
                    "
                >
                    delete mode
                </Button>
                <span v-if="deleteConnectionMode">click outlet</span>
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
        const [addConnectionMode, setAddConnection] = useState(false)
        const [deleteConnectionMode, setDeleteConnection] = useState(false)
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
            addConnectionMode,
            setAddConnection,
            deleteConnectionMode,
            setDeleteConnection,
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
                    console.log('inlet clicked', node, inlet)
                    if (addConnectionMode.value) {
                        setSelectedInlet({ node, inlet })
                        if (selectedOutlet.value) {
                            console.log(
                                'TODO: update connection',
                                selectedInlet,
                                selectedOutlet,
                            )
                            setSelectedInlet(null)
                            setSelectedOutlet(null)
                            setAddConnection(false)
                        }
                    }
                },
                onOutletClicked: ({ node, outlet }) => {
                    if (addConnectionMode.value) {
                        setSelectedOutlet({ node, outlet })
                        if (selectedInlet.value) {
                            console.log(
                                'TODO: update connection',
                                selectedInlet,
                                selectedOutlet,
                            )
                            setSelectedInlet(null)
                            setSelectedOutlet(null)
                            setAddConnection(false)
                        }
                    } else if (
                        deleteConnectionMode.value &&
                        outlet.name === 'next'
                    ) {
                        store.dispatch(
                            'surveys/updateOneSurveyStepAndAddToSelected',
                            { ...node, nextStepId: null },
                        )
                        setDeleteConnection(false)
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

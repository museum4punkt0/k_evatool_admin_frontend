<template>
    <Container @scroll="updateConnections">
        <button @click="createConnections">test draw connection</button>
        <button @click="updateConnections">test update connection</button>
        <button @click="serializeLayout">layout</button>
        <Node
            v-for="node in nodes"
            :id="'evtool_node_' + node.id"
            :ref="(el) => (nodeRefs[node.id] = el)"
            :key="'draggable_node' + node.id"
            :data="node"
            :inlets="getInletsForNode(node)"
            :outlets="getOutletsForNode(node)"
            :on-move="updateConnections"
            @nodeOutletClick="nodeOutletClick(node)"
        />
    </Container>
</template>

<script>
import {
    ref,
    watch,
    onBeforeUpdate,
    onUpdated,
    onMounted,
    onUnmounted,
} from 'vue'
import styled from 'vue3-styled-components'
import Node from './Node.vue'
import LeaderLine from 'vue3-leaderline'
const Container = styled.div`
    overflow: scroll;
    background-color: CadetBlue;
`

export default {
    name: 'NodeEditor',
    components: {
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
        let connectionElements = ref([])
        const highlightInlets = ref(false)
        const highlightOutlets = ref(false)

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
            console.log('connections', connections.value)
            connections.value.forEach((connection) => {
                console.log('creating connection', connection)
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
            console.log('clearing connections')
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
            console.log('serialize', nodeRefs)

            // nodeRefs.value.forEach((node) => {
            // console.log('node', node.$el.clientWidth)
            // })
        }

        watch(
            () => props.nodes,
            (newNodes) => {
                console.log('nodes changed', newNodes)
                createConnections()
            },
        )
        onBeforeUpdate(() => {
            // nodeRefs = []
        })
        onUpdated(() => {
            console.log('updated', nodeRefs)
        })
        onMounted(() => {
            createConnections()
            document.addEventListener('scroll', updateConnections)
        })
        onUnmounted(() => {
            clearConnections()
            document.removeEventListener('scroll', updateConnections)
        })

        return {
            connections,
            highlightInlets,
            highlightOutlets,
            getInletsForNode: (node) => [
                {
                    key: `evtool_node_${node.id}_inlet`,
                    name: 'in',
                },
            ],
            getOutletsForNode: (node) => {
                const outlets = [
                    {
                        key: `evtool_node_${node.id}_outlet_next`,
                        name: 'next',
                        value: node.nextStepId,
                    },
                    {
                        key: `evtool_node_${node.id}_outlet_dummy_0`,
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

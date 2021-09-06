<template>
    <Container @scroll="updateConnections">
        <button @click="drawConnections">test draw connection</button>
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

        const drawConnections = () => {
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
                const line = new LeaderLine(
                    // document.getElementById('evtool_node_' + keys[0]),
                    // document.getElementById('evtool_node_' + keys[1]),
                    document.getElementById(connection.from),
                    document.getElementById(connection.to),
                    { color: 'darkblue', size: 4 },
                )
                connectionElements.value.push(line)
            })
        }
        const clearConnections = () => {
            // connections.value.clear()
            connectionElements.value.forEach((connectionElement) => {
                connectionElement.remove()
            })
            // connectionElements.value.clear()
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
            (nodes) => {
                console.log('nodes changed', nodes)
                drawConnections()
            },
        )
        onBeforeUpdate(() => {
            // nodeRefs = []
        })
        onUpdated(() => {
            console.log('updated', nodeRefs)
        })
        onMounted(() => {
            console.log(nodeRefs)
            drawConnections()
            window.addEventListener('scroll', updateConnections)
        })
        onUnmounted(() => {
            clearConnections()
            window.removeEventListener('scroll', updateConnections)
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
            drawConnections,
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

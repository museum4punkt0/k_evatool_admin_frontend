<template>
    <Container>node editor</Container>
    <button @click="drawConnections">test draw connection</button>
    <button @click="updateConnections">test update connection</button>
    <Node
        v-for="node in nodes"
        :id="'evtool_node_' + node.id"
        :key="node.title"
        :ref="
            (el) => {
                nodeRefs[node.id] = el
            }
        "
        :inlets="getInletsForNode(node)"
        :outlets="getOutletsForNode(node)"
        :data="node"
    ></Node>
</template>

<script>
import { ref, watch, onBeforeUpdate, onUnmounted } from 'vue'
import styled from 'vue3-styled-components'
import Node from './Node.vue'
import LeaderLine from 'vue3-leaderline'
const Container = styled.div`
    overflow: scroll;
    background-color: CadetBlue;
`

export default {
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
        console.log(LeaderLine)
        const nodeRefs = ref({})
        const connectionElements = ref([])
        props.nodes.forEach((node) => {
            nodeRefs.value[node.id] = null
        })
        const highlightInlets = ref(false)
        const highlightOutlets = ref(false)
        watch(
            () => props.nodes,
            (nodes) => {
                console.log('nodes changed', nodes)
            },
        )
        onBeforeUpdate(() => {})
        onUnmounted(() => {
            connectionElements.value.forEach((connectionElement) => {
                // document.removeChild(connectionElement)
                connectionElement.remove()
            })
        })
        return {
            highlightInlets,
            highlightOutlets,
            getInletsForNode: () => [{ name: 'in' }],
            getOutletsForNode: (node) => {
                const outlets = [{ name: 'next', value: node.nextStepId }]
                return outlets
            },
            nodeRefs,
            connectionElements,
            connections: [{ from: null, to: null }],
            drawConnections: () => {
                console.log(LeaderLine)
                const keys = Object.keys(nodeRefs.value)
                console.log(keys)
                if (keys.length > 1) {
                    console.log(
                        // nodeRefs.value[keys[0]],
                        // nodeRefs.value[keys[1]].get(),
                        document.getElementById('evtool_node_' + keys[0]),
                        document.getElementById('evtool_node_' + keys[1]),
                    )
                    const line = new LeaderLine(
                        document.getElementById('evtool_node_' + keys[0]),
                        document.getElementById('evtool_node_' + keys[1]),
                        { color: 'red', size: 8 },
                    )
                    connectionElements.value.push(line)
                }
            },
            updateConnections: () => {
                connectionElements.value.forEach((connectionElement) => {
                    connectionElement.position()
                })
            },
        }
    },
}
</script>

<style></style>

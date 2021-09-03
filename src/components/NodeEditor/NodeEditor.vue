<template>
    <Container>node editor</Container>
    <button @click="drawConnections">test draw connection</button>
    <button @click="updateConnections">test update connection</button>
    <Node
        v-for="node in nodes"
        :id="'evtool_node_' + node.id"
        :ref="(el) => (nodeRefs[node.id] = el)"
        :key="'draggable_node' + node.title"
        :data="node"
        @nodeOutletClick="nodeOutletClick(node)"
    />
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
        console.log(LeaderLine)
        const nodeRefs = ref([])
        let connectionElements = ref([])
        /*
        props.nodes.forEach((node) => {
            nodeRefs.value[node.id] = null
        })
        */
        const highlightInlets = ref(false)
        const highlightOutlets = ref(false)
        watch(
            () => props.nodes,
            (nodes) => {
                console.log('nodes changed', nodes)
            },
        )
        onBeforeUpdate(() => {
            // nodeRefs = []
        })
        onUpdated(() => {
            console.log(nodeRefs)
        })
        onMounted(() => {
            console.log(nodeRefs)
        })
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

                console.log('---------------------------')
                console.log(nodeRefs.value)
                console.log('---------------------------')

                if (keys.length > 1) {
                    console.log(
                        nodeRefs,
                        nodeRefs.value,
                        // document.getElementById('evtool_node_' + keys[0]),
                        // document.getElementById('evtool_node_' + keys[1]),
                    )

                    const line = new LeaderLine(
                        document.getElementById('evtool_node_' + keys[0]),
                        document.getElementById('evtool_node_' + keys[1]),
                        { color: 'red', size: 8 },
                    )
                    connectionElements.value.push(line)
                    /*
                    const line = new LeaderLine(
                        nodeRefs.value[0],
                        nodeRefs.value[1],
                        {
                            color: 'red',
                            size: 8,
                        },
                    )

                }
                */
                }
            },
            updateConnections: () => {
                connectionElements.value.forEach((connectionElement) => {
                    connectionElement.position()
                })
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

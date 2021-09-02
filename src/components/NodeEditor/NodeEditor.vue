<template>
    <Container>node editor</Container>
    <Node
        v-for="node in nodes"
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
import { ref, watch, onBeforeUpdate } from 'vue'
import styled from 'vue3-styled-components'
import Node from './Node.vue'
import LeaderLine from 'leader-line-vue'
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
        const nodeRefs = ref({})
        const highlightInlets = ref(false)
        const highlightOutlets = ref(false)
        watch(
            () => props.nodes,
            (nodes) => {
                console.log('nodes changed', nodes)
            },
        )
        // LeaderLine.setLine(this.$refs['17'], this.$refs['2'])
        onBeforeUpdate(() => {
            console.log(nodeRefs)
            nodeRefs.value = []
        })
        return {
            highlightInlets,
            highlightOutlets,
            getInletsForNode: () => [{ name: 'in' }],
            getOutletsForNode: (node) => {
                const outlets = [{ name: 'next', value: node.nextStepId }]
                return outlets
            },
            connections: [{ from: null, to: null }],
        }
    },
}
</script>

<style></style>

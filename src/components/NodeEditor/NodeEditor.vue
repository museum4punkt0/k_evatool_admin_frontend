<template>
    <Container>node editor</Container>
    <Node
        v-for="node in nodes"
        :key="node.title"
        :inlets="getInletsForNode(node)"
        :outlets="getOutletsForNode(node)"
        :data="node"
    ></Node>
</template>

<script>
import { ref, watch } from 'vue'
import styled from 'vue3-styled-components'
import Node from './Node.vue'
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
        const highlightInlets = ref(false)
        const highlightOutlets = ref(false)
        watch(
            () => props.nodes,
            (nodes) => {
                console.log('nodes changed', nodes)
            },
        )
        return {
            highlightInlets,
            highlightOutlets,
            getInletsForNode: () => [{ name: 'in' }],
            getOutletsForNode: (node) => {
                const outlets = [{ name: 'next', value: node.nextStepId }]
                return outlets
            },
        }
    },
}
</script>

<style></style>

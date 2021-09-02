<template>
    <Container>node editor</Container>
    <Node
        v-for="node in nodes"
        :key="node.title"
        :inlets="getInletsForNode(node)"
        :outlets="getOutletsForNode(node)"
    >
        <component :is="nodeComponent" :data="node"></component>
    </Node>
</template>

<script>
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
        nodeComponent: {
            type: Object,
            required: true,
        },
        getInletsForNode: {
            type: Function,
            required: false,
            default: () => [],
        },
        getOutletsForNode: {
            type: Function,
            required: false,
            default: () => [],
        },
    },
    setup() {
        return {}
    },
}
</script>

<style></style>

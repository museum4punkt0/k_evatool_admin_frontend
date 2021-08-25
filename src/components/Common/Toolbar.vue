<template>
    <Container>
        <slot></slot>
    </Container>
</template>

<script>
import Button from './Button'
import styled from 'vue3-styled-components'
const Container = styled.div`
    text-align: right;
`
const Title = styled.div`
    flex-grow: 1;
    font-size: 24px;
`

export default {
    components: {
        Button,
        Container,
        Title,
    },
    props: { title: { type: String, default: '' } },
    setup(props) {
        return {}
    },
    methods: {},
}
</script>

<style></style>

<template>
    <Container>
        <slot></slot>
    </Container>
</template>

<script>
import styled from 'vue3-styled-components'
const Container = styled.div`
    background-color: lightgreen;
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    overflow: scroll;
`
export default {
    components: {
        Container,
    },
    setup() {
        return {}
    },
}
</script>

<style></style>

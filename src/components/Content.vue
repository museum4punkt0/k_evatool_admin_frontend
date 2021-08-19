<template>
    <Container>
        <slot></slot>
    </Container>
</template>

<script>
import styled from 'vue3-styled-components'
const Container = styled.div`
    background-color: yellow;
    display: default;
    flex-grow: 1;
    flex-direction: column;
    overflow-y: scroll;
`
export default {
    components: {
        Container,
    },
    setup(props) {
        return {}
    },
}
</script>

<style></style>

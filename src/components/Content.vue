<template>
    <Container>
        <slot></slot>
    </Container>
</template>

<script>
import styled from 'vue3-styled-components'
import theme from '../theme'

const Container = styled.div`
    background-color: ${theme.primaryBackgroundColor};
    display: default;
    flex-grow: 1;
    flex-direction: column;
    overflow-y: scroll;
    padding: 24px;
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

<template>
    <Container>
        <Title>{{ title }}</Title>
        <slot></slot>
    </Container>
</template>

<script>
import styled from 'vue3-styled-components'

const Container = styled.div`
    display: flex;
    flex-direction: row;
    margin-bottom: 24px;
    background-color: rgba(0, 0, 0, 0.1);
`
const Title = styled.div`
    flex-grow: 1;
    font-size: 24px;
`

export default {
    components: { Container, Title },
    props: {
        title: { type: String, default: '' },
    },
    setup(props) {},
}
</script>

<style></style>

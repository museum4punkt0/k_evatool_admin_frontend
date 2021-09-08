<template>
    <Container :id="key">
        {{ name }}
    </Container>
</template>

<script>
import styled from 'vue3-styled-components'
const Container = styled.div`
    background: yellow;
    font-size: 12px;
    border-radius: 16px;
    padding: 4px;
`
export default {
    name: 'Inlet',
    components: {
        Container,
    },
    props: {
        key: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        value: {
            type: String,
            required: false,
            default: () => '',
        },
    },
    setup() {
        return {}
    },
}
</script>

<style></style>

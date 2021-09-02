<template>
    <Container>
        {{ name }}
    </Container>
</template>

<script>
import styled from 'vue3-styled-components'
const Container = styled.div`
    background: yellow;
    font-size: 12px;
    border-radius: 16px;
`
export default {
    components: {
        Container,
    },
    props: {
        name: {
            type: String,
            required: true,
        },
    },
    setup() {
        return {}
    },
}
</script>

<style></style>

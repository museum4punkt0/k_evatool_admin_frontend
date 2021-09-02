<template>
    <Container @click="onClick">
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
    components: {
        Container,
    },
    props: {
        name: {
            type: String,
            required: true,
        },
        value: {
            type: String,
            required: false,
            default: () => '',
        },
        onClick: {
            type: Function,
            required: false,
            default: () => {
                return () => {}
            },
        },
    },
    setup() {
        return {
            selected: false,
        }
    },
}
</script>

<style></style>

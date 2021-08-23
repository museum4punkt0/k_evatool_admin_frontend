<template>
    <Container>
        <slot></slot>
    </Container>
</template>

<script>
import Button from '../Button'
import styled from 'vue3-styled-components'

const Container = styled.ul``

export default {
    components: {
        Button,
        Container,
    },
    props: {},
    setup(props) {
        return {
            query: '',
        }
    },
    methods: {},
}
</script>

<style></style>

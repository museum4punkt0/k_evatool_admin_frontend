<template>
    <Container>
        <input v-model="toggle" type="checkbox" @change="onCheckedChange" />
        <slot></slot>
        <Button>edit</Button>
        <Button>delete</Button>
    </Container>
</template>

<script>
import Button from '../Button'
import styled from 'vue3-styled-components'

const Container = styled.li``

export default {
    components: {
        Button,
        Container,
    },
    props: {
        onCheckedChange: {
            type: Function,
            default: () => {},
        },
        onEdit: {
            type: Function,
            default: () => {},
        },
        onDelete: {
            type: Function,
            default: () => {},
        },
    },
    setup(props) {
        return {
            query: '',
        }
    },
    methods: {},
}
</script>

<style></style>

<template>
    <Container>
        <input
            v-model="toggle"
            type="checkbox"
            true-value="yes"
            false-value="no"
            @change="onCheckedChange"
        />
        <slot></slot>
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

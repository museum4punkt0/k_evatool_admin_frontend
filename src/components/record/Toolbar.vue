<template>
    <Container>
        <Button @click="onDelete(data)">delete</Button>
        <Button @click="onRefresh">refresh</Button>
    </Container>
</template>

<script>
import Button from '../Button'
import styled from 'vue3-styled-components'
const Container = styled.div`
    text-align: right;
`

export default {
    components: {
        Button,
        Container,
    },
    props: {
        data: {
            type: Object,
            required: true,
        },
        onDelete: { type: Function, default: () => {} },
    },
    setup(props) {
        return {}
    },
    methods: {},
}
</script>

<style></style>

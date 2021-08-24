<template>
    <Container>
        <input
            v-model="query"
            placeholder="filter"
            @keyup="onFilterTextChange"
        />
        {{ query }}
        <Button v-show="selected.length > 0" @click="onDelete(selected)">
            delete
        </Button>
        <Button v-show="selected.length === 1" @click="onEdit(selected)">
            edit
        </Button>
        <Button v-show="selected.length === 0" @click="onCreate">create</Button>
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
        selected: {
            type: Array,
            default: [],
        },
        onFilterTextChange: { type: Function, default: () => {} },
        onEdit: { type: Function, default: () => {} },
        onDelete: { type: Function, default: () => {} },
        onCreate: { type: Function, default: () => {} },
        onRefresh: { type: Function, default: () => {} },
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

<template>
    <input
        v-model="query"
        placeholder="edit me"
        @keyup="onSearchChange"
        @change="onSearchChange"
    />
    {{ query }}
    <Button>search</Button>
    <Button>delete</Button>
    <Button>edit</Button>
    <Button>create</Button>
    <Button @click="onRefresh">refresh</Button>
</template>

<script>
import Button from '../Button'

export default {
    components: {
        Button,
    },
    props: {
        onSearch: { type: Function, default: () => {} },
        onSearchChange: { type: Function, default: () => {} },
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

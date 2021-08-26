<template>
    <Container>
        <td>
            <input
                type="checkbox"
                :checked="selected"
                @click="onSelectedToggle(selected)"
            />
        </td>
        <td>{{ idSelector(data) }}</td>
        <td>{{ statusSelector(data) }}</td>
        <td @click="onView(data)">{{ titleSelector(data) }}</td>
        <td>
            <Button @click="onView(data)">view</Button>
            <Button @click="onEdit(data)">edit</Button>
            <Button @click="onEdit(data)">duplicate</Button>
            <Button @click="onDelete(data)">delete</Button>
        </td>
    </Container>
</template>

<script>
import Button from '../Button'
import styled from 'vue3-styled-components'

const Container = styled.tr``

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
        idSelector: {
            type: Function,
            default: (item) => item.id,
        },
        statusSelector: {
            type: Function,
            default: (item) => (item.published ? 'published' : 'draft'),
        },
        titleSelector: {
            type: Function,
            default: (item) => '',
        },
        selected: {
            type: Boolean,
            required: true,
        },
        onSelectedToggle: {
            type: Function,
            required: true,
        },
        onView: {
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
        return {}
    },
    methods: {},
}
</script>

<style></style>

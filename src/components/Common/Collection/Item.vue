<template>
    <Container>
        <td>
            <input
                v-model="selected"
                type="checkbox"
                @change="onCheckedChange"
            />
        </td>
        <td>{{ idSelector(data) }}</td>
        <td>{{ statusSelector(data) }}</td>
        <td>{{ titleSelector(data) }}</td>
        <td>
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
            selected: false,
        }
    },
    methods: {},
}
</script>

<style></style>

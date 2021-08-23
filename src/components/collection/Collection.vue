<template>
    <Container>
        <h2>{{ title }}</h2>
        <Toolbar
            :selected="selected"
            :on-refresh="onRefresh"
            :on-create="onCreate"
            :on-edit="onEdit"
            :on-delete="onDelete"
            :on-filter-text-change="onFilterTextChange"
        ></Toolbar>
        <table>
            <tr>
                <th></th>
                <th>id</th>
                <th>name</th>
                <th>actions</th>
            </tr>
            <Row
                v-for="(item, index) in items"
                v-show="filterText === '' || textFilter(item, filterText)"
                :key="index"
                :data="item"
                :id-selector="itemIdSelector"
                :title-selector="itemTitleSelector"
                :on-checked-change="onItemSelectedChange(item)"
                :on-edit="onEdit"
                :on-delete="onDelete"
                @click="onEdit(item)"
            >
                <!-- <router-link :to="{ name: 'survey', params: { id: item.id } }">
                    {{ item.id }} {{ item.name }}
                </router-link> -->
            </Row>
        </table>
        <slot></slot>
    </Container>
</template>

<script>
import { ref } from 'vue'
import Toolbar from './Toolbar.vue'
import Item from './Item.vue'
import Button from '../Button'
import styled from 'vue3-styled-components'

const Container = styled.div``
const List = styled.ul``

export default {
    components: {
        Button,
        Container,
        List,
        Row: Item,
        Toolbar,
    },
    props: {
        title: {
            type: String,
            default: 'collection',
        },
        itemIdSelector: {
            type: Function,
            required: true,
        },
        itemTitleSelector: {
            type: Function,
            required: true,
        },
        items: {
            type: Array,
            required: true,
        },
        textFilter: {
            type: Function,
            default: () => true,
        },
        onRefresh: { type: Function, default: () => {} },
        onCreate: { type: Function, default: () => {} },
        onEdit: { type: Function, default: () => {} },
        onDelete: { type: Function, default: () => {} },
    },
    setup(props) {
        const selected = ref([])
        const filterText = ref('')
        const onFilterTextChange = (value) => {
            filterText.value = value.target.value
        }
        const onItemSelectedChange = (selectedItem) => {
            return (event) => {
                if (event.target.checked) {
                    selected.value.push(selectedItem)
                } else {
                    selected.value = selected.value.filter(
                        (item) => item.id !== selectedItem.id,
                    )
                }
            }
        }
        return {
            selected,
            filterText,
            onItemSelectedChange,
            onFilterTextChange,
        }
    },
    methods: {},
}
</script>

<style></style>

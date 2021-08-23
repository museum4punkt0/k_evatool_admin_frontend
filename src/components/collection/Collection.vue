<template>
    <Container>
        <Header>
            <Title>{{ title }}</Title>
            <Toolbar
                :selected="selected"
                :on-refresh="onRefresh"
                :on-create="onCreate"
                :on-edit="onEdit"
                :on-delete="onDelete"
                :on-filter-text-change="onFilterTextChange"
            ></Toolbar>
        </Header>
        <StyledTable>
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
            ></Row>
        </StyledTable>
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
const Header = styled.div`
    display: flex;
    flex-direction: row;
    margin-bottom: 24px;
`
const Title = styled.div`
    flex-grow: 1;
    font-size: 24px;
`
const StyledTable = styled.table`
    width: 100%;
    tr:nth-child(even) {
        background: #fff;
    }
    th {
        text-align: left;
        &:last-child {
            text-align: right;
        }
    }
    tr {
        td:last-child {
            text-align: right;
        }
    }
`
const List = styled.ul``

export default {
    components: {
        Button,
        Container,
        Header,
        Title,
        StyledTable,
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

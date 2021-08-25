<template>
    <Layout>
        <PageHeader :title="title">
            <Toolbar>
                <input
                    v-if="textFilter"
                    v-model="query"
                    placeholder="filter"
                    @keyup="onFilterTextChange"
                />
                {{ query }}
                <Button
                    v-show="selected.length > 0"
                    @click="onDelete(selected)"
                >
                    delete
                </Button>
                <Button
                    v-show="selected.length === 1"
                    @click="onEdit(selected)"
                >
                    edit
                </Button>
                <Button v-show="selected.length === 0" @click="onCreate">
                    create
                </Button>
                <Button @click="onRefresh">refresh</Button>
            </Toolbar>
        </PageHeader>
        <ScrollContent>
            <StyledTable>
                <tr>
                    <th>
                        <input type="checkbox" @change="onBulkSelectedChange" />
                    </th>
                    <th>id</th>
                    <th>title</th>
                    <th>actions</th>
                </tr>
                <Row
                    v-for="(item, index) in items"
                    v-show="filterText === '' || textFilter(item, filterText)"
                    :key="itemIdSelector(item)"
                    :data="item"
                    :id-selector="itemIdSelector"
                    :title-selector="itemTitleSelector"
                    :on-checked-change="onItemSelectedChange(item)"
                    :on-edit="onEdit"
                    :on-delete="onDelete"
                ></Row>
            </StyledTable>
            <slot></slot>
        </ScrollContent>
    </Layout>
</template>

<script>
import { ref } from 'vue'
import Header from '../Header.vue'
import Button from '../Button'
import Layout from '../Layout'
import ScrollContent from '../ScrollContent'
import Toolbar from '../Toolbar.vue'
import Item from './Item.vue'
import styled from 'vue3-styled-components'

const Container = styled.div``
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
export default {
    components: {
        Button,
        Container,
        PageHeader: Header,
        Layout,
        ScrollContent,
        Title,
        StyledTable,
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
            default: (item) => item.id,
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
        const onBulkSelectedChange = (event) => {
            console.log(event.target.checked)
            if (event.target.checked) {
                selected.value = props.items
                // TODO: update models within items, refs? props? ...
            } else {
                selected.value = []
            }
        }
        return {
            selected,
            filterText,
            onItemSelectedChange,
            onBulkSelectedChange,
            onFilterTextChange,
        }
    },
    methods: {},
}
</script>

<style></style>

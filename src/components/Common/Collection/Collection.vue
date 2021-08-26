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

                <Button v-if="onNew && selected.length === 0" @click="onNew">
                    new
                </Button>
                <Button
                    v-if="onEdit && selected.length === 1"
                    @click="onEdit(selected)"
                >
                    edit
                </Button>
                <Button
                    v-if="onDelete && selected.length > 0"
                    @click=";[onDelete(selected), onItemsDeleted(selected)]"
                >
                    delete
                </Button>
                <Button v-if="onRefresh" @click="onRefresh">refresh</Button>
            </Toolbar>
        </PageHeader>
        <ScrollContent>
            <StyledTable>
                <tr>
                    <th>
                        <input type="checkbox" @change="onBulkSelectedChange" />
                    </th>
                    <th>id</th>
                    <th>status</th>
                    <th>title</th>
                    <th>actions</th>
                </tr>
                <Row
                    v-for="item in items"
                    v-show="filterText === '' || textFilter(item, filterText)"
                    :key="itemIdSelector(item)"
                    :data="item"
                    :id-selector="itemIdSelector"
                    :title-selector="itemTitleSelector"
                    :selected="
                        selected.filter(
                            (selectedItem) => selectedItem.id === item.id,
                        ).length > 0
                    "
                    :on-selected-toggle="onItemSelectToggleCreator(item)"
                    :on-view="onView"
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
        onRefresh: { type: Function, required: false },
        onNew: { type: Function, required: false },
        onView: { type: Function, required: false },
        onEdit: { type: Function, required: false },
        onDelete: { type: Function, required: false },
    },
    setup(props) {
        const selected = ref([])
        const filterText = ref('')
        const onFilterTextChange = (value) => {
            filterText.value = value.target.value
        }
        const onItemsDeleted = (items) => {
            selected.value = []
            // console.log('items deleted', selected, items)
            // selected.value = selected.value.filter((selectedItem) => {
            //     console.log(
            //         'check if selectedItem is in deletedItems',
            //         selectedItem,
            //         items,
            //     )
            //     return items.filter((item) => item.id !== selectedItem.id)
            // })
            // console.log('items deleted', selected, items)
        }
        const onItemSelectToggleCreator = (item) => {
            return (currentValue) => {
                if (currentValue) {
                    //current value is true, needs to be removed from the selected array
                    selected.value = selected.value.filter(
                        (selectedItem) => selectedItem.id !== item.id,
                    )
                } else {
                    //current value is false, id needs to be added to selected array
                    selected.value.push(item)
                }
            }
        }
        const onBulkSelectedChange = (event) => {
            if (event.target.checked) {
                selected.value = props.items
            } else {
                selected.value = []
            }
        }
        return {
            selected,
            filterText,
            onItemSelectToggleCreator,
            onItemsDeleted,
            onBulkSelectedChange,
            onFilterTextChange,
        }
    },
    methods: {},
}
</script>

<style></style>

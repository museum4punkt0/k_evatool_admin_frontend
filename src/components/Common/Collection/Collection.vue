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
                <slot name="toolbar"></slot>

                <Button v-if="onNew && selected.length === 0" @click="onNew">
                    <font-awesome-icon :icon="['fas', 'plus']" />
                    <!-- <PlusIcon class="h-6 w-6"></PlusIcon> -->
                </Button>
                <Button
                    v-if="onEdit && selected.length === 1"
                    @click="onEdit(selected)"
                >
                    <font-awesome-icon :icon="['fas', 'edit']" />
                </Button>
                <Button
                    v-if="onDelete && selected.length > 0"
                    @click=";[onDelete(selected), onItemsDeleted(selected)]"
                >
                    <font-awesome-icon :icon="['fas', 'trash']" />
                </Button>
                <Button v-if="onRefresh" @click="onRefresh">
                    <font-awesome-icon :icon="['fas', 'sync']" />
                    <!-- <RefreshIcon class="h-6 w-6"></RefreshIcon> -->
                </Button>
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
import Toolbar from '../Toolbar'
import Item from './Item.vue'
import styled from 'vue3-styled-components'
// import { PlusIcon, RefreshIcon } from '@heroicons/vue/solid'

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
        // PlusIcon,
        // RefreshIcon,
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
    },
    setup(props) {
        const selected = ref([])
        const filterText = ref('')
        const onFilterTextChange = (value) => {
            filterText.value = value.target.value
        }
        const onItemsDeleted = () => {
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

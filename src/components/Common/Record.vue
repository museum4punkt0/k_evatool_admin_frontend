<template>
    <Layout>
        <PageHeader :title="titleSelector(data)">
            <Toolbar>
                <Button @click="onDelete(data)">delete</Button>
                <Button @click="onRefresh">refresh</Button>
            </Toolbar>
        </PageHeader>
        <ScrollContent>
            <Meta>
                <SectionTitle>Meta</SectionTitle>
                <Button v-show="showMeta" @click="toggleShowMeta">hide</Button>
                <Button v-show="!showMeta" @click="toggleShowMeta">show</Button>
                <div v-show="showMeta">
                    <ul>
                        <li v-for="(item, index) in meta" :key="index">
                            {{ item }}: {{ data[item] }}
                        </li>
                    </ul>
                </div>
            </Meta>
            <Content>
                <SectionTitle>Details</SectionTitle>
                <slot></slot>
            </Content>
        </ScrollContent>
    </Layout>
</template>

<script>
import { ref } from 'vue'
import Toolbar from './Toolbar.vue'
// import Item from './Item.vue'
import Button from './Button'
import Layout from './Layout'
import Header from './Header.vue'
import ScrollContent from './ScrollContent'
import styled from 'vue3-styled-components'

const SectionTitle = styled.div`
    flex-grow: 1;
    font-size: 20px;
`
const Meta = styled.div`
    margin-bottom: 24px;
`
const Content = styled.div``
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
        Layout,
        PageHeader: Header,
        SectionTitle,
        Meta,
        Content,
        StyledTable,
        Toolbar,
    },
    props: {
        itemIdSelector: {
            type: Function,
            required: true,
        },
        titleSelector: {
            type: Function,
            required: true,
        },
        data: {
            type: Object,
            required: true,
        },
        meta: { type: Array, default: () => ['id', 'createdAt', 'updatedAT'] },
        onDelete: { type: Function, default: () => {} },
    },
    setup(props) {
        const showMeta = ref(true)
        const toggleShowMeta = () => {
            showMeta.value = !showMeta.value
        }
        return {
            showMeta,
            toggleShowMeta,
        }
    },
}
</script>

<style></style>

<template>
    <Layout class="record-container">
        <PageHeader :title="titleSelector(data)">
            <Toolbar>
                <slot name="toolbar"></slot>
                <Button v-if="onEdit" @click="onEdit(data)">edit</Button>
                <Button v-if="onDelete" @click="onDelete(data)">delete</Button>
                <Button @click="onRefresh">refresh</Button>
            </Toolbar>
        </PageHeader>
        <ScrollContent ref="scrollContent" class="record-scrollcontent">
            <Meta>
                <MetaHeader>
                    <SectionTitle>Meta</SectionTitle>
                    <Button v-show="showMeta" @click="toggleShowMeta">
                        hide
                    </Button>
                    <Button v-show="!showMeta" @click="toggleShowMeta">
                        show
                    </Button>
                </MetaHeader>
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
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Toolbar from './Toolbar'
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
    background-color: rgba(0, 0, 0, 0.1);
`
const MetaHeader = styled.div`
    display: flex;
    flex-direction: row;
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
        ScrollContent,
        SectionTitle,
        Meta,
        MetaHeader,
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
        onDelete: { type: Function, required: false },
        onEdit: { type: Function, required: false },
    },
    emits: ['scroll'],

    setup(props, { emit }) {
        const showMeta = ref(false)
        const scrollContent = ref(null)
        const toggleShowMeta = () => {
            showMeta.value = !showMeta.value
        }

        const emitScroll = (event) => {
            emit('scroll', event)
        }

        onMounted(() => {
            scrollContent.value.$el.addEventListener('scroll', emitScroll)
        })
        onBeforeUnmount(() => {
            scrollContent.value.$el.removeEventListener('scroll', emitScroll)
        })
        return {
            showMeta,
            scrollContent,
            toggleShowMeta,
        }
    },
}
</script>

<style></style>

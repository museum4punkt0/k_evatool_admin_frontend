<template>
    <Container>
        <Header>
            <Title>{{ titleSelector(data) }}</Title>
            <Toolbar :data="data" :on-delete="onDelete"></Toolbar>
        </Header>
        <Meta>
            <SectionTitle>Meta</SectionTitle>
            <ul>
                <li v-for="(item, index) in meta" :key="index">
                    {{ item }}: {{ data[item] }}
                </li>
            </ul>
        </Meta>
        <!-- <slot></slot> -->
    </Container>
</template>

<script>
import { ref } from 'vue'
import Toolbar from './Toolbar.vue'
// import Item from './Item.vue'
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
const SectionTitle = styled.div`
    flex-grow: 1;
    font-size: 20px;
`
const Meta = styled.div``
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
        Header,
        Title,
        SectionTitle,
        Meta,
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
        return {}
    },
}
</script>

<style></style>

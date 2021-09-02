<template>
    <Container v-draggable="">
        <InletsContainer>
            <Inlet
                v-for="inlet in inlets"
                :key="inlet.name"
                :name="inlet.name"
            />
        </InletsContainer>
        <ContentContainer>
            <slot></slot>
        </ContentContainer>
        <OutletsContainer>
            <Outlet
                v-for="outlet in outlets"
                :key="outlet.name"
                :name="outlet.name"
            />
        </OutletsContainer>
    </Container>
</template>

<script>
import styled from 'vue3-styled-components'
import Inlet from './Inlet.vue'
import Outlet from './Outlet.vue'
const Container = styled.div`
    background-color: DarkOrange;
    width: 200px;
    height: 80px;
    margin: 15px;
    display: flex;
    flex-direction: row;
`
const InletsContainer = styled.div`
    display: flex;
    flex-direction: column;
    background: green;
    align-items: center;
    justify-content: space-evenly;
`
const OutletsContainer = styled.div`
    display: flex;
    flex-direction: column;
    background: red;
    align-items: center;
    justify-content: space-evenly;
`
const ContentContainer = styled.div`
    flex-grow: 1;
`

export default {
    components: {
        Inlet,
        Outlet,
        Container,
        InletsContainer,
        OutletsContainer,
        ContentContainer,
    },
    props: {
        inlets: {
            type: Array,
            required: false,
            default: () => [],
        },
        outlets: {
            type: Array,
            required: false,
            default: () => [],
        },
    },
    setup() {
        return {}
    },
}
</script>

<style></style>

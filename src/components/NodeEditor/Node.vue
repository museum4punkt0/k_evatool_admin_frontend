<template>
    <Container v-draggable="">
        <InletsContainer>
            <Inlet
                v-for="inlet in inlets"
                :key="inlet.name"
                :name="inlet.name"
                :on-click="creators.onInletClick(data, outlet)"
            />
        </InletsContainer>
        <ContentContainer>
            <Title>
                {{ data.name }}
            </Title>
            <ul>
                <li>id: {{ data.id }}</li>
                <li>element id: {{ data.surveyElementId }}</li>
            </ul>
        </ContentContainer>
        <OutletsContainer>
            <Outlet
                v-for="outlet in outlets"
                :key="outlet.name"
                :name="outlet.name"
                :value="outlet.value"
                :on-click="creators.onOutletClick(data, outlet)"
            />
        </OutletsContainer>
    </Container>
</template>

<script>
import styled from 'vue3-styled-components'
import Inlet from './Inlet.vue'
import Outlet from './Outlet.vue'
import theme from '../../theme'

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
const Title = styled.div`
    color: ${theme.secondaryColor};
    background-color: ${theme.secondaryBackgroundColor};
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
        Title,
    },
    props: {
        data: {
            type: Object,
            required: true,
        },
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
        return {
            creators: {
                onInletClick: (node, inlet) => {
                    return () => {
                        console.log('inlet clicked', node, inlet)
                    }
                },
                onOutletClick: (node, outlet) => {
                    return () => {
                        console.log('outlet clicked', node, outlet)
                    }
                },
            },
        }
    },
}
</script>

<style></style>

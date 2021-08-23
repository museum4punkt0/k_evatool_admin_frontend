<template>
    <Container>footer</Container>
</template>

<script>
import styled from 'vue3-styled-components'
import theme from '../theme'
const Container = styled.div`
    background-color: ${theme.tertiaryBackgroundColor};
    color: ${theme.tertiaryColor};
    padding-left: 24px;
    padding-right: 24px;
    text-align: right;
`
export default {
    components: {
        Container,
    },
    setup(props) {
        return {}
    },
}
</script>

<style></style>

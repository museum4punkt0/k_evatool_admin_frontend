<template>
    <Container>
        <Title>
            {{ data.name }}
        </Title>
    </Container>
</template>

<script>
import styled from 'vue3-styled-components'
import theme from '../../theme'
const Container = styled.div`
    background-color: purple;
    height: 100%;
`
const Title = styled.div`
    color: ${theme.secondaryColor};
    background-color: ${theme.secondaryBackgroundColor};
`

export default {
    components: {
        Container,
        Title,
    },
    props: {
        data: {
            type: Object,
            required: true,
        },
    },
    setup() {
        return {}
    },
}
</script>

<style></style>

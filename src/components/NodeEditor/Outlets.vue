<template>
    <Container><slot></slot></Container>
</template>

<script>
import styled from 'vue3-styled-components'
const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
`

export default {
    name: 'Outlets',
    components: { Container },
}
</script>

<template>
    <Container class="flex-1 flex-col p-4"><slot></slot></Container>
</template>

<script>
import styled from 'vue3-styled-components'
const Container = styled.div`
    align-items: center;
    justify-content: space-evenly;
`

export default {
    name: 'NodeContent',
    components: { Container },
}
</script>

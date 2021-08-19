<template>
    <Container>
        <h2>menu</h2>
        <ul>
            <li>
                <router-link to="/">Home</router-link>
            </li>
            <li>
                <router-link to="/surveys">surveys</router-link>
            </li>
            <li>
                <router-link to="/languages">languages</router-link>
            </li>
            <li>
                <router-link to="/settings">settings</router-link>
            </li>
        </ul>
    </Container>
</template>

<script>
import styled from 'vue3-styled-components'
const Container = styled.div`
    background-color: lightpink;
    height: 100%;
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

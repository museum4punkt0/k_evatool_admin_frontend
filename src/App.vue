<template>
    <Container>
        <Layout>
            <Menu></Menu>
            <Content>
                <router-view></router-view>
            </Content>
        </Layout>
        <Footer></Footer>
    </Container>
</template>

<script>
import styled from 'vue3-styled-components'

import Layout from './components/Layout.vue'
import Footer from './components/Footer.vue'
import Menu from './components/Menu.vue'
import Content from './components/Content.vue'

const Container = styled.div`
    width: 100vw;
    height 100vh;
    display: flex;
    flex-direction: column;
`

export default {
    components: {
        Container,
        Footer,
        Menu,
        Layout,
        Content,
    },
    data() {
        return {
            title: this.$store.state.title,
        }
    },
}
</script>

<style></style>

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
    <Notifications></Notifications>
</template>

<script>
import { createNamespacedHelpers } from 'vuex-composition-helpers'
import styled from 'vue3-styled-components'

import Layout from './components/Layout.vue'
import Footer from './components/Footer.vue'
import Menu from './components/Menu.vue'
import Content from './components/Content.vue'
import Notifications from './components/Notifications/Notifications.vue'

const { useState, useActions } = createNamespacedHelpers('elementTypes')

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
        Notifications,
        Notifications,
    },
    setup() {
        const { getAllAndUpdateStore } = useActions(['getAllAndUpdateStore'])
        getAllAndUpdateStore()
        return {}
    },
}
</script>

<style></style>

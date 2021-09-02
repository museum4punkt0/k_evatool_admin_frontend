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

const { useActions: useElementTypesActions } =
    createNamespacedHelpers('elementTypes')
const { useActions: useLanguagesActions } = createNamespacedHelpers('languages')

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
    },
    setup() {
        const { getAllElementTypesAndUpdateStore } = useElementTypesActions([
            'getAllElementTypesAndUpdateStore',
        ])
        const { getAllLanguagesAndUpdateStore } = useLanguagesActions([
            'getAllLanguagesAndUpdateStore',
        ])
        getAllElementTypesAndUpdateStore()
        getAllLanguagesAndUpdateStore()
        return {}
    },
}
</script>

<style></style>

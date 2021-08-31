<template>
    <Container>
        <ul>
            <Item>
                <router-link to="/">Home</router-link>
            </Item>
            <Item>
                <router-link to="/surveys">
                    {{ $t('survey') }}
                </router-link>
            </Item>
            <Item>
                <router-link to="/survey-steps">
                    {{ $t('survey-steps') }}
                </router-link>
            </Item>
            <Item>
                <router-link to="/languages">languages</router-link>
            </Item>
            <Item>
                <router-link to="/localizations">localizations</router-link>
            </Item>
            <Item>
                <router-link to="/user/settings">settings</router-link>
            </Item>
        </ul>
    </Container>
</template>

<script>
import styled from 'vue3-styled-components'
import theme from '../theme'
const Container = styled.div`
    height: 100%;
    padding: 24px;
    background-color: ${theme.secondaryBackgroundColor};
    color: ${theme.secondaryColor};
`

const Item = styled.li`
    a {
        display: block;
        &.router-link-active {
            background-color: ${theme.primaryBackgroundColor};
            color: black;
        }
    }
`
export default {
    components: {
        Container,
        Item,
    },
    setup(props) {
        return {}
    },
}
</script>

<style></style>

<template>
    <ul>
        <li>
            <router-link to="/">Home</router-link>
        </li>

        <li>
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
                <router-link to="/languages">Languages</router-link>
            </Item>
            <!--            <Item>
                      <router-link to="/localizations">Localizations</router-link>
                  </Item>-->
            <Item>
                <router-link to="/user/settings">Settings</router-link>
            </Item>
            <Item>
                <router-link to="/assets">Assets</router-link>
            </Item>
        </li>
    </ul>
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
    setup() {
        return {}
    },
}
</script>

<style></style>

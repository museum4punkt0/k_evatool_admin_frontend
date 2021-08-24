<template>
    <Container>
        <ul>
            <li>
                <router-link to="/">Home</router-link>
            </li>
            <li>
                <router-link to="/surveys">
                    {{ $t('survey') }}
                </router-link>
            </li>
            <li>
                <router-link to="/survey-steps">
                    {{ $t('survey-steps') }}
                </router-link>
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
import theme from '../theme'
const Container = styled.div`
    height: 100%;
    padding: 24px;
    background-color: ${theme.secondaryBackgroundColor};
    color: ${theme.secondaryColor};
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

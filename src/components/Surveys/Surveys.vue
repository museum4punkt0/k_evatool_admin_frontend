<template>
    <h2>Surveys</h2>
    <Button @click="refresh">refresh</Button>
    <ul>
        <li v-for="survey in surveys" :key="survey.id">
            <router-link :to="{ name: 'survey', params: { id: survey.id } }">
                {{ survey.id }}
            </router-link>
        </li>
    </ul>
</template>

<script>
import { createNamespacedHelpers } from 'vuex-composition-helpers'
import Button from '../Button'

const { useState, useActions } = createNamespacedHelpers('surveys')

export default {
    components: {
        Button,
    },
    setup(props) {
        const { surveys } = useState(['surveys'])
        const { refresh } = useActions(['refresh'])
        refresh()
        return {
            surveys,
            refresh,
        }
    },
}
</script>

<style></style>

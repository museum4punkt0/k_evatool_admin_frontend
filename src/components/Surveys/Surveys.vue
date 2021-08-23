<template>
    <h2>Surveys</h2>
    <Toolbar :on-refresh="refresh"></Toolbar>
    <List>
        <ListItem v-for="survey in surveys" :key="survey.id">
            <router-link :to="{ name: 'survey', params: { id: survey.id } }">
                {{ survey.id }}
            </router-link>
        </ListItem>
    </List>
</template>

<script>
import { createNamespacedHelpers } from 'vuex-composition-helpers'
import Button from '../Button'
import Toolbar from '../collection/Toolbar.vue'
import List from '../collection/List.vue'
import ListItem from '../collection/Item.vue'

const { useState, useActions } = createNamespacedHelpers('surveys')

export default {
    components: {
        Button,
        Toolbar,
        List,
        ListItem,
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

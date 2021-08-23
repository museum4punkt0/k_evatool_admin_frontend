<template>
    <h2>Surveys</h2>
    <Toolbar
        :on-refresh="refresh"
        :on-create="onCreate"
        :on-edit="onEdit"
        :on-delete="onDelete"
        :on-filter-text-change="onFilterTextChange"
        :selected="selected"
    ></Toolbar>
    <List>
        <ListItem
            v-for="survey in surveys"
            v-show="filterText === '' || survey.name.includes(filterText)"
            :key="survey.id"
            :on-checked-change="onCheckedChange(survey)"
        >
            <router-link :to="{ name: 'survey', params: { id: survey.id } }">
                {{ survey.id }} {{ survey.name }}
            </router-link>
        </ListItem>
    </List>
</template>

<script>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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
        const router = useRouter()
        const { surveys } = useState(['surveys'])
        const { createOne, deleteOne, refresh } = useActions([
            'createOne',
            'deleteOne',
            'refresh',
        ])
        const selected = ref([])
        const filterText = ref('')
        const onCheckedChange = (survey) => {
            return (event) => {
                if (event.target.checked) {
                    selected.value.push(survey)
                } else {
                    selected.value = selected.value.filter(
                        (item) => item.id !== survey.id,
                    )
                }
                console.log(selected.value)
            }
        }
        const onCreate = () => {
            createOne({ name: 'new survey' })
        }
        const onEdit = (surveys) => {
            router.push({ name: 'survey', params: { id: surveys[0].id } })
        }
        const onDelete = (surveys) => {
            surveys.forEach((item) => {
                console.log(item.id)
                deleteOne(item)
            })
        }
        const onFilterTextChange = (value) => {
            filterText.value = value.target.value
        }
        refresh()
        return {
            surveys,
            filterText,
            onCreate,
            onEdit,
            onDelete,
            refresh,
            selected,
            onCheckedChange,
            onFilterTextChange,
        }
    },
    methods: {},
}
</script>

<style></style>

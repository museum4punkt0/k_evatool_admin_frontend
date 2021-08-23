<template>
    <Collection
        title="surveys"
        :item-title-selector="itemTitleSelector"
        :items="surveys"
        :text-filter="textFilter"
        :on-refresh="refresh"
        :on-create="onCreate"
        :on-edit="onEdit"
        :on-delete="onDelete"
    ></Collection>
</template>

<script>
import { useRouter } from 'vue-router'
import { createNamespacedHelpers } from 'vuex-composition-helpers'
import Button from '../Button'
import Collection from '../collection/Collection.vue'

const { useState, useActions } = createNamespacedHelpers('surveys')

export default {
    components: {
        Button,
        Collection,
    },
    setup(props) {
        const router = useRouter()
        const { surveys } = useState(['surveys'])
        const { createOne, deleteOne, refresh } = useActions([
            'createOne',
            'deleteOne',
            'refresh',
        ])
        const itemTitleSelector = (item) => {
            return item.name
        }
        const textFilter = (item, text) => {
            return item.name.includes(text)
        }
        const onCreate = () => {
            createOne({ name: 'new survey' })
        }
        const onEdit = (surveys) => {
            console.log(surveys, typeof surveys)
            if (typeof surveys === 'array') {
                surveys.forEach((item) => {
                    router.push({
                        name: 'survey',
                        params: { id: surveys[0].id },
                    })
                })
            } else if (typeof surveys === 'object') {
                router.push({ name: 'survey', params: { id: surveys.id } })
            }
        }
        const onDelete = (surveys) => {
            if (typeof surveys === 'array') {
                surveys.forEach((item) => {
                    deleteOne(item)
                })
            } else if (typeof surveys === 'object') {
                deleteOne(surveys)
            }
        }

        refresh()
        return {
            surveys,
            itemTitleSelector,
            textFilter,
            onCreate,
            onEdit,
            onDelete,
            refresh,
        }
    },
    methods: {},
}
</script>

<style></style>

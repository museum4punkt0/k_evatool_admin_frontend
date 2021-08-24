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
import Collection from '../collection/Collection.vue'

const { useState, useActions } = createNamespacedHelpers('surveys')

export default {
    components: {
        Collection,
    },
    setup(props) {
        const router = useRouter()
        const { surveys } = useState(['surveys'])
        const {
            getAllAndUpdateStore,
            createOneAndUpdateStore,
            deleteOneAndUpdateStore,
        } = useActions([
            'getAllAndUpdateStore',
            'createOneAndUpdateStore',
            'deleteOneAndUpdateStore',
        ])
        const itemTitleSelector = (item) => {
            return item.name
        }
        const textFilter = (item, text) => {
            return item.name.includes(text)
        }
        const onCreate = () => {
            createOneAndUpdateStore({ name: 'new survey' })
        }
        const onEdit = (items) => {
            if (Array.isArray(items)) {
                items.forEach((item) => {
                    router.push({
                        name: 'survey',
                        params: { id: item.id },
                    })
                })
            } else if (typeof items === 'object') {
                router.push({ name: 'surveySteps', params: { id: items.id } })
            }
        }
        const onDelete = (items) => {
            if (Array.isArray(items)) {
                items.forEach((item) => {
                    deleteOneAndUpdateStore(item)
                })
            } else if (typeof items === 'object') {
                deleteOneAndUpdateStore(items)
            }
        }

        getAllAndUpdateStore()
        return {
            surveys,
            itemTitleSelector,
            textFilter,
            onCreate,
            onEdit,
            onDelete,
            getAllAndUpdateStore,
        }
    },
}
</script>

<style></style>

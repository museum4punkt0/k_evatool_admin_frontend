<template>
    <Collection
        title="surveys"
        :items="surveys"
        :text-filter="textFilter"
        :item-title-selector="selectors.itemTitle"
        :on-refresh="handlers.onRefresh"
        :on-create="handlers.onCreate"
        :on-edit="handlers.onEdit"
        :on-delete="handlers.onDelete"
    ></Collection>
</template>

<script>
import { useRouter } from 'vue-router'
import { createNamespacedHelpers } from 'vuex-composition-helpers'
import Collection from '../Collection/Collection.vue'

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
                router.push({
                    name: 'survey',
                    params: { id: items.id },
                })
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
            textFilter,
            selectors: {
                itemTitle: (item) => item.name,
            },
            handlers: {
                onRefresh: getAllAndUpdateStore,
                onCreate,
                onEdit,
                onDelete,
            },
        }
    },
}
</script>

<style></style>

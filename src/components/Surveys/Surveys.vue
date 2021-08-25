<template>
    <Collection
        :title="$t('survey')"
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
            textFilter: (item, text) =>
                item.name.toLowerCase().includes(text.toLowerCase()),
            selectors: {
                itemTitle: (item) => item.name,
            },
            handlers: {
                onRefresh: getAllAndUpdateStore,
                onCreate: () =>
                    router.push({
                        name: 'surveys/new',
                    }),
                onEdit,
                onDelete,
            },
        }
    },
}
</script>

<style></style>

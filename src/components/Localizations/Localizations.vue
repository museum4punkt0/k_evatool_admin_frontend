<template>
    <Collection
        :title="$t('localization')"
        :items="localizations"
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
import Collection from '../Common/Collection/Collection.vue'

const { useState, useActions } = createNamespacedHelpers('localizations')

export default {
    components: {
        Collection,
    },
    setup(props) {
        const router = useRouter()
        const { localizations } = useState(['localizations'])
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
            return true
        }
        const onEdit = (items) => {
            if (Array.isArray(items)) {
                items.forEach((item) => {
                    router.push({
                        name: 'localization',
                        params: { id: item.id },
                    })
                })
            } else if (typeof items === 'object') {
                router.push({ name: 'localization', params: { id: items.id } })
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
            localizations,
            textFilter,
            selectors: {
                itemTitle: (item) => {
                    return `${item.field}: ${item.value}`
                },
            },
            handlers: {
                onRefresh: getAllAndUpdateStore,
                onCreate: () => router.push({ name: 'localization/new' }),
                onEdit,
                onDelete,
            },
        }
    },
}
</script>

<style></style>

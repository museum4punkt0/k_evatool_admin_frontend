<template>
    <Collection
        :title="$t('message.language')"
        :items="languages"
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
import Collection from '../collection/Collection.vue'

const { useState, useActions } = createNamespacedHelpers('languages')

export default {
    components: {
        Collection,
    },
    setup(props) {
        const router = useRouter()
        const { languages } = useState(['languages'])
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
            return (
                item.code.includes(text) ||
                item.sub_code.includes(text) ||
                item.title.includes(text)
            )
        }
        const onCreate = () => {
            createOneAndUpdateStore({
                code: 'de',
                sub_code: 'de_DE',
                title: 'new language',
                default: false,
                published: true,
            })
        }
        const onEdit = (items) => {
            if (Array.isArray(items)) {
                items.forEach((item) => {
                    router.push({
                        name: 'language',
                        params: { id: item.id },
                    })
                })
            } else if (typeof items === 'object') {
                router.push({ name: 'language', params: { id: items.id } })
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
            languages,
            textFilter,
            selectors: {
                itemTitle: (item) => {
                    return `${item.title} (${item.code}, ${item.sub_code})`
                },
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

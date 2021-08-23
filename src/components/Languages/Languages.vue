<template>
    <Collection
        :title="$t('message.language')"
        :item-title-selector="itemTitleSelector"
        :items="languages"
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
        const itemTitleSelector = (item) => {
            return `${item.title} (${item.code}, ${item.sub_code})`
        }
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

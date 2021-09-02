<template>
    <Collection
        :title="$t('language')"
        :items="languages"
        :text-filter="textFilter"
        :item-title-selector="selectors.itemTitle"
        :on-refresh="handlers.onRefresh"
        :on-new="handlers.onNew"
        :on-view="handlers.onView"
        :on-edit="handlers.onEdit"
        :on-delete="handlers.onDelete"
    ></Collection>
</template>

<script>
import { useRouter } from 'vue-router'
import { createNamespacedHelpers } from 'vuex-composition-helpers'
import Collection from '../Common/Collection/Collection.vue'

const { useState, useActions } = createNamespacedHelpers('languages')

export default {
    components: {
        Collection,
    },
    setup() {
        const router = useRouter()
        const { languages } = useState(['languages'])
        const {
            getAllLanguagesAndUpdateStore,
            deleteOneLanguageAndUpdateStore,
        } = useActions([
            'getAllLanguagesAndUpdateStore',
            'deleteOneLanguageAndUpdateStore',
        ])
        const textFilter = (item, text) => {
            return (
                item.code.toLowerCase().includes(text.toLowerCase()) ||
                item.sub_code.toLowerCase().includes(text.toLowerCase()) ||
                item.title.toLowerCase().includes(text.toLowerCase())
            )
        }
        const onView = (items) => {
            if (Array.isArray(items)) {
                items.forEach((item) => {
                    router.push({
                        name: 'language/view',
                        params: { id: item.id },
                    })
                })
            } else if (typeof items === 'object') {
                router.push({ name: 'language/view', params: { id: items.id } })
            }
        }
        const onEdit = (items) => {
            if (Array.isArray(items)) {
                items.forEach((item) => {
                    router.push({
                        name: 'language/edit',
                        params: { id: item.id },
                    })
                })
            } else if (typeof items === 'object') {
                router.push({ name: 'language/edit', params: { id: items.id } })
            }
        }
        const onDelete = (items) => {
            if (Array.isArray(items)) {
                items.forEach((item) => {
                    deleteOneLanguageAndUpdateStore(item)
                })
            } else if (typeof items === 'object') {
                deleteOneLanguageAndUpdateStore(items)
            }
        }

        getAllLanguagesAndUpdateStore()
        return {
            languages,
            textFilter,
            selectors: {
                itemTitle: (item) => {
                    return `${item.title} (${item.code}, ${item.sub_code})`
                },
            },
            handlers: {
                onRefresh: getAllLanguagesAndUpdateStore,
                onNew: () => router.push({ name: 'languages/new' }),
                onView,
                onEdit,
                onDelete,
            },
        }
    },
}
</script>

<style></style>

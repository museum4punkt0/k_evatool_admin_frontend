<template>
    <div class="flex-1 flex items-stretch overflow-hidden">
        <main class="flex-1 overflow-y-auto p-3">
            <h1 class="mb-3">{{ $tc('languages', 2) }}</h1>
            <div class="table-wrap">
                <table class="table-fixed">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Code</th>
                            <th>Subcode</th>
                            <th>{{ $t('language_default') }}</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="language in languages" :key="language.id">
                            <td>{{ language.id }}</td>
                            <td>{{ language.code }}</td>
                            <td>{{ language.subCode }}</td>
                            <td class="text-center">
                                <CheckIcon
                                    v-if="language.default"
                                    class="h-5 w-5"
                                />
                            </td>
                            <td>
                                <published-state
                                    :published="language.published"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </main>
    </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { createNamespacedHelpers } from 'vuex-composition-helpers'
import Collection from '../Common/Collection/Collection.vue'
import PublishedState from '../Common/PublishedState.vue'
import { CheckIcon } from '@heroicons/vue/outline'

const { useState, useActions } = createNamespacedHelpers('languages')

export default {
    components: {
        PublishedState,
        Collection,
        CheckIcon,
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

<template>
    <Collection
        :title="$t('survey steps')"
        :items="surveySteps"
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

const { useState, useActions } = createNamespacedHelpers('surveySteps')

export default {
    components: {
        Collection,
    },
    setup(props) {
        const router = useRouter()
        const { surveySteps } = useState(['surveySteps'])
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
                        name: 'surveyStep',
                        params: { id: item.id },
                    })
                })
            } else if (typeof items === 'object') {
                router.push({ name: 'surveyStep', params: { id: items.id } })
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
            surveySteps,
            textFilter: (item, text) => item.name.includes(text),
            selectors: {
                itemTitle: (item) =>
                    `${item.survey_id} - ${item.survey_element_id}`,
            },
            handlers: {
                onRefresh: getAllAndUpdateStore,
                onCreate: () =>
                    router.push({
                        name: 'surveySteps/new',
                    }),
                onEdit,
                onDelete,
            },
        }
    },
}
</script>

<style></style>

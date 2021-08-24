<template>
    <Record
        v-if="selectedSurvey"
        :data="selectedSurvey"
        :title-selector="selectors.title"
        :on-delete="handlers.onDelete"
    >
        <ul>
            <li>
                <input v-model.lazy="selectedSurvey.name" @change="update" />
            </li>
            <li>
                <input
                    v-model.lazy="selectedSurvey.description"
                    @change="update"
                />
            </li>
        </ul>
    </Record>
</template>

<script>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
import { createNamespacedHelpers } from 'vuex-composition-helpers'
import Record from '../Record/Record.vue'

const { useState, useActions } = createNamespacedHelpers('surveys')

export default {
    components: {
        Record,
    },
    setup(props) {
        const id = ref()
        const route = useRoute()
        const { selectedSurvey } = useState(['selectedSurvey'])
        const {
            selectOneAndUpdateStore,
            updateSelectedAndUpdateStore,
            deleteSelectedAndUpdateStore,
        } = useActions([
            'selectOneAndUpdateStore',
            'updateSelectedAndUpdateStore',
            'deleteSelectedAndUpdateStore',
        ])

        const update = () => {
            updateSelectedAndUpdateStore({
                id: selectedSurvey.value.id,
                data: selectedSurvey.value,
            })
        }

        onBeforeRouteUpdate(async (to, from) => {
            if (to.params.id !== from.params.id) {
                id.value = to.params.id
                selectOneAndUpdateStore(id.value)
            }
        })
        id.value = route.params.id
        selectOneAndUpdateStore({ id: id.value })
        watch(
            () => route.params.id,
            (newId) => {
                id.value = newId
                selectOneAndUpdateStore({ id: newId })
            },
        )
        return {
            id,
            selectedSurvey,
            selectors: {
                title: (item) => item.name,
            },
            handlers: {
                onDelete: (item) => {
                    deleteSelectedAndUpdateStore()
                },
            },
            update,
        }
    },
}
</script>

<style></style>

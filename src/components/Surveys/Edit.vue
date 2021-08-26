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
        <router-view></router-view>
    </Record>
</template>

<script>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
import { createNamespacedHelpers } from 'vuex-composition-helpers'
import Record from '../Common/Record.vue'

const { useState, useActions } = createNamespacedHelpers('surveys')

export default {
    components: {
        Record,
    },
    setup(props) {
        const id = ref()
        const route = useRoute()
        const router = useRouter()
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
            if (to.params.id !== from.params.id && to.params.id) {
                id.value = to.params.id
                selectOneAndUpdateStore(id.value)
            }
        })
        watch(
            () => route.params.id,
            (newId) => {
                id.value = newId
                if (id.value) {
                    selectOneAndUpdateStore({ id: newId })
                }
            },
        )
        id.value = route.params.id
        if (id.value) {
            selectOneAndUpdateStore({ id: id.value })
        }
        return {
            id,
            selectedSurvey,
            selectors: {
                title: (item) => item.name,
            },
            handlers: {
                onDelete: (item) => {
                    deleteSelectedAndUpdateStore(item)
                    // TODO: wait for promise to resolve
                    router.push({
                        name: 'surveys',
                    })
                },
            },
            update,
        }
    },
}
</script>

<style></style>

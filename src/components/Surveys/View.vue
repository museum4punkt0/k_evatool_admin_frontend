<template>
    <Record
        v-if="selectedSurvey"
        :data="selectedSurvey"
        :title-selector="selectors.title"
        :on-delete="handlers.onDelete"
        :on-edit="handlers.onEdit"
    >
        <template #toolbar>
            <Button @click="handlers.onShowResults(selectedSurvey)">
                results
            </Button>
        </template>
        <ul>
            <li>
                {{ selectedSurvey.name }}
            </li>
            <li>
                {{ selectedSurvey.description }}
            </li>
        </ul>

        <h4>TODO: steps view</h4>
        <ul>
            <li v-for="step in selectedSurvey.steps" :key="step.id">
                id: {{ step.id }} - element id: {{ step.survey_element_id }}
            </li>
        </ul>
    </Record>
</template>

<script>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
import { createNamespacedHelpers } from 'vuex-composition-helpers'
import Record from '../Common/Record.vue'
import Button from '../Common/Button'

const { useState, useActions } = createNamespacedHelpers('surveys')

export default {
    components: {
        Button,
        Record,
    },
    setup(props) {
        const id = ref()
        const route = useRoute()
        const router = useRouter()
        const { selectedSurvey } = useState(['selectedSurvey'])
        const { getOneSelectAndUpdateStore, deleteOneSelectAndUpdateStore } =
            useActions([
                'getOneSelectAndUpdateStore',
                'deleteOneSelectAndUpdateStore',
            ])

        onBeforeRouteUpdate(async (to, from) => {
            if (to.params.id !== from.params.id && to.params.id) {
                id.value = to.params.id
                getOneSelectAndUpdateStore(id.value)
            }
        })
        watch(
            () => route.params.id,
            (newId) => {
                id.value = newId
                if (id.value) {
                    getOneSelectAndUpdateStore({ id: newId })
                }
            },
        )
        id.value = route.params.id
        if (id.value) {
            getOneSelectAndUpdateStore({ id: id.value })
        }
        return {
            id,
            selectedSurvey,
            selectors: {
                title: (item) => item.name,
            },
            handlers: {
                onEdit: (item) => {
                    router.push({
                        name: 'survey/edit',
                        params: { id: item.id },
                    })
                },
                onDelete: (item) => {
                    deleteOneSelectAndUpdateStore(item)
                    // TODO: wait for promise to resolve
                    router.push({
                        name: 'surveys',
                    })
                },
                onShowResults: (item) => {
                    router.push({
                        name: 'survey/results',
                        params: { id: item.id },
                    })
                },
            },
        }
    },
}
</script>

<style></style>

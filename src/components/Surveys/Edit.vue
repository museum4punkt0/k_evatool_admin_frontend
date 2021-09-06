<template>
    <div class="flex-1 flex items-stretch overflow-hidden">
        <main class="flex-1 overflow-y-auto p-3">
            <Record
                v-if="selectedSurvey"
                :data="selectedSurvey"
                :title-selector="selectors.title"
                :on-delete="handlers.onDelete"
            >
                <template #toolbar>
                    <Button @click="handlers.onShowResults(selectedSurvey)">
                        results
                    </Button>
                </template>
                <ul>
                    <li>
                        <input
                            v-model.lazy="selectedSurvey.name"
                            @change="update"
                        />
                    </li>
                    <li>
                        <input
                            v-model.lazy="selectedSurvey.description"
                            @change="update"
                        />
                    </li>
                </ul>
                <NodeEditor :nodes="selectedSurvey.steps" />
            </Record>
        </main>
        <aside
            class="
                hidden
                w-96
                bg-white
                border-l border-gray-200
                overflow-y-auto
                lg:block
                p-3
            "
        >
            <survey-step />
        </aside>
    </div>
</template>

<script>
import { ref, watch, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { onBeforeRouteUpdate } from 'vue-router'
import Button from '../Common/Button.js'
import Record from '../Common/Record.vue'
import NodeEditor from '../NodeEditor/NodeEditor.vue'
import SurveyStep from './SurveyStep.vue'

export default {
    components: {
        SurveyStep,
        Button,
        Record,
        NodeEditor,
    },
    setup() {
        const id = ref()
        const route = useRoute()
        const router = useRouter()
        const store = useStore()
        const selectedSurvey = computed(
            () => store.state.surveys.selectedSurvey,
        )

        const update = () => {
            store.dispatch('surveys/updateOneSelectAndUpdateStore', {
                id: selectedSurvey.value.id,
                data: selectedSurvey.value,
            })
        }

        onBeforeRouteUpdate(async (to, from) => {
            if (to.params.id !== from.params.id && to.params.id) {
                id.value = to.params.id
                store.dispatch('surveys/getOneSelectAndUpdateStore', id.value)
            }
        })
        watch(
            () => route.params.id,
            (newId) => {
                id.value = newId
                if (id.value) {
                    store.dispatch('surveys/getOneSelectAndUpdateStore', {
                        id: newId,
                    })
                }
            },
        )
        id.value = route.params.id
        if (id.value) {
            store.dispatch('surveys/getOneSelectAndUpdateStore', {
                id: id.value,
            })
        }
        return {
            id,
            selectedSurvey,
            selectors: {
                title: (item) => item.name,
            },
            handlers: {
                onDelete: (item) => {
                    store
                        .dispatch('surveys/deleteOneSelectAndUpdateStore', item)
                        .then(() => {
                            router.push({
                                name: 'surveys',
                            })
                        })
                        .catch((error) => {
                            store.dispatch('notifications/addError', {
                                message: error,
                            })
                        })
                },
                onShowResults: (item) => {
                    router.push({
                        name: 'survey/results',
                        params: { id: item.id },
                    })
                },
            },
            nodeComponent: Node,
            update,
        }
    },
}
</script>

<style></style>

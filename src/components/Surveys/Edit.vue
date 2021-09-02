<template>
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
                <input v-model.lazy="selectedSurvey.name" @change="update" />
            </li>
            <li>
                <input
                    v-model.lazy="selectedSurvey.description"
                    @change="update"
                />
            </li>
        </ul>
        <NodeEditor
            :nodes="selectedSurvey.steps"
            :node-component="nodeComponent"
            :get-inlets-for-node="getInletsForNode"
            :get-outlets-for-node="getOutletsForNode"
        />
        <router-view></router-view>
    </Record>
</template>

<script>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { onBeforeRouteUpdate } from 'vue-router'
import { createNamespacedHelpers } from 'vuex-composition-helpers'
import Button from '../Common/Button.js'
import Record from '../Common/Record.vue'
import NodeEditor from '../NodeEditor/NodeEditor.vue'
import Node from './NodeContent.vue'

const { useState, useActions } = createNamespacedHelpers('surveys')
const { useActions: useNotificationsActions } =
    createNamespacedHelpers('notifications')

export default {
    components: {
        Button,
        Record,
        NodeEditor,
        Node,
    },
    setup() {
        const id = ref()
        const route = useRoute()
        const router = useRouter()
        const { selectedSurvey } = useState(['selectedSurvey'])
        const {
            getOneSelectAndUpdateStore,
            updateOneSelectAndUpdateStore,
            deleteOneSelectAndUpdateStore,
        } = useActions([
            'getOneSelectAndUpdateStore',
            'updateOneSelectAndUpdateStore',
            'deleteOneSelectAndUpdateStore',
        ])
        const { addError } = useNotificationsActions(['addError'])

        const update = () => {
            updateOneSelectAndUpdateStore({
                id: selectedSurvey.value.id,
                data: selectedSurvey.value,
            })
        }

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
                onDelete: (item) => {
                    deleteOneSelectAndUpdateStore(item)
                        .then(() => {
                            router.push({
                                name: 'surveys',
                            })
                        })
                        .catch((error) => {
                            addError({ message: error })
                        })
                },
                onShowResults: (item) => {
                    router.push({
                        name: 'survey/results',
                        params: { id: item.id },
                    })
                },
            },
            getInletsForNode: () => [{ name: 'in' }],
            getOutletsForNode: (node) => {
                console.log(node)
                const outlets = [{ name: 'out1' }, { name: 'out2' }]
                return outlets
            },
            nodeComponent: Node,
            update,
        }
    },
}
</script>

<style></style>

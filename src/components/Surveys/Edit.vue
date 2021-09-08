<template>
    <div class="flex-1 flex items-stretch overflow-hidden">
        <main class="flex-1 overflow-y-auto p-3">
            <div class="flex mb-3 justify-between items-center">
                <h1>
                    {{ $tc('surveys', 1) }}:
                    <strong>{{ selectedSurvey.name }}</strong>
                </h1>
                <button class="primary" @click="newSurveyStep">
                    {{ $t('action_add_survey_step') }}
                </button>
            </div>
            <NodeEditor ref="nodeEditor" :nodes="selectedSurvey.steps" />
        </main>
        <aside>
            <survey-step v-if="store.state.surveys.selectedSurveyStepId >= 0" />
            <survey-details
                v-else
                :survey-id="surveyId"
                :reset-after-save="false"
                @saved="surveySaved"
            />
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
import SurveyDetails from './SurveyDetails.vue'

export default {
    components: {
        SurveyDetails,
        SurveyStep,
        Button,
        Record,
        NodeEditor,
    },
    setup() {
        const id = ref()
        const nodeEditor = ref(null)
        const route = useRoute()
        const router = useRouter()
        const store = useStore()
        const surveyId = ref(route.params.id)
        const selectedSurvey = computed(
            () => store.state.surveys.selectedSurvey,
        )

        const update = () => {
            store.dispatch('surveys/updateOneSelectAndUpdateStore', {
                id: selectedSurvey.value.id,
                data: selectedSurvey.value,
            })
        }

        const surveySaved = () => {
            store.dispatch('surveys/getOneSelectAndUpdateStore', {
                id: surveyId.value,
            })
        }

        const newSurveyStep = () => {
            store.dispatch('surveys/setSurveyStepId', 0)
        }

        onBeforeRouteUpdate(async (to, from) => {
            if (to.params.id !== from.params.id && to.params.id) {
                id.value = to.params.id
                console.log('get one survey select and update store')
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
            nodeEditor,
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
                onScroll: () => {
                    nodeEditor.value.updateConnections()
                },
            },
            nodeComponent: Node,
            update,
            store,
            surveyId,
            surveySaved,
            newSurveyStep,
        }
    },
}
</script>

<style></style>

<template>
    <div class="flex-1 flex items-stretch overflow-hidden">
        <main ref="container" class="flex-1 overflow-y-auto p-3">
            <div class="flex mb-3 justify-between items-center">
                <h1>
                    {{ t('surveys', 1) }}:
                    <strong>{{ survey?.name }}</strong>
                </h1>
                <button class="primary" @click="newSurveyStep">
                    {{ t('action_add_survey_step') }}
                </button>
            </div>

            <node-editor
                v-if="survey?.steps"
                :steps="survey.steps"
                :admin-layout="survey.adminLayout"
                :survey-id="surveyId"
            />
        </main>
        <aside>
            <survey-step
                v-if="store.state.surveys.surveyStepId >= 0"
                @saved="surveySaved"
            />
            <template v-else>
                <survey-details
                    :survey-id="surveyId"
                    :reset-after-save="false"
                    @saved="surveySaved"
                />
                <hr class="mt-4 mb-3" />
                <survey-element />
            </template>
        </aside>
    </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import Button from '../Common/Button.js'
import Record from '../Common/Record.vue'
import SurveyStep from './SurveyStep.vue'
import SurveyDetails from './SurveyDetails.vue'
import NodeEditor from '../NodeEditor/NodeEditor.vue'
import TimeBasedStepsModal from './TimeBasedStepsModal.vue'
import SurveyElement from './SurveyElement.vue'
import { useI18n } from 'vue-i18n'

export default {
    components: {
        SurveyElement,
        TimeBasedStepsModal,
        SurveyDetails,
        SurveyStep,
        Button,
        Record,
        NodeEditor,
    },
    setup() {
        const id = ref()
        const { t } = useI18n()
        const nodeEditor = ref(null)
        const route = useRoute()
        const store = useStore()
        const surveyId = ref(parseInt(route.params.id))
        const survey = computed(() => store.state.surveys.survey)
        const container = ref(null)

        onMounted(() => {
            store.dispatch('surveys/setSurveyId', surveyId.value)
            container.value.addEventListener('scroll', onScroll)
        })

        onBeforeUnmount(() => {
            container.value.removeEventListener('scroll', onScroll)
        })

        const newSurveyStep = () => {
            store.dispatch('surveys/setSurveyStepId', {
                surveyId: surveyId.value,
                surveyStepId: 0,
            })
        }

        const surveySaved = () => {
            store.dispatch('surveys/getSurveySteps', surveyId.value)
        }

        const onScroll = () => {}

        return {
            id,
            container,
            nodeEditor,
            survey,
            nodeComponent: Node,
            store,
            surveyId,
            newSurveyStep,
            t,
            surveySaved,
        }
    },
}
</script>

<style></style>

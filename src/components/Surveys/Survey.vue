<template>
    <div class="flex-1 flex items-stretch overflow-hidden">
        <main ref="container" class="flex-1 overflow-y-auto p-3">
            <div class="flex mb-3 justify-between items-center">
                <h1>
                    {{ t('surveys', 1) }}:
                    <strong>{{ survey?.name }}</strong>
                </h1>
                <div class="justify-between items-center flex">
                    <button
                        class="primary mr-1"
                        :disabled="store.state.surveys.surveyStep"
                        @click.prevent.stop="previewSurvey(survey.id)"
                    >
                        <EyeIcon class="h-5 w-5 mr-2 pointer" />
                        {{ t('action_open_preview') }}
                    </button>
                    <button
                        class="primary"
                        :disabled="store.state.surveys.surveyStep"
                        @click="newSurveyStep"
                    >
                        {{ t('action_add_survey_step') }}
                    </button>
                </div>
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
                @deleted="surveyStepDeleted"
            />
            <template v-else>
                <survey-details
                    :survey-id="surveyId"
                    :reset-after-save="false"
                    @saved="surveySaved"
                />
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
import { EyeIcon } from '@heroicons/vue/outline'

export default {
    components: {
        SurveyElement,
        TimeBasedStepsModal,
        SurveyDetails,
        SurveyStep,
        Button,
        Record,
        NodeEditor,
        EyeIcon,
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

        const surveyStepDeleted = () => {
            store.dispatch('surveys/getSurvey', surveyId.value)
            store.dispatch('surveys/getSurveySteps', surveyId.value)
            store.dispatch('surveys/resetSurveyStep')
        }

        const onScroll = () => {}
        const previewSurvey = (surveyIdPreview) => {
            window
                .open(
                    import.meta.env.VITE_PREVIEW_URL +
                        '/#/?id=' +
                        surveyIdPreview +
                        '&demo=true',
                    '_blank',
                )
                .focus()
        }

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
            surveyStepDeleted,
            previewSurvey,
        }
    },
}
</script>

<style></style>

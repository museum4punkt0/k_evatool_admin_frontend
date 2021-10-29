<template>
    <div class="flex-1 flex items-stretch overflow-hidden">
        <main ref="container" class="flex-1 overflow-y-auto p-3">
            <div class="flex mb-3 items-center">
                <h1>
                    {{ t('surveys', 1) }}:
                    <strong>
                        {{ survey?.name }}
                    </strong>
                </h1>
                <PencilIcon
                    class="h-5 w-5 ml-5"
                    @click="setShowSurveyDetailsEdit(!showSurveyDetailsEdit)"
                />
                <div class="flex-grow items-center flex flex-row-reverse">
                    <button class="secondary mr-1">
                        <ChartBarIcon class="mx-1 h-5 w-5 pointer" />
                        {{ t('action_show_results') }}
                    </button>
                    <button
                        class="secondary mr-1"
                        :disabled="store.state.surveys.surveyStep"
                        @click.prevent.stop="previewSurvey(survey)"
                    >
                        <EyeIcon class="h-5 w-5 mr-2 pointer" />
                        {{ t('action_open_preview') }}
                    </button>
                    <!-- <button
                        class="primary"
                        :disabled="store.state.surveys.surveyStep"
                        @click="newSurveyStep"
                    >
                        {{ t('action_add_survey_step') }}
                    </button> -->
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
            <survey-details
                v-if="showSurveyDetailsEdit"
                :survey-id="surveyId"
                :reset-after-save="false"
                @saved="surveySaved"
                @cancel="setShowSurveyDetailsEdit(false)"
            />
            <survey-element
                v-else-if="store.state.surveyElements.surveyElement"
                :survey-element-id="
                    store.state.surveyElements.surveyElement?.id
                "
                @saved="store.dispatch('surveyElements/setSurveyElement', null)"
                @cancel="
                    store.dispatch('surveyElements/setSurveyElement', null)
                "
            ></survey-element>
            <survey-step
                v-else-if="store.state.surveys.surveyStepId >= 0"
                @saved="surveySaved"
                @deleted="surveyStepDeleted"
                @cancel="store.dispatch('surveys/unsetSurveyStepId')"
            />
            <node-browser v-else></node-browser>
        </aside>
    </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { useState } from '../../composables/state'
import Button from '../Common/Button.js'
import Record from '../Common/Record.vue'
import SurveyElement from './SurveyElement.vue'
import SurveyStep from './SurveyStep.vue'
import SurveyDetails from './SurveyDetails.vue'
import NodeEditor from '../NodeEditor/NodeEditor.vue'
import NodeBrowser from '../NodeEditor/NodeBrowser.vue'
import TimeBasedStepsModal from './TimeBasedStepsModal.vue'
import { useI18n } from 'vue-i18n'
import { ChartBarIcon, EyeIcon, PencilIcon } from '@heroicons/vue/outline'

export default {
    components: {
        ChartBarIcon,
        SurveyElement,
        TimeBasedStepsModal,
        SurveyDetails,
        SurveyStep,
        Button,
        Record,
        NodeEditor,
        NodeBrowser,
        EyeIcon,
        PencilIcon,
    },
    setup() {
        const id = ref()
        const { t } = useI18n()
        const nodeEditor = ref(null)
        const route = useRoute()
        const store = useStore()
        const [showSurveyDetailsEdit, setShowSurveyDetailsEdit] =
            useState(false)
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
            setShowSurveyDetailsEdit(false)
        }

        const surveyStepDeleted = () => {
            store.dispatch('surveys/getSurvey', surveyId.value)
            store.dispatch('surveys/getSurveySteps', surveyId.value)
            store.dispatch('surveys/resetSurveyStep')
        }

        const onScroll = () => {}
        const previewSurvey = (surveyPreview) => {
            window
                .open(
                    import.meta.env.VITE_PREVIEW_URL +
                        '/#/?survey_id=' +
                        surveyPreview.slug +
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
            showSurveyDetailsEdit,
            setShowSurveyDetailsEdit,
        }
    },
}
</script>

<style></style>

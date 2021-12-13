<template>
    <div class="flex-1 flex items-stretch overflow-hidden">
        <main ref="container" class="flex flex-1 flex-col overflow-y-auto p-3">
            <div class="flex mb-3 items-center">
                <div flex flex-column>
                    <h1>
                        {{ t('surveys', 1) }}:
                        <strong>
                            {{ survey?.name }}
                        </strong>
                    </h1>

                    <span class="text-xs text-gray-500 mr-1">
                        {{ `${previewUrl}/#/?survey=${survey?.slug}` }}
                    </span>
                </div>
                <div class="flex-grow items-center flex justify-end">
                    <button class="secondary mr-1">
                        <PencilIcon
                            class="h-5 w-5"
                            @click="
                                setShowSurveyDetailsEdit(!showSurveyDetailsEdit)
                            "
                        />
                    </button>
                    <button
                        class="secondary mr-1"
                        @click.prevent.stop="copyLiveLinkToClipboard"
                    >
                        <clipboard-copy-icon
                            class="h-5 w-5 mr-2 pointer"
                            @click="
                                setShowSurveyDetailsEdit(!showSurveyDetailsEdit)
                            "
                        />
                        {{ t('action_copy_live_link') }}
                    </button>
                    <button
                        class="secondary mr-1"
                        @click.prevent.stop="showSurveyResults(survey)"
                    >
                        <ChartBarIcon class="mx-1 h-5 w-5 pointer" />
                        {{ t('action_show_results') }}
                    </button>
                    <button
                        class="secondary mr-1"
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
import { useRoute, useRouter } from 'vue-router'
import { useState } from '../../composables/state'
import SurveyElement from './SurveyElement.vue'
import SurveyStep from './SurveyStep.vue'
import SurveyDetails from './SurveyDetails.vue'
import NodeEditor from '../NodeEditor/NodeEditor.vue'
import NodeBrowser from '../NodeEditor/NodeBrowser.vue'
import TimeBasedStepsModal from './TimeBasedStepsModal.vue'
import { useI18n } from 'vue-i18n'
import {
    ChartBarIcon,
    EyeIcon,
    PencilIcon,
    ClipboardCopyIcon,
} from '@heroicons/vue/outline'
import { TYPES as NOTIFICATIONTYPES } from '../../store/notifications'

export default {
    components: {
        ChartBarIcon,
        SurveyElement,
        TimeBasedStepsModal,
        SurveyDetails,
        SurveyStep,
        NodeEditor,
        NodeBrowser,
        EyeIcon,
        ClipboardCopyIcon,
        PencilIcon,
    },
    setup() {
        const id = ref()
        const { t } = useI18n()
        const nodeEditor = ref(null)
        const route = useRoute()
        const router = useRouter()
        const store = useStore()
        const [showSurveyDetailsEdit, setShowSurveyDetailsEdit] =
            useState(false)
        const surveyId = ref(parseInt(route.params.id))
        const survey = computed(() => store.state.surveys.survey)
        const container = ref(null)

        const previewUrl = `${import.meta.env.VITE_PREVIEW_URL}`

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
                    `
                    ${import.meta.env.VITE_PREVIEW_URL}/#/?survey=${
                        surveyPreview.slug
                    }&demo=true
                `,
                    '_blank',
                )
                .focus()
        }
        const showSurveyResults = (survey) => {
            router.push(`/stats/${survey.id}`)
        }

        const copyLiveLinkToClipboard = () => {
            const text = `${import.meta.env.VITE_PREVIEW_URL}/#/?survey=${
                survey.value.slug
            }`
            navigator.clipboard.writeText(text).then(
                function () {
                    store.dispatch('notifications/add', {
                        type: NOTIFICATIONTYPES.SUCCESS,
                        message: 'notification_success_survey_link_copied',
                    })
                },
                function (err) {
                    console.error('Async: Could not copy text: ', err)
                },
            )
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
            showSurveyResults,
            showSurveyDetailsEdit,
            setShowSurveyDetailsEdit,
            copyLiveLinkToClipboard,
            previewUrl,
        }
    },
}
</script>

<style></style>

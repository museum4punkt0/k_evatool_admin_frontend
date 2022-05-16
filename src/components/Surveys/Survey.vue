<template>
    <div class="flex-1 flex items-stretch overflow-hidden">
        <main
            ref="container"
            class="flex flex-1 flex-col overflow-y-hidden p-3"
        >
            <div class="flex mb-3 items-center">
                <div class="flex flex-column">
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
                    <button
                        v-tippy="{
                            content: t('action_edit_survey_meta'),
                        }"
                        class="secondary mr-1"
                        @click="
                            setShowSurveyDetailsEdit(!showSurveyDetailsEdit)
                        "
                    >
                        <PencilIcon class="h-5 w-5" />
                    </button>
                    <button
                        v-tippy="{
                            content: t('action_copy_live_link'),
                        }"
                        class="secondary mr-1"
                        @click.prevent.stop="copyLiveLinkToClipboard"
                    >
                        <clipboard-copy-icon
                            class="h-5 w-5 pointer"
                            @click="
                                setShowSurveyDetailsEdit(!showSurveyDetailsEdit)
                            "
                        />
                    </button>
                    <button
                        v-tippy="{
                            content: t('action_show_results'),
                        }"
                        class="secondary mr-1"
                        @click.prevent.stop="showSurveyResults(survey)"
                    >
                        <ChartBarIcon class="h-5 w-5 pointer" />
                    </button>
                    <button
                        v-tippy="{
                            content: t('action_open_preview'),
                        }"
                        class="secondary mr-1"
                        @click.prevent.stop="previewSurvey(survey)"
                    >
                        <EyeIcon class="h-5 w-5 pointer" />
                    </button>
                    <button
                        v-tippy="{
                            content: t('archive'),
                        }"
                        :class="archived ? 'primary' : 'secondary'"
                        class="mr-1"
                        @click.prevent.stop="archive(survey.id)"
                    >
                        <ArchiveIcon class="h-5 w-5 pointer" />
                    </button>
                    <!--FormToggle
                        label="archive"
                        :enabled="Boolean(archived)"
                        @click="archive(survey.id)"
                    /-->
                </div>
            </div>

            <div class="w-full h-full relative">
                <!--p
                    v-if="archived && noteIsOpen"
                    class="absolute z-10 inline-flex bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-20 justify-center items-center bg-white rounded-lg mb-10 border-black border-2"
                    @click="noteIsOpen = false"
                >
                    {{ $t('archive_no_edit') }}
                </p-->
                <node-editor
                    v-if="survey?.steps"
                    :steps="survey.steps"
                    :archived="Boolean(archived)"
                    :admin-layout="survey.adminLayout"
                    :survey-id="surveyId"
                />
            </div>
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
    ArchiveIcon,
} from '@heroicons/vue/outline'
import { TYPES as NOTIFICATION_TYPES } from '../../store/notifications'
import FormToggle from '../Forms/FormToggle.vue'

export default {
    components: {
        FormToggle,
        ArchiveIcon,
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
        const noteIsOpen = ref(true)
        const archived = ref(null)

        const previewUrl = `${import.meta.env.VITE_PREVIEW_URL}`

        onMounted(async () => {
            await store.dispatch('surveys/setSurveyId', surveyId.value)
            container.value.addEventListener('scroll', onScroll)
            archived.value = survey.value.archived
        })

        onBeforeUnmount(() => {
            container.value.removeEventListener('scroll', onScroll)
        })

        const archive = async (surveyId) => {
            archived.value = !archived.value
            await store.dispatch('surveys/archiveSurvey', surveyId)
        }

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

        const surveyStepDeleted = async () => {
            await store.dispatch('surveys/getSurvey', surveyId.value)
            await store.dispatch('surveys/getSurveySteps', surveyId.value)
            await store.dispatch('surveys/resetSurveyStep')
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
                        type: NOTIFICATION_TYPES.SUCCESS,
                        message: 'notification_success_survey_link_copied',
                    })
                },
                function (err) {
                    console.error('Async: Could not copy text: ', err)
                },
            )
        }

        return {
            archived,
            id,
            container,
            nodeEditor,
            noteIsOpen,
            survey,
            nodeComponent: Node,
            store,
            surveyId,
            archive,
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

<style scoped></style>

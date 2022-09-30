<template>
    <tr
        :class="survey.archived && 'bg-blue-200'"
        @click.prevent.stop="editSurvey(survey.id)"
    >
        <td class="text-lg">
            {{ survey.id }}
        </td>
        <td>
            <div class="text text-gray-900">
                {{ survey.name }}
                <!--                                    <p
            v-if="store.state.users.user.admin"
            class="text-xs text-gray-500"
        >
            {{ survey.slug }}
        </p>-->
            </div>
            <div class="text-sm text-gray-500">
                {{ survey.description }}
            </div>
        </td>
        <td class="justify-center">
            <check-icon v-if="survey.singleStepAccess" class="h-5 w-5" />
        </td>
        <td>
            <published-state
                v-if="!survey.archived"
                class="pointer"
                :published="survey.published"
                @click.stop.prevent="publishSurvey(survey.id, survey.published)"
            />
        </td>
        <td>
            {{ survey.surveyStepsCount }}
        </td>
        <td>
            {{ survey.surveyResultsCount }} /
            {{ survey.surveyDemoResultsCount }}
        </td>
        <td class="px-6 py-4 flex flex-row">
            <PencilAltIcon
                class="mx-1 h-5 w-5 pointer"
                @click.prevent.stop="editSurvey(survey.id)"
            />
            <trash-icon
                class="mx-1 h-5 w-5"
                :class="
                    survey.surveyStepsCount > 0
                        ? 'text-gray-500 cursor-not-allowed'
                        : 'text-red-500 pointer'
                "
                @click.prevent.stop="deleteSurvey(survey)"
            />
            <EyeIcon
                class="mx-1 h-5 w-5 pointer"
                @click.prevent.stop="previewSurvey(survey)"
            />
            <!--            <DocumentDuplicateIcon
                v-if="store.state.users.user.role.includes('admin')"
                class="mx-1 h-5 w-5 pointer"
                @click.prevent.stop="duplicateSurvey(survey.id)"
            />-->
            <ChartBarIcon
                class="mx-1 h-5 w-5"
                :class="
                    survey.surveyResultsCount === 0
                        ? 'text-gray-500 cursor-not-allowed'
                        : 'pointer'
                "
                @click.prevent.stop="openSurveyStats(survey)"
            />
        </td>
    </tr>
</template>

<script>
import {
    TrashIcon,
    PencilAltIcon,
    EyeIcon,
    ChartBarIcon,
    CheckIcon,
} from '@heroicons/vue/outline'

import PublishedState from '../Common/PublishedState.vue'

import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

export default {
    name: 'SurveyRow',
    components: {
        CheckIcon,
        PublishedState,
        TrashIcon,
        EyeIcon,
        PencilAltIcon,
        ChartBarIcon,
    },
    props: {
        survey: {
            type: Object,
            required: true,
        },
    },
    setup() {
        const store = useStore()
        const router = useRouter()
        const { t } = useI18n()

        const isBusy = ref(false)

        const editSurvey = async (surveyId) => {
            await router.push('/surveys/' + surveyId)
        }

        const publishSurvey = async (surveyId, published) => {
            const confirmPublishOrUnpublish = published
                ? confirm(t('confirm_unpublish_survey'))
                : confirm(t('confirm_publish_survey'))
            if (confirmPublishOrUnpublish) {
                await store.dispatch('surveys/publishSurvey', surveyId)
            }
        }

        const deleteSurvey = async (survey) => {
            if (survey.surveyStepsCount === 0) {
                const confirmSurveyDelete = confirm(t('confirm_delete_survey'))
                isBusy.value = true
                if (confirmSurveyDelete) {
                    await store.dispatch('surveys/deleteSurvey', survey.id)
                }
                isBusy.value = false
            }
        }

        const previewSurvey = (surveyPreview) => {
            window
                .open(
                    import.meta.env.VITE_PREVIEW_URL +
                        '/#/?survey=' +
                        surveyPreview.slug +
                        '&demo=true',
                    '_blank',
                )
                .focus()
        }

        const duplicateSurvey = async (surveyId) => {
            const confirmSurveyDuplicate = confirm(
                t('confirm_duplicate_survey'),
            )

            if (confirmSurveyDuplicate) {
                await store.dispatch('surveys/duplicateSurvey', surveyId)
            }
        }

        const openSurveyStats = async (survey) => {
            if (survey.surveyResultsCount > 0) {
                await router.push('/stats/' + survey.id)
            }
        }

        return {
            isBusy,
            store,
            editSurvey,
            deleteSurvey,
            duplicateSurvey,
            openSurveyStats,
            previewSurvey,
            publishSurvey,
            t,
        }
    },
}
</script>

<style scoped></style>

<template>
    <div class="flex overflow-hidden">
        <main class="flex h-full w-full flex-col p-3">
            <div class="flex flex-row justify-between">
                <h1>
                    {{ surveys?.length }} {{ t('surveys', surveys?.length) }}
                </h1>
                <div class="flex-grow items-center flex flex-row-reverse">
                    <button
                        class="primary mr-1"
                        @click="
                            setShowSurveyDetailsEdit(!showSurveyDetailsEdit)
                        "
                    >
                        {{ t('new_survey') }}
                    </button>
                </div>
            </div>

            <div class="table-wrap mt-3">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>{{ t('names', 1) }}</th>
                            <th>Status</th>
                            <th>#&nbsp;{{ t('steps', 2) }}</th>
                            <th>
                                <span class="sr-only">Edit</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody
                        v-for="survey in surveys"
                        :key="'survey_row_' + survey.id"
                        class="bg-white divide-y divide-gray-200"
                    >
                        <tr @click.prevent.stop="editSurvey(survey.id)">
                            <td class="text-lg">
                                {{ survey.id }}
                            </td>
                            <td>
                                <div class="text text-gray-900">
                                    {{ survey.name }}
                                    <span
                                        v-if="store.state.users.user.admin"
                                        class="text-xs ml-1 text-gray-500"
                                    >
                                        {{ survey.slug }}
                                    </span>
                                </div>
                                <div class="text-sm text-gray-500">
                                    {{ survey.description }}
                                </div>
                            </td>
                            <td>
                                <published-state
                                    class="pointer"
                                    :published="survey.published"
                                    @click="publishSurvey(survey.id)"
                                />
                            </td>
                            <td>
                                {{ survey.surveyStepsCount }}
                            </td>
                            <td class="px-6 py-4 flex flex-row">
                                <PencilAltIcon
                                    class="mx-1 h-5 w-5 pointer"
                                    @click.prevent.stop="editSurvey(survey.id)"
                                />
                                <trash-icon
                                    v-if="survey.surveyStepsCount > 0"
                                    class="
                                        mx-1
                                        h-5
                                        w-5
                                        text-gray-500
                                        cursor-not-allowed
                                    "
                                    @click.prevent.stop="null"
                                />
                                <trash-icon
                                    v-else
                                    class="mx-1 h-5 w-5 text-red-500 pointer"
                                    @click.prevent.stop="
                                        deleteSurvey(survey.id)
                                    "
                                />
                                <EyeIcon
                                    class="mx-1 h-5 w-5 pointer"
                                    @click.prevent.stop="
                                        previewSurvey(survey.id)
                                    "
                                />
                                <DocumentDuplicateIcon
                                    v-if="store.state.users.user.admin"
                                    class="mx-1 h-5 w-5 pointer"
                                    @click.prevent.stop="
                                        duplicateSurvey(survey.id)
                                    "
                                />
                                <ChartBarIcon
                                    v-if="store.state.users.user.admin"
                                    class="mx-1 h-5 w-5 pointer"
                                    @click.prevent.stop="
                                        openSurveyStats(survey.id)
                                    "
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </main>
        <aside v-if="showSurveyDetailsEdit">
            <survey-details
                :survey-id="surveyId"
                @saved="surveySaved"
                @cancel="setShowSurveyDetailsEdit(false)"
            />
        </aside>
    </div>
</template>

<script>
import {
    TrashIcon,
    PencilAltIcon,
    EyeIcon,
    ChartBarIcon,
    DocumentDuplicateIcon,
} from '@heroicons/vue/outline'
import { useRouter } from 'vue-router'

import Collection from '../Common/Collection/Collection.vue'
import SurveyDetails from './SurveyDetails.vue'
import { computed, ref } from 'vue'
import PublishedState from '../Common/PublishedState.vue'
import { useState } from '../../composables/state'

import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

export default {
    name: 'SurveysList',
    components: {
        PublishedState,
        SurveyDetails,
        Collection,
        TrashIcon,
        EyeIcon,
        PencilAltIcon,
        ChartBarIcon,
        DocumentDuplicateIcon,
    },
    setup() {
        const router = useRouter()
        const store = useStore()
        const { t } = useI18n()
        const surveyId = ref(-1)
        const isBusy = ref(false)
        const [showSurveyDetailsEdit, setShowSurveyDetailsEdit] =
            useState(false)

        const surveys = computed({
            get: () => store.state.surveys.surveys,
        })

        store.dispatch('surveys/getSurveys')

        const surveySaved = () => {
            setShowSurveyDetailsEdit(false)
            store.dispatch('surveys/getSurveys')
        }

        const editSurvey = async (surveyId) => {
            await router.push('/surveys/' + surveyId)
        }

        const deleteSurvey = async (surveyId) => {
            const confirmSurveyDelete = confirm(t('confirm_delete_survey'))
            isBusy.value = true
            if (confirmSurveyDelete) {
                await store.dispatch('surveys/deleteSurvey', surveyId)
            }
            isBusy.value = false
        }

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

        const publishSurvey = async (surveyId) => {
            await store.dispatch('surveys/publishSurvey', surveyId)
        }

        const openSurveyStats = async (surveyId) => {
            await router.push('/stats/' + surveyId)
        }

        const duplicateSurvey = async (surveyId) => {
            const confirmSurveyDuplicate = confirm(
                t('confirm_duplicate_survey'),
            )

            if (confirmSurveyDuplicate) {
                await store.dispatch('surveys/duplicateSurvey', surveyId)
            }
        }

        return {
            store,
            surveys,
            surveyId,
            t,
            deleteSurvey,
            editSurvey,
            previewSurvey,
            openSurveyStats,
            duplicateSurvey,
            publishSurvey,
            surveySaved,
            showSurveyDetailsEdit,
            setShowSurveyDetailsEdit,
        }
    },
}
</script>

<style></style>

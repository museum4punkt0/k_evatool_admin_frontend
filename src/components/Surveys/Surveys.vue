<template>
    <div class="flex-1 flex items-stretch overflow-hidden">
        <main class="flex-1 overflow-y-auto p-3">
            <h1>{{ surveys.length }} {{ t('surveys', surveys.length) }}</h1>

            <div class="table-wrap mt-3">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-blue-500">
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Steps</th>
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
                        <tr>
                            <td class="text-lg">
                                {{ survey.id }}
                            </td>
                            <td>
                                <div class="text-sm text-gray-900">
                                    {{ survey.name }}
                                </div>
                                <div class="text-sm text-gray-500">
                                    {{ survey.description }}
                                </div>
                            </td>
                            <td>
                                <published-state
                                    :published="survey.published"
                                />
                            </td>
                            <td>
                                {{ survey.surveyStepsCount }}
                            </td>
                            <td class="px-6 py-4 flex flex-row">
                                <PencilAltIcon
                                    class="mx-1 h-5 w-5"
                                    @click.prevent.stop="editSurvey(survey.id)"
                                />
                                <TrashIcon
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
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </main>
        <aside>
            <survey-details :survey-id="surveyId" @saved="surveySaved" />
        </aside>
    </div>
</template>

<script>
import { TrashIcon, PencilAltIcon, EyeIcon } from '@heroicons/vue/outline'
import { useRouter } from 'vue-router'

import Collection from '../Common/Collection/Collection.vue'
import SurveyDetails from './SurveyDetails.vue'
import { computed, ref } from 'vue'
import PublishedState from '../Common/PublishedState.vue'

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
    },
    setup() {
        const router = useRouter()
        const store = useStore()
        const surveyId = ref(-1)
        const isBusy = ref(false)
        const { t } = useI18n()

        const surveys = computed({
            get: () => store.state.surveys.surveys,
        })

        store.dispatch('surveys/getSurveys')

        const surveySaved = () => {
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
            console.log(surveyIdPreview)
            window
                .open(
                    import.meta.env.VITE_PREVIEW_URL +
                        '/#/?id=' +
                        surveyIdPreview,
                    '_blank',
                )
                .focus()
        }

        return {
            surveys,
            surveyId,
            t,
            deleteSurvey,
            editSurvey,
            previewSurvey,
            surveySaved,
        }
    },
}
</script>

<style></style>

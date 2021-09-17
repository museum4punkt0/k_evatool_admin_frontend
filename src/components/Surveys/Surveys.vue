<template>
    <div class="flex-1 flex items-stretch overflow-hidden">
        <main class="flex-1 overflow-y-auto p-3">
            <h1>{{ $tc('surveys', 2) }}</h1>

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
                        <tr @click="setSurvey(survey.id)">
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
                                    @click.prevent.stop="
                                        handlers.onEdit(survey)
                                    "
                                />
                                <TrashIcon
                                    class="mx-1 h-5 w-5 text-red-500 pointer"
                                    @click.prevent.stop="
                                        deleteSurvey(survey.id)
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
import { createNamespacedHelpers } from 'vuex-composition-helpers'
import Collection from '../Common/Collection/Collection.vue'
import SurveyDetails from './SurveyDetails.vue'
import { ref } from 'vue'
import PublishedState from '../Common/PublishedState.vue'

const { useState, useActions } = createNamespacedHelpers('surveys')
const { useActions: useNotificationsActions } =
    createNamespacedHelpers('notifications')

import SURVEYS from '../../services/surveys'
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
        const { surveys } = useState(['surveys'])
        const { getAllAndUpdateStore, deleteOneAndUpdateStore } = useActions([
            'getAllAndUpdateStore',
            'deleteOneAndUpdateStore',
        ])
        const { addError } = useNotificationsActions(['addError'])
        const onView = (items) => {
            if (Array.isArray(items)) {
                items.forEach((item) => {
                    router.push({
                        name: 'survey',
                        params: { id: item.id },
                    })
                })
            } else if (typeof items === 'object') {
                router.push({
                    name: 'survey/view',
                    params: { id: items.id },
                })
            }
        }
        const onEdit = (items) => {
            if (Array.isArray(items)) {
                items.forEach((item) => {
                    router.push({
                        name: 'survey/edit',
                        params: { id: item.id },
                    })
                })
            } else if (typeof items === 'object') {
                router.push({
                    name: 'survey/edit',
                    params: { id: items.id },
                })
            }
        }
        const onDelete = (items) => {
            if (Array.isArray(items)) {
                items.forEach((item) => {
                    deleteOneAndUpdateStore(item).catch((error) =>
                        addError({ message: error }),
                    )
                })
            } else if (typeof items === 'object') {
                deleteOneAndUpdateStore(items).catch((error) =>
                    addError({ message: error }),
                )
            }
        }

        const surveySaved = () => {
            getAllAndUpdateStore()
            surveyId.value = -1
        }

        const setSurvey = (surveyIdSet) => {
            console.log(surveyIdSet)
            surveyId.value = surveyIdSet
        }

        const deleteSurvey = async (surveyId) => {
            const confirmSurveyDelete = confirm(t('confirm_delete_survey'))
            isBusy.value = true
            if (confirmSurveyDelete) {
                await SURVEYS.deleteSurvey(surveyId)
                store.dispatch('surveys/getAllAndUpdateStore', {
                    trashed: true,
                })
            }
            isBusy.value = false
        }

        getAllAndUpdateStore()
        return {
            surveys,
            textFilter: (item, text) =>
                item.name.toLowerCase().includes(text.toLowerCase()),
            selectors: {
                itemTitle: (item) => item.name,
            },
            handlers: {
                onRefresh: getAllAndUpdateStore,
                onNew: () => {
                    console.log('on new')
                    return router.push({
                        name: 'surveys/new',
                    })
                },
                onView,
                onEdit,
                onDelete,
            },
            surveyId,
            surveySaved,
            setSurvey,
            deleteSurvey,
        }
    },
}
</script>

<style></style>

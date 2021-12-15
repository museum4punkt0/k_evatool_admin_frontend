<template>
    <div class="flex flex-grow overflow-hidden">
        <main class="flex h-full w-full flex-col p-3">
            <div class="flex flex-row justify-between">
                <h1
                    v-if="
                        filteredSurveys.length > 0 &&
                        filteredSurveys.length < surveys.length
                    "
                >
                    {{ filteredSurveys.length }} {{ t('of') }}
                    {{ surveys.length }}
                    {{ t('surveys', surveys.length) }}
                </h1>
                <h1 v-else>
                    {{ surveys.length }}
                    {{ t('surveys', filteredSurveys.length) }}
                </h1>
                <div class="flex-1 flex flex-row justify-end">
                    <form-input
                        v-model:value="searchQuery"
                        name="name"
                        type="text"
                        label=""
                        :placeholder="`${t('filter', 1)}: ${t('id')}, ${t(
                            'names',
                            1,
                        )}, ${t('descriptions', 1)}`"
                        class="mr-4"
                    />
                </div>
            </div>

            <div class="table-wrap mt-3">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>{{ t('names', 1) }}</th>
                            <th>#&nbsp;{{ t('steps', 2) }}</th>
                            <th>
                                <span class="sr-only">Edit</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr
                            v-for="survey in surveys.filter(filter)"
                            :key="'survey_row_' + survey.id"
                            @click.prevent.stop="openSurveyStats(survey.id)"
                        >
                            <td class="text-lg">
                                {{ survey.id }}
                            </td>
                            <td>
                                <div class="text text-gray-900">
                                    {{ survey.name }}
                                </div>
                                <div class="text-sm text-gray-500">
                                    {{ survey.description }}
                                </div>
                            </td>
                            <td>
                                {{ survey.surveyStepsCount }}
                            </td>
                            <td class="px-6 py-4 flex flex-row">
                                <EyeIcon
                                    class="mx-1 h-5 w-5 pointer"
                                    @click.prevent.stop="previewSurvey(survey)"
                                />
                                <ChartBarIcon
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
    </div>
</template>

<script>
import { EyeIcon, ChartBarIcon } from '@heroicons/vue/outline'
import { useRouter } from 'vue-router'
import { computed, ref, watch } from 'vue'
import { useState } from '../../composables/state'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import FormInput from '../Forms/FormInput.vue'
import { searchForWordsInString } from '../../utils/search'

export default {
    name: 'SurveyStatsList',
    components: {
        FormInput,
        EyeIcon,
        ChartBarIcon,
    },
    setup() {
        const router = useRouter()
        const store = useStore()
        const { t } = useI18n()

        const surveys = computed({
            get: () =>
                store.state.surveys.surveys.filter(
                    (survey) => survey.surveyResultsCount > 0,
                ),
        })
        const searchQuery = ref('')
        const [filteredSurveys, setFilteredSurveys] = useState(surveys.value)

        store.dispatch('surveys/getSurveys')

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

        const openSurveyStats = async (surveyId) => {
            await router.push('/stats/' + surveyId)
        }

        const filter = (survey) => {
            return (
                searchForWordsInString([survey], searchQuery.value, [
                    'id',
                    'name',
                    'description',
                ]).length > 0
            )
        }
        watch(searchQuery, () => {
            const filteredSurveys = surveys.value.filter(filter)
            setFilteredSurveys(filteredSurveys)
        })

        return {
            store,
            surveys,
            t,
            previewSurvey,
            openSurveyStats,
            searchQuery,
            filter,
            filteredSurveys,
        }
    },
}
</script>

<style scoped></style>

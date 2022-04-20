<template>
    <div class="flex flex-grow overflow-hidden">
        <main
            class="flex h-full flex-col p-3"
            :class="showSurveyDetailsEdit ? 'w-2/3' : 'w-full'"
        >
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
                            <th class="justify-center">
                                {{ t('single_step_access') }}
                            </th>
                            <th>Status</th>
                            <th>#&nbsp;{{ t('steps', 2) }}</th>
                            <th>
                                #&nbsp;{{ t('results', 2) }}
                                <br />
                                <span class="text-xs text-gray-600">
                                    live / demo
                                </span>
                            </th>
                            <th>
                                <span class="sr-only">Edit</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <SurveyRow
                            v-for="survey in surveys.filter(filter)"
                            :key="'survey_' + survey.id"
                            :survey="survey"
                        />
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

import { computed, ref, watch } from 'vue'
import PublishedState from '../Common/PublishedState.vue'
import { useState } from '../../composables/state'

import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import { searchForWordsInString } from '../../utils/search'

import FormInput from '../Forms/FormInput.vue'
import SurveyDetails from './SurveyDetails.vue'
import SurveyRow from './SurveyRow.vue'

export default {
    name: 'SurveysList',
    components: {
        SurveyRow,
        FormInput,
        PublishedState,
        SurveyDetails,
        TrashIcon,
        EyeIcon,
        PencilAltIcon,
        ChartBarIcon,
        DocumentDuplicateIcon,
    },
    setup() {
        const store = useStore()
        const { t } = useI18n()
        const surveyId = ref(-1)
        const [showSurveyDetailsEdit, setShowSurveyDetailsEdit] =
            useState(false)

        const surveys = computed({
            get: () => store.state.surveys.surveys,
        })
        const searchQuery = ref('')
        const [filteredSurveys, setFilteredSurveys] = useState(surveys.value)

        store.dispatch('surveys/getSurveys')

        const surveySaved = () => {
            setShowSurveyDetailsEdit(false)
            store.dispatch('surveys/getSurveys')
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
            surveyId,
            t,
            surveySaved,
            showSurveyDetailsEdit,
            setShowSurveyDetailsEdit,
            searchQuery,
            filter,
            filteredSurveys,
        }
    },
}
</script>

<style></style>

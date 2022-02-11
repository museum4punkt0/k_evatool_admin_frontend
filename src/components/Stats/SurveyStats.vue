<template>
    <div class="flex-1 flex items-stretch overflow-hidden">
        <main class="flex flex-col flex-1 overflow-y-auto p-3">
            <div class="flex content-center mb-5">
                <h1 class="">
                    {{ t('stats', 1) }}:
                    <strong>{{ store.state.surveys.survey?.name }}</strong>
                </h1>
                <!-- {{ store.state.surveyResults }} -->
                <button
                    v-tippy="{
                        content: t('action_edit_survey'),
                    }"
                    class="secondary ml-3"
                    @click="editSurvey(store.state.surveys.survey)"
                >
                    <PencilIcon class="h-5 w-5" />
                </button>
            </div>
            <div class="w-full flex flex-row justify-between items-center mb-5">
                <div class="w-1/3">
                    <date-picker v-model="timeSpan" />
                </div>
                <form-toggle
                    v-model:enabled="demo"
                    :label="t('show_demo_data_only')"
                    class="ml-3 flex-1"
                />
                <button class="primary" @click="openExportModal">
                    {{ t('action_export') }}
                </button>
            </div>
            <div class="w-full flex flex-row items-center mb-5">
                <div class="w-1/3 mr-3">
                    <date-picker v-model="timeSpanCompareWith" />
                </div>
                <p v-html="t('label_compare_filter')"></p>
            </div>
            <survey-stats-trend
                v-if="store.state.stats.trend"
                :trend="store.state.stats.trend"
            />

            <div v-if="surveySteps.length > 0" class="table-wrap mt-3">
                <table class="table-fixed">
                    <thead>
                        <tr>
                            <th>
                                <div v-html="t('finished_at')"></div>
                                <span
                                    v-if="store.state.users.user.admin"
                                    class="text-xs text-gray-500"
                                >
                                    UUID
                                </span>
                            </th>
                            <th>{{ t('duration') }}</th>
                            <th v-for="step in surveySteps" :key="step.id">
                                <div
                                    v-if="step.surveyElementType === 'video'"
                                    class="flex whitespace-nowrap"
                                >
                                    video
                                    <external-link-icon
                                        class="mx-1 h-5 w-5 pointer"
                                        @click.prevent.stop="
                                            showStepResults(step.id)
                                        "
                                    ></external-link-icon>
                                </div>
                                <div v-else class="flex whitespace-nowrap">
                                    <survey-stats-cell
                                        :content="
                                            store.state.surveyElements?.surveyElements.find(
                                                (element) =>
                                                    element.id ===
                                                    step.surveyElementId,
                                            )?.params.question?.de ||
                                            store.state.surveyElements?.surveyElements.find(
                                                (element) =>
                                                    element.id ===
                                                    step.surveyElementId,
                                            )?.params.text?.de
                                        "
                                    />
                                    <external-link-icon
                                        v-if="
                                            step.surveyElementType !==
                                                'textInput' &&
                                            step.surveyElementType !==
                                                'simpleText' &&
                                            step.surveyElementType !==
                                                'voiceInput'
                                        "
                                        class="mx-1 h-5 w-5 pointer"
                                        @click.prevent.stop="
                                            showStepResults(step.id)
                                        "
                                    />
                                </div>
                                <div>
                                    <span
                                        v-if="store.state.users.user.admin"
                                        class="text-xs text-gray-500 mr-1"
                                    >
                                        id: {{ step.id }}
                                    </span>
                                    <span class="text-xs text-gray-500">
                                        {{
                                            store.getters[
                                                'elementTypes/getDisplayNameForKey'
                                            ](step.surveyElementType)
                                        }}
                                    </span>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody v-if="store.state.stats.results.length > 0">
                        <tr
                            v-for="result in store.state.stats.results"
                            :key="result.uuid"
                        >
                            <td>
                                {{
                                    moment(result.lastResultTimestamp)
                                        .locale('de')
                                        .format('DD.MM.YYYY')
                                }}
                                <span
                                    v-if="store.state.users.user.admin"
                                    class="text-xs text-gray-500"
                                >
                                    <br />
                                    {{ result.uuid }}
                                </span>
                            </td>
                            <td>
                                {{
                                    moment
                                        .utc(result.duration * 1000)
                                        .format('HH:mm:ss')
                                }}
                            </td>
                            <td
                                v-for="step in surveySteps"
                                :key="result.uuid + '-' + step.id"
                                @click.prevent.stop="
                                    showStepDetailResult(
                                        step,
                                        result.results.find(
                                            (x) => x.stepId === step.id,
                                        ),
                                    )
                                "
                            >
                                <step-result
                                    v-if="
                                        result.results.find(
                                            (x) => x.stepId === step.id,
                                        )
                                    "
                                    :step="step"
                                    :result="
                                        result.results.find(
                                            (x) => x.stepId === step.id,
                                        )
                                    "
                                    :step-params="
                                        store.state.surveyElements?.surveyElements.find(
                                            (element) =>
                                                element.id ===
                                                step.surveyElementId,
                                        ).params
                                    "
                                ></step-result>
                            </td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                        <tr>
                            <td :colspan="surveySteps.length + 4">
                                {{ t('status_loading') }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <step-detail-result-modal
                v-model:is-open="stepResultModalIsOpen"
                :survey-step="selectedSurveyStep"
                :survey-step-result="selectedSurveyStepResult"
            ></step-detail-result-modal>
            <step-results-modal
                v-model:is-open="stepResultsModalIsOpen"
                :survey-step-id="selectedSurveyStepId"
                :survey-step-list="selectedSurveyStepList"
                :survey-step-compare-list="selectedCompareStepResultsList"
                :time-span-compare="timeSpanCompareWith"
            ></step-results-modal>
            <div class="footer"></div>

            <survey-stats-export-modal
                v-if="surveyId"
                v-model:open="exportModalOpen"
                :survey-id="surveyId"
            />
        </main>
    </div>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { EyeIcon, ExternalLinkIcon, PencilIcon } from '@heroicons/vue/outline'
import dayjs from 'dayjs'
import moment from 'moment'
import 'moment/locale/de'

import FormToggle from '../Forms/FormToggle.vue'
import DatePicker from '@/components/Common/DatePicker.vue'
import StepDetailResultModal from './stepResult/detail/StepDetailResultModal.vue'
import SurveyStatsExportModal from './SurveyStatsExportModal.vue'
import SurveyStatsTrend from './SurveyStatsTrend.vue'
import StepResult from './stepResult/StepResult.vue'
import StepResultsModal from './stepResults/StepResultsModal.vue'
import SURVEY_STATS_SERVICE from '../../services/surveyStatsService'
import SurveyStatsCell from '@/components/Stats/SurveyStatsCell.vue'

export default {
    name: 'SurveyStats',
    components: {
        DatePicker,
        EyeIcon,
        ExternalLinkIcon,
        FormToggle,
        PencilIcon,
        StepResult,
        StepDetailResultModal,
        StepResultsModal,
        SurveyStatsCell,
        SurveyStatsExportModal,
        SurveyStatsTrend,
    },
    setup() {
        const { t } = useI18n()
        const route = useRoute()
        const router = useRouter()
        const store = useStore()

        const endDate = new Date()
        const startFrom = new Date(
            new Date().setDate(endDate.getDate() - 30 * 6),
        )
        const timeSpan = ref([
            dayjs(startFrom).format(t('datepicker_date_formatter')),
            dayjs(endDate).format(t('datepicker_date_formatter')),
        ])
        const timeSpanCompareWith = ref([])
        const selectedCompareStepResultsList = ref({})

        const demo = ref(false)
        const stepResultModalIsOpen = ref(false)
        const stepResultsModalIsOpen = ref(false)
        const selectedSurveyStepResult = ref(-1)
        const selectedSurveyStep = ref(-1)
        const selectedSurveyStepId = ref(-1)
        const selectedSurveyStepList = ref({})
        const surveyId = parseInt(route.params.survey_id)

        onMounted(async () => {
            const surveyId = parseInt(route.params.survey_id)
            await store.dispatch('surveys/setSurveyId', surveyId)
            await store.dispatch('surveys/getSurvey', surveyId)
        })

        const surveySteps = computed(() => store.state.stats.surveySteps)

        getStatsTrend()
        setStartAndEndDateStats(timeSpan.value[0], timeSpan.value[1])
        store.dispatch('stats/getSurveySteps', surveyId)

        watch(
            () => demo.value,
            () => {
                if (timeSpan.value[0] && timeSpan.value[1]) {
                    setStartAndEndDateStats(
                        timeSpan.value[0],
                        timeSpan.value[1],
                    )
                }
                getStatsTrend()
            },
        )
        watch(
            () => timeSpan.value,
            () => {
                if (timeSpan.value[0] && timeSpan.value[1]) {
                    setStartAndEndDateStats(
                        timeSpan.value[0],
                        timeSpan.value[1],
                    )
                }
                getStatsTrend()
            },
            { deep: true },
        )

        function setStartAndEndDateStats(start, end) {
            const startDate = dayjs(
                start,
                t('datepicker_date_formatter'),
            ).format('YYYY-MM-DD')
            const endDate = dayjs(end, t('datepicker_date_formatter')).format(
                'YYYY-MM-DD',
            )

            store.dispatch('stats/getStats', {
                surveyId,
                start: startDate,
                end: endDate,
                demo: demo.value,
            })
            store.dispatch('stats/getStatsList', {
                surveyId,
                start: startDate,
                end: endDate,
                demo: demo.value,
            })
        }

        function getStatsTrend() {
            store.dispatch('stats/getStatsTrend', {
                surveyId,
                demo: demo.value,
            })
        }

        const showStepResults = async (id) => {
            if (id > -1) {
                selectedSurveyStepList.value =
                    await SURVEY_STATS_SERVICE.getStatsStepList(
                        surveyId,
                        id,
                        dayjs(
                            timeSpan.value[0],
                            t('datepicker_date_formatter'),
                        ).format('YYYY-MM-DD'),
                        dayjs(
                            timeSpan.value[1],
                            t('datepicker_date_formatter'),
                        ).format('YYYY-MM-DD'),
                        demo.value,
                    )
                if (timeSpanCompareWith.value.length === 2) {
                    selectedCompareStepResultsList.value =
                        await SURVEY_STATS_SERVICE.getStatsStepList(
                            surveyId,
                            id,
                            dayjs(
                                timeSpanCompareWith.value[0],
                                t('datepicker_date_formatter'),
                            ).format('YYYY-MM-DD'),
                            dayjs(
                                timeSpanCompareWith.value[1],
                                t('datepicker_date_formatter'),
                            ).format('YYYY-MM-DD'),
                            demo.value,
                        )
                }
                stepResultsModalIsOpen.value = true
                selectedSurveyStepId.value = id
            }
        }

        const hasStepResultDetailView = (step) => {
            const elementTypesWithDetailView = ['yayNay', 'textInput']
            return elementTypesWithDetailView.includes(step.surveyElementType)
        }
        const showStepDetailResult = (step, stepResult) => {
            if (!hasStepResultDetailView(step)) {
                return
            }
            selectedSurveyStep.value = step
            selectedSurveyStepResult.value = stepResult
            stepResultModalIsOpen.value = true
            // selectedSurveyStepId.value = id
        }

        const exportModalOpen = ref(false)

        const openExportModal = () => {
            exportModalOpen.value = true
        }

        const editSurvey = (survey) => {
            router.push(`/surveys/${survey.id}`)
        }

        return {
            surveyId,
            t,
            store,
            timeSpan,
            timeSpanCompareWith,
            demo,
            moment,
            surveySteps,
            stepResultModalIsOpen,
            stepResultsModalIsOpen,
            showStepResults,
            selectedCompareStepResultsList,
            selectedSurveyStep,
            selectedSurveyStepId,
            selectedSurveyStepList,
            selectedSurveyStepResult,
            showStepDetailResult,
            openExportModal,
            exportModalOpen,
            editSurvey,
        }
    },
}
</script>

<style scoped>
thead {
    z-index: 10;
}

td {
    max-width: 500px;
}
</style>

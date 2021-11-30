<template>
    <div class="flex-1 flex items-stretch overflow-hidden">
        <main class="flex flex-col flex-1 overflow-y-auto p-3">
            <survey-stats-trend
                v-if="store.state.stats.trend"
                :trend="store.state.stats.trend"
            />
            <div class="flex flex-row">
                <!-- {{ store.state.surveyResults }} -->
                <h1>
                    {{ t('stats', 1) }}
                    <strong>{{ store.state.surveys.survey?.name }}</strong>
                </h1>
                <div class="flex-1 flex flex-row justify-end ml-4">
                    <!-- <litepie-datepicker
                        v-model="timeSpan"
                        :formatter="formatter"
                        separator=" to "
                    ></litepie-datepicker> -->
                    <Datepicker
                        v-model="timeSpan"
                        range
                        locale="de"
                        cancel-text="abbrechen"
                        select-text="auswählen"
                        :enable-time-picker="false"
                        class="w-1/3"
                    />
                    <form-toggle
                        v-model:enabled="demo"
                        :label="'demo'"
                        class="ml-3"
                    />
                    <button class="primary ml-3 mr-3">export</button>
                </div>
            </div>

            <div
                v-if="store.state.stats.surveySteps.length > 0"
                class="table-wrap mt-3"
            >
                <table>
                    <thead>
                        <tr>
                            <th>
                                <div v-html="t('finished_at')"></div>
                                <span class="text-xs text-gray-500">UUID</span>
                            </th>
                            <th>Duration</th>
                            <th
                                v-for="step in store.state.stats.surveySteps"
                                :key="step.id"
                            >
                                {{ step.id }} {{ step.surveyElementType }}
                                <external-link-icon
                                    class="mx-1 h-5 w-5 pointer"
                                    @click.prevent.stop="
                                        showStepResults(step.id)
                                    "
                                ></external-link-icon>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="result in store.state.stats.results"
                            :key="result.uuid"
                        >
                            <td>
                                {{
                                    moment(result.lastResultTimestamp)
                                        .locale('de')
                                        .format('LLLL')
                                }}
                                <span class="text-xs text-gray-500">
                                    <br />
                                    {{ result.uuid }}
                                </span>
                            </td>
                            <td>{{ result.duration }}</td>
                            <td
                                v-for="step in store.state.stats.surveySteps"
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
                                    :step="step"
                                    :result="
                                        result.results.find(
                                            (x) => x.stepId === step.id,
                                        )
                                    "
                                ></step-result>
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
            ></step-results-modal>
            <div class="footer"></div>
        </main>
    </div>
</template>

<script>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { EyeIcon, ExternalLinkIcon } from '@heroicons/vue/outline'
import Datepicker from 'vue3-date-time-picker'
import FormToggle from '../Forms/FormToggle.vue'
import dayjs from 'dayjs'
import SurveyStatsTrend from './SurveyStatsTrend.vue'
import moment from 'moment'
import 'moment/locale/de'

import StepDetailResultModal from './stepResult/detail/StepDetailResultModal.vue'
import StepResult from './stepResult/StepResult.vue'
import StepResultsModal from './stepResults/StepResultsModal.vue'
import SURVEYSTATS_SERVICE from '../../services/surveyStatsService'

import 'vue3-date-time-picker/dist/main.css'

export default {
    name: 'SurveyStats',
    components: {
        SurveyStatsTrend,
        EyeIcon,
        ExternalLinkIcon,
        FormToggle,
        StepResult,
        StepDetailResultModal,
        StepResultsModal,
        Datepicker,
    },
    setup() {
        const { t } = useI18n()
        const route = useRoute()
        const store = useStore()
        const timeSpan = ref(null)
        const endDate = new Date()
        const startDate = new Date(
            new Date().setDate(endDate.getDate() - 30 * 6),
        )
        timeSpan.value = [startDate, endDate]
        const demo = ref(true)
        const formatter = ref({
            date: 'YYYY-MM-DD',
        })
        const stepResultModalIsOpen = ref(false)
        const stepResultsModalIsOpen = ref(false)
        const selectedSurveyStepResult = ref(null)
        const selectedSurveyStep = ref(null)
        const selectedSurveyStepId = ref(-1)
        const selectedSurveyStepList = ref({})

        const surveyId = route.params.survey_id

        store.dispatch('stats/getStatsTrend', surveyId)

        store.dispatch('stats/getStats', {
            surveyId,
            start: dayjs(timeSpan.value[0]).format('YYYY-MM-DD'),
            end: dayjs(timeSpan.value[1]).format('YYYY-MM-DD'),
            demo: demo.value,
        })
        store.dispatch('stats/getStatsList', {
            surveyId,
            start: dayjs(timeSpan.value[0]).format('YYYY-MM-DD'),
            end: dayjs(timeSpan.value[1]).format('YYYY-MM-DD'),
            demo: demo.value,
        })
        store.dispatch('stats/getSurveySteps', surveyId)

        watch(
            () => demo.value,
            () => {
                store.dispatch('stats/getStats', {
                    surveyId,
                    start: dayjs(timeSpan.value[0]).format('YYYY-MM-DD'),
                    end: dayjs(timeSpan.value[1]).format('YYYY-MM-DD'),
                    demo: demo.value,
                })
                store.dispatch('stats/getStatsList', {
                    surveyId,
                    start: dayjs(timeSpan.value[0]).format('YYYY-MM-DD'),
                    end: dayjs(timeSpan.value[1]).format('YYYY-MM-DD'),
                    demo: demo.value,
                })
            },
        )
        watch(
            () => timeSpan.value,
            () => {
                store.dispatch('stats/getStats', {
                    surveyId,
                    start: dayjs(timeSpan.value[0]).format('YYYY-MM-DD'),
                    end: dayjs(timeSpan.value[1]).format('YYYY-MM-DD'),
                    demo: demo.value,
                })
                store.dispatch('stats/getStatsList', {
                    surveyId,
                    start: dayjs(timeSpan.value[0]).format('YYYY-MM-DD'),
                    end: dayjs(timeSpan.value[1]).format('YYYY-MM-DD'),
                    demo: demo.value,
                })
            },
        )

        const showStepResults = async (id) => {
            if (id > -1) {
                selectedSurveyStepList.value =
                    await SURVEYSTATS_SERVICE.getStatsStepList(
                        surveyId,
                        id,
                        dayjs(timeSpan.value[0]).format('YYYY-MM-DD'),
                        dayjs(timeSpan.value[1]).format('YYYY-MM-DD'),
                        demo.value,
                    )
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

        return {
            surveyId,
            t,
            store,
            timeSpan,
            formatter,
            demo,
            moment,
            stepResultModalIsOpen,
            stepResultsModalIsOpen,
            showStepResults,
            selectedSurveyStep,
            selectedSurveyStepId,
            selectedSurveyStepList,
            selectedSurveyStepResult,
            showStepDetailResult,
        }
    },
}
</script>

<style scoped>
thead {
    z-index: 10;
}
</style>

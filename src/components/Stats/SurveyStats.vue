<template>
    <div class="flex-1 flex items-stretch overflow-hidden">
        <main class="flex-1 overflow-y-auto p-3">
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
                    <litepie-datepicker
                        v-model="timeSpan"
                        :formatter="formatter"
                        separator=" to "
                    ></litepie-datepicker>
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
                            >
                                {{
                                    result.results.find(
                                        (x) => x.stepId === step.id,
                                    )
                                }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!--            total: {{ store.state.stats.stats?.total }}
<div class="table-wrap mt-3">
<table>
<thead>
<tr>
    <th>#</th>
    <th>uuid</th>
    <th>count</th>
</tr>
</thead>
<tbody>
<tr
    v-for="(result, index) in store.state.stats.results"
    :key="`result_${index}`"
>
    <td>
        {{ index }}
    </td>
    <td>
        {{ result.uuid }}
    </td>
    <td>
        {{ result.resultCount }}
    </td>
</tr>
</tbody>
</table>
</div>-->

            <div class="footer"></div>
        </main>
    </div>
</template>

<script>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { EyeIcon } from '@heroicons/vue/outline'
import LitepieDatepicker from 'litepie-datepicker'
import FormToggle from '../Forms/FormToggle.vue'
import dayjs from 'dayjs'
import SurveyStatsTrend from './SurveyStatsTrend.vue'
import moment from 'moment'
import 'moment/locale/de'

export default {
    name: 'SurveyStats',
    components: { SurveyStatsTrend, EyeIcon, FormToggle, LitepieDatepicker },
    setup() {
        const { t } = useI18n()
        const route = useRoute()
        const store = useStore()
        const timeSpan = ref([dayjs().add(-1, 'year'), dayjs()])
        const demo = ref(true)
        const formatter = ref({
            date: 'YYYY-MM-DD',
        })

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
            },
        )

        return {
            surveyId,
            t,
            store,
            timeSpan,
            formatter,
            demo,
            moment,
        }
    },
}
</script>

<style scoped></style>

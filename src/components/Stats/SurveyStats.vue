<template>
    <div class="flex-1 flex items-stretch overflow-hidden">
        <main class="flex-1 overflow-y-auto p-3">
            <!-- {{ store.state.surveyResults }} -->
            <h1>
                {{ t('stats', 1) }}
                <strong>{{ store.state.surveys.survey?.name }}</strong>
            </h1>

            total: {{ store.state.stats.stats?.total }}
            <!-- <div class="table-wrap mt-3">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>{{ t('steps', 1) }}</th>
                            <th>{{ t('elements', 1) }}</th>
                            <th>{{ t('parent_elements', 1) }}</th>
                            <th># {{ t('results', 2) }}</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody v-if="store.state.surveys.survey?.steps">
                        <tr
                            v-for="step in store.state.surveys.survey.steps"
                            :key="step.id"
                        >
                            <td class="text-lg">{{ step.id }}</td>
                            <td>
                                {{ step.name }}
                                <p class="text-gray-500 text-xs">
                                    {{
                                        store.state.surveyElements.surveyElements.find(
                                            (x) =>
                                                x.id === step.surveyElementId,
                                        ).name
                                    }}
                                </p>
                            </td>
                            <td>
                                <template
                                    v-if="
                                        store.state.surveyElements.surveyElements.find(
                                            (x) =>
                                                x.id === step.surveyElementId,
                                        ).params?.question
                                    "
                                >
                                    {{
                                        store.state.surveyElements.surveyElements.find(
                                            (x) =>
                                                x.id === step.surveyElementId,
                                        ).params?.question[
                                            store.state.languages
                                                .defaultLanguage.code
                                        ]
                                    }}
                                </template>
                            </td>
                            <td>{{ step.parentStepId }}</td>
                            <td>
                                <span v-if="step.resultCount > 0">
                                    {{ step.resultCount }}
                                </span>
                                <span v-else>-</span>
                            </td>
                            <td>
                                <eye-icon
                                    class="mx-1 h-5 w-5 pointer"
                                    @click.prevent.stop="goToStep(step.id)"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div> -->
            <div class="footer">
                <form-toggle v-model:enabled="demo" :label="'demo'" />
                <litepie-datepicker
                    v-model="timeSpan"
                    :formatter="formatter"
                    separator=" to "
                ></litepie-datepicker>
            </div>
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

export default {
    name: 'SurveyStats',
    components: { EyeIcon, FormToggle, LitepieDatepicker },
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
        }
    },
}
</script>

<style scoped></style>

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
            <div class="filter">
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
import dayjs from 'dayjs'

export default {
    name: 'SurveyStats',
    components: { EyeIcon, LitepieDatepicker },
    setup() {
        const { t } = useI18n()
        const route = useRoute()
        const store = useStore()
        const timeSpan = ref([dayjs().add(-7, 'day'), dayjs()])
        const formatter = ref({
            date: 'YYYY-MM-DD',
        })

        const surveyId = route.params.survey_id
        store.dispatch('stats/getStats', {
            surveyId,
            start: dayjs(timeSpan.value[0], 'YYYY-MM_DD'),
            end: dayjs(timeSpan.value[1], 'YYYY-MM_DD'),
        })

        watch(
            () => timeSpan.value,
            (value) => {
                console.log(value)
                if (value.length > 1) {
                    store.dispatch('stats/getStats', {
                        surveyId,
                        start: dayjs(value[0], 'YYYY-MM_DD'),
                        end: dayjs(value[1], 'YYYY-MM_DD'),
                    })
                }
            },
        )

        return {
            surveyId,
            t,
            store,
            timeSpan,
            formatter,
        }
    },
}
</script>

<style scoped></style>

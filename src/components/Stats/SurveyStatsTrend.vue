<template>
    <div class="shadow-lg bg-white rounded-lg p-4 mb-5 flex">
        <div class="flex-1">
            {{ t('participants') }}

            <br />
            <div class="flex justify-start items-end">
                <div class="text-3xl font-medium text-blue-600 mr-5">
                    {{ trend.participants.total }}
                </div>
                <survey-stats-trend-tendency
                    v-if="
                        trend.participants.currentSevenDays > 0 &&
                        trend.participants.lastSevenDays > 0
                    "
                    :current="trend.participants.currentSevenDays"
                    :last="trend.participants.lastSevenDays"
                />
            </div>
        </div>
        <div class="flex-1">
            {{ t('surveys_completed') }}
            <br />
            <div class="flex justify-start items-end">
                <div class="text-3xl font-medium text-blue-600 mr-5">
                    {{ trend.completedSurveys.total }}
                </div>
                <survey-stats-trend-tendency
                    v-if="
                        trend.completedSurveys.currentSevenDays > 0 &&
                        trend.completedSurveys.lastSevenDays > 0
                    "
                    :current="trend.completedSurveys.currentSevenDays"
                    :last="trend.completedSurveys.lastSevenDays"
                />
            </div>
        </div>
        <div class="flex-1">
            {{ t('answers_total') }}
            <br />

            <div class="flex justify-start items-end">
                <div class="text-3xl font-medium text-blue-600 mr-5">
                    {{ trend.answers.total }}
                </div>
                <survey-stats-trend-tendency
                    v-if="
                        trend.answers.currentSevenDays > 0 &&
                        trend.answers.lastSevenDays > 0
                    "
                    :current="trend.answers.currentSevenDays"
                    :last="trend.answers.lastSevenDays"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import SurveyStatsTrendTendency from './SurveyStatsTrendTendency.vue'

export default {
    name: 'SurveyStatsTrend',
    components: { SurveyStatsTrendTendency },
    props: {
        trend: {
            type: Object,
            default: () => {},
        },
    },
    setup() {
        const { t } = useI18n()

        const totalParticipants = ref(124)
        const totalCompletedSurvey = ref(123)
        const totalAnswers = ref(10)

        return {
            t,
            totalParticipants,
            totalCompletedSurvey,
            totalAnswers,
        }
    },
}
</script>

<style scoped></style>

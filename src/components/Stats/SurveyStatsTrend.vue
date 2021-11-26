<template>
    <div class="shadow-lg bg-white rounded-lg p-4 mb-5 flex">
        <div class="flex-1">
            {{ t('participants') }}
            <br />
            <div class="flex justify-start items-end">
                <div class="text-3xl font-medium text-blue-600">
                    {{ data.totals.total }}
                </div>
                <div
                    v-if="
                        data.totals?.currentWeek > 0 &&
                        data.totals?.lastWeek > 0
                    "
                    class="
                        mb-1
                        text-sm
                        bg-green-100
                        text-green-600
                        rounded-full
                        py-0.5
                        px-2
                        ml-2
                    "
                >
                    {{ 1 - data.totals.currentWeek / data.totals.lastWeek }}
                    %
                </div>
            </div>
        </div>
        <div class="flex-1">
            {{ t('surveys_completed') }}
            <br />
            <span class="text-3xl font-medium text-blue-600">
                {{ data.totals.totals }}
            </span>
        </div>
        <div class="flex-1">
            {{ t('answers_total') }}
            <br />
            <span class="text-3xl font-medium text-blue-600">
                {{ data.total }}
            </span>
        </div>
    </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { ArrowUpIcon } from '@heroicons/vue/outline'

export default {
    name: 'SurveyStatsTrend',
    components: { ArrowUpIcon },
    props: {
        data: {
            type: Object,
            default: () => {},
        },
    },
    setup() {
        const { t } = useI18n()
        return {
            t,
        }
    },
}
</script>

<style scoped></style>

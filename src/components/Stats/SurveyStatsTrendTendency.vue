<template>
    <div
        class="flex items-center mb-1 text-sm rounded-full p-2"
        :class="{
            'text-green-600': percentage > +0,
            'bg-green-100': percentage >= 0,
            'text-red-600': percentage < 0,
            'bg-red-100': percentage < 0,
        }"
    >
        <arrow-up-icon v-if="percentage > 0" class="w-5 h-5" />
        <arrow-down-icon v-else class="w-5 h-5" />
        <span>{{ percentage }}%</span>
    </div>
</template>

<script>
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/vue/outline'

export default {
    name: 'SurveyStatsTrendTendency',
    components: { ArrowUpIcon, ArrowDownIcon },
    props: {
        current: { type: Number, default: 100 },
        last: { type: Number, default: 200 },
    },
    setup(props) {
        return {
            percentage: ((1 - props.current / props.last) * 100).toFixed(2),
        }
    },
}
</script>

<style scoped></style>

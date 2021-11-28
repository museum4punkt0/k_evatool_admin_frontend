<template>
    <div
        class="
            flex
            justify-between
            items-center
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
        <arrow-up-icon />
        <span>
            {{ ((1 - current / last) * 100).toFixed(2) }}
            %
        </span>
    </div>
</template>

<script>
import { ArrowUpIcon } from '@heroicons/vue/outline'

export default {
    name: 'SurveyStatsTrendTendency',
    components: { ArrowUpIcon },
    props: {
        current: { type: Number, default: 100 },
        last: { type: Number, default: 200 },
    },
}
</script>

<style scoped></style>

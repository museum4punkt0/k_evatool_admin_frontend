<template>
    <bar-chart v-bind="barChartProps" />
</template>

<script>
import { BarChart, useBarChart } from 'vue-chart-3'
import { computed } from 'vue'

export default {
    name: 'YayNayResults',
    components: { BarChart },
    props: {
        chartLabel: {
            type: String,
            required: true,
        },
        labels: {
            type: Array,
            required: true,
        },
        datasets: {
            type: Array,
            required: true,
        },
        values: {
            type: Array,
            required: true,
        },
        colors: {
            type: Array,
            default: () => ['rgb(29, 78, 216)'],
            required: false,
        },
    },
    setup(props) {
        const chartData = computed(() => ({
            labels: props.labels,
            datasets: props.datasets,
        }))

        const { barChartProps, barChartRef } = useBarChart({
            chartData,
        })

        return {
            barChartProps,
            barChartRef,
        }
    },
}
</script>

<style scoped></style>

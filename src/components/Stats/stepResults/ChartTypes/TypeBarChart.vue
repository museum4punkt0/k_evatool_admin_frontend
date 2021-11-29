<template>
    <bar-chart v-bind="barChartProps" />
</template>

<script>
import { BarChart, useBarChart } from 'vue-chart-3'
import { computed } from 'vue'

export default {
    name: 'TypeBarChart',
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
        values: {
            type: Array,
            required: true,
        },
        colors: {
            type: Array,
            default: () => ['#123E6B'],
            required: false,
        },
    },
    setup(props) {
        const chartData = computed(() => ({
            labels: props.labels,
            datasets: [
                {
                    label: props.chartLabel,
                    data: props.values,
                    backgroundColor: props.colors,
                    borderColor: props.colors,
                },
            ],
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

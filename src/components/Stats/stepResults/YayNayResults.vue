<template>
    <canvas ref="chartRef" width="400" height="400" />
</template>

<script>
import { onMounted, onUnmounted, ref } from 'vue'
import Chart from 'chart.js/auto'

export default {
    name: 'YayNayResults',
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
        let chart
        const chartRef = ref(null)

        onMounted(() => {
            chart = new Chart(chartRef.value, {
                type: 'bar',
                data: {
                    labels: props.labels,
                    datasets: props.datasets,
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            })
        })

        onUnmounted(() => {
            chart.destroy()
        })

        return {
            chartRef,
            chart,
        }
    },
}
</script>

<style scoped></style>

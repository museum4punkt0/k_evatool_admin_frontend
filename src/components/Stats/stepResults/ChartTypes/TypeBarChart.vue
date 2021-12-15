<template>
    <div class="type-bar-chart">
        <canvas ref="chartRef" width="400" :height="getChartHeight" />
    </div>
</template>

<script>
import Chart from 'chart.js/auto'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { computed, onMounted, onUnmounted, ref } from 'vue'

export default {
    name: 'TypeBarChart',
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
            default: () => ['rgb(29, 78, 216)'],
            required: false,
        },
    },
    setup(props) {
        let chart
        const chartRef = ref(null)

        const getChartHeight = computed(() => {
            return props.chartLabel === 'binary' ? 150 : 400
        })

        onMounted(() => {
            chart = new Chart(chartRef.value, {
                plugins: [ChartDataLabels],
                type: 'bar',
                data: {
                    labels: props.labels,
                    datasets: [
                        {
                            barPercentage: 0.45,
                            label: props.chartLabel,
                            data: props.values,
                            backgroundColor: props.colors,
                            borderColor: props.colors,
                        },
                    ],
                },
                options: {
                    indexAxis: props.chartLabel === 'binary' ? 'y' : 'x',
                    scales: {
                        y: { beginAtZero: true },
                    },
                    plugins: {
                        legend: {
                            display:
                                props.chartLabel === 'binary' ? false : true,
                        },
                        tooltip: {
                            enabled: false,
                        },
                        datalabels: {
                            formatter: (value, ctx) => {
                                let sum = 0
                                let dataArr = ctx.chart.data.datasets[0].data
                                dataArr.map((data) => {
                                    sum += data
                                })
                                let percentage =
                                    ((value * 100) / sum).toFixed(0) + '%'
                                return percentage
                            },
                            color: props.colors,
                            align: 'end',
                            anchor: 'end',
                            padding: 5,
                            font: {
                                weight: 'bold',
                            },
                        },
                    },
                },
            })
        })

        onUnmounted(() => {
            chart.destroy()
        })

        return {
            chart,
            chartRef,
            getChartHeight,
        }
    },
}
</script>

<style scoped>
.type-bar-chart {
    width: 100%;
    height: auto;
}
</style>

<template>
    <canvas ref="chartRef" width="400" height="500" />
</template>

<script>
import { onMounted, onUnmounted, ref } from 'vue'
import Chart from 'chart.js/auto'
import ChartDataLabels from 'chartjs-plugin-datalabels'

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
        colors: {
            type: Array,
            default: () => ['rgb(29, 78, 216)'],
            required: false,
        },
    },
    setup(props) {
        let chart
        const chartRef = ref(null)

        const image = new Image()
        image.src = 'https://www.chartjs.org/img/chartjs-logo.svg'

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
                        x: {
                            ticks: {
                                display: false,
                            },
                        },
                    },
                    layout: {
                        padding: { bottom: 150 },
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
                                ctx.chart.data.datasets.forEach((dataset) => {
                                    sum += dataset.data[ctx.dataIndex]
                                })
                                return ((value * 100) / sum).toFixed(0) + '%'
                            },
                            color: function (context) {
                                return context.dataset.backgroundColor
                            },
                            align: 'end',
                            anchor: 'end',
                            padding: 5,
                            font: {
                                weight: 'bold',
                            },
                        },
                    },
                },
                plugins: [
                    ChartDataLabels,
                    {
                        afterDraw: (chart) => {
                            const ctx = chart.ctx
                            ctx.save()
                            const xAxis = chart.scales.x
                            const yAxis = chart.scales.y
                            const imageWidth =
                                (xAxis.width / xAxis.ticks.length) * 0.75
                            xAxis.ticks.forEach((value, index) => {
                                let x = xAxis.getPixelForTick(index)
                                let image = new Image()
                                image.src = value.label
                                ctx.drawImage(
                                    image,
                                    x - imageWidth / 2,
                                    yAxis.bottom + 10,
                                    imageWidth,
                                    (imageWidth * image.height) / image.width,
                                )
                            })
                            ctx.restore()
                        },
                    },
                ],
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

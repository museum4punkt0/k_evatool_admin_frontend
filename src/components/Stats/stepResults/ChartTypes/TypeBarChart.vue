<template>
    <div class="type-bar-chart">
        <canvas ref="chartRef" width="400" :height="getChartHeight" />
    </div>
</template>

<script>
import Chart from 'chart.js/auto'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

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
        const { t } = useI18n()

        let chart
        const chartRef = ref(null)

        const getChartHeight = computed(() => {
            return props.chartLabel === 'binary' ? 150 : 400
        })

        onMounted(() => {
            const getOrCreateTooltip = (chart) => {
                let tooltipEl = document.getElementById('tooltip')

                if (!tooltipEl) {
                    tooltipEl = document.createElement('div')
                    tooltipEl.id = 'tooltip'
                    if (props.chartLabel === 'binary') {
                        tooltipEl.classList.add('tooltip-binary')
                    }
                    chart.canvas.parentNode.appendChild(tooltipEl)
                }

                return tooltipEl
            }

            const externalTooltipHandler = (context) => {
                // Tooltip Element
                const { chart, tooltip } = context
                const tooltipEl = getOrCreateTooltip(chart)

                // Hide if no tooltip
                if (tooltip.opacity === 0) {
                    tooltipEl.style.opacity = 0
                    return
                }

                // Set Text
                if (tooltip.body) {
                    const answers = tooltip.dataPoints.map((data) => data.raw)
                    const tooltipText = document.createElement('p')
                    answers.forEach((value) => {
                        const text = document.createTextNode(
                            value + ' ' + t('answers', value),
                        )
                        tooltipText.appendChild(text)
                    })
                    while (tooltipEl?.firstChild) {
                        tooltipEl.firstChild.remove()
                    }
                    tooltipEl.appendChild(tooltipText)
                }

                const { offsetLeft: positionX, offsetTop: positionY } =
                    chart.canvas

                // Display, position, and set styles for font
                tooltipEl.style.opacity = 1
                tooltipEl.style.left = positionX + tooltip.caretX + 'px'
                tooltipEl.style.top = positionY + tooltip.caretY + 'px'
                tooltipEl.style.font = tooltip.options.bodyFont.string
                tooltipEl.style.padding =
                    tooltip.options.padding +
                    'px ' +
                    tooltip.options.padding +
                    'px'
            }

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
                    layout: {
                        padding: {
                            right: props.chartLabel === 'binary' ? 55 : 0,
                            top: props.chartLabel === 'binary' ? 0 : 20,
                        },
                    },
                    plugins: {
                        legend: {
                            display: false,
                        },
                        tooltip: {
                            enabled: false,
                            position: 'nearest',
                            external: externalTooltipHandler,
                        },
                        datalabels: {
                            formatter: (value, ctx) => {
                                let sum = 0
                                let dataArr = ctx.chart.data.datasets[0].data
                                dataArr.map((data) => {
                                    sum += data
                                })
                                let percentage =
                                    ((value * 100) / sum).toFixed(2) + '%'
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

<style lang="scss">
#tooltip {
    border-radius: 3px;
    opacity: 0;
    pointer-events: none;
    position: absolute;
    transform: translate(-50%, 25%);
    transition: all 0.1s ease 0s;
    padding: 6px;
    background-color: white;
    border: black solid 1px;
    &.tooltip-binary {
        transform: translate(-125%, -50%);
    }
    p {
        white-space: nowrap;
    }
}
</style>

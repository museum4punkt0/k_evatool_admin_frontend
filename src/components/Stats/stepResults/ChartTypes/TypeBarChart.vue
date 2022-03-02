<template>
    <div class="type-bar-chart">
        <div class="flex items-center">
            <span
                :style="'background-color: ' + colors[0] + ';'"
                class="box-label mr-2"
            />
            <p>
                {{
                    dayjs(surveyStepList?.results?.timespan?.start).format(
                        t('datepicker_date_formatter'),
                    ) +
                    t('datepicker_date_separator') +
                    dayjs(surveyStepList?.results?.timespan?.end).format(
                        t('datepicker_date_formatter'),
                    )
                }}
            </p>
        </div>
        <div v-if="showCompare" class="flex items-center">
            <span
                :style="'background-color: ' + colors[1] + ';'"
                class="box-label mr-2"
            />
            <p>
                {{
                    compareTimeSpan[0] +
                    t('datepicker_date_separator') +
                    compareTimeSpan[1]
                }}
            </p>
        </div>
        <canvas ref="chartRef" width="400" :height="getChartHeight" />
        <p
            v-if="
                !showCompare &&
                surveyStepList?.elementType === 'multipleChoice' &&
                surveyStepList?.elementParams?.maxSelectable > 1
            "
            class="text-xs mt-4"
            v-html="t('notice_multiple_choice_results')"
        />
    </div>
</template>

<script>
import tailwindColors from 'tailwindcss/colors'
import Chart from 'chart.js/auto'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'

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
        surveyStepList: {
            type: Object,
            required: true,
        },
        showCompare: {
            type: Boolean,
            default: false,
        },
        compareValues: {
            type: Array,
            default: () => [],
        },
        compareTimeSpan: {
            type: Array,
            default: () => [],
        },
    },
    setup(props) {
        const { t } = useI18n()
        let chart
        const chartRef = ref(null)
        const colors = [tailwindColors.blue['600'], tailwindColors.blue['400']]

        const getChartHeight = computed(() => {
            return props.chartLabel === 'binary' ? 150 : 400
        })

        const getChartData = computed(() => {
            return props.surveyStepList?.results?.timespan?.results
        })

        function getDataLabels() {
            return {
                formatter: (value, ctx) => {
                    if (props.showCompare) {
                        return value + '%'
                    }
                    let sum = 0
                    let dataArr = ctx.chart.data.datasets[0].data
                    dataArr.map((data) => {
                        sum += data
                    })
                    let percentage = (value * 100) / sum
                    return percentage % 1 === 0
                        ? percentage + '%'
                        : percentage.toFixed(2) + '%'
                },
                align: 'end',
                anchor: 'end',
                padding: 5,
                font: {
                    weight: 'bold',
                },
            }
        }

        function getData(dataArr) {
            let sum = 0
            dataArr.map((data) => {
                sum += data
            })
            return dataArr.map((data) => {
                let percentage = (data * 100) / sum
                return percentage % 1 === 0 ? percentage : percentage.toFixed(2)
            })
        }

        function pushDataset(data, index) {
            chart.data.datasets.push({
                barPercentage: 0.45,
                label: props.chartLabel,
                data: data,
                backgroundColor: colors[index],
                borderColor: colors[index],
                datalabels: {
                    color: colors[index],
                },
            })
        }

        watch(
            () => props.showCompare,
            () => {
                chart.data.datasets = []
                if (props.showCompare) {
                    pushDataset(
                        getData(
                            Object.values(
                                props.surveyStepList.results.timespan.results,
                            ),
                        ),
                        0,
                    )
                    pushDataset(getData(props.compareValues), 1)
                } else {
                    pushDataset(
                        Object.values(
                            props.surveyStepList.results.timespan.results,
                        ),
                        0,
                    )
                }
                chart.options.plugins.datalabels = getDataLabels()
                chart.update()
            },
        )

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
                    const answers = props.showCompare
                        ? tooltip.dataPoints.map((data) => data)
                        : tooltip.dataPoints.map((data) => data.raw)
                    const tooltipText = document.createElement('p')

                    let datasetIndex
                    if (props.showCompare) {
                        answers.forEach((value) => {
                            datasetIndex = value.datasetIndex
                            const showValue =
                                datasetIndex === 0
                                    ? Object.values(getChartData.value)[
                                          value.dataIndex
                                      ]
                                    : Object.values(props.compareValues)[
                                          value.dataIndex
                                      ]
                            let text = document.createTextNode(
                                showValue + ' ' + t('answers', showValue),
                            )
                            tooltipText.appendChild(text)
                        })
                    } else {
                        answers.forEach((value) => {
                            let text = document.createTextNode(
                                value + ' ' + t('answers', value),
                            )
                            tooltipText.appendChild(text)
                        })
                    }

                    let sum = 0
                    const tooltipSum = document.createElement('p')

                    if (props.showCompare) {
                        const sumArr =
                            datasetIndex === 0
                                ? Object.values(getChartData.value)
                                : Object.values(props.compareValues)
                        sumArr.map((data) => {
                            sum += data
                        })
                    } else {
                        tooltip.dataPoints[0].dataset.data.map((data) => {
                            sum += data
                        })
                    }
                    tooltipSum.appendChild(
                        document.createTextNode('n = ' + sum),
                    )

                    while (tooltipEl?.firstChild) {
                        tooltipEl.firstChild.remove()
                    }
                    tooltipEl.appendChild(tooltipText)
                    tooltipEl.appendChild(tooltipSum)
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
                            data: Object.values(
                                props.surveyStepList.results.timespan.results,
                            ),
                            backgroundColor: colors[0],
                            borderColor: colors[0],
                            datalabels: {
                                color: colors[0],
                            },
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
                    devicePixelRatio: 4,
                    plugins: {
                        legend: {
                            display: false,
                        },
                        tooltip: {
                            enabled: false,
                            position: 'nearest',
                            external: externalTooltipHandler,
                        },
                        datalabels: getDataLabels(),
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
            colors,
            dayjs,
            getChartHeight,
            t,
        }
    },
}
</script>

<style lang="scss" scoped>
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

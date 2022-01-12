<template>
    <div id="legend-container" class="mb-5"></div>
    <canvas ref="chartRef" width="400" height="500" />
</template>

<script>
import { onMounted, onUnmounted, ref } from 'vue'
import Chart from 'chart.js/auto'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { useStore } from 'vuex'

export default {
    name: 'YayNayResults',
    props: {
        chartLabel: {
            type: String,
            required: true,
        },
        chartLegend: {
            type: Object,
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
        const store = useStore()

        let chart
        const chartRef = ref(null)

        function getLegendContainerLabel(key) {
            if (props.chartLegend.trueValue === key) {
                return props.chartLegend.trueLabel[store.state.languageCode]
            } else if (props.chartLegend.falseValue === key) {
                return props.chartLegend.falseLabel[store.state.languageCode]
            }
        }

        onMounted(() => {
            //**
            // LEGENDE ABOVE CHART
            // **//
            const getOrCreateLegendList = (chart, id) => {
                const legendContainer = document.getElementById(id)
                let listContainer = legendContainer?.querySelector('ul')

                if (!listContainer) {
                    listContainer = document.createElement('ul')
                    legendContainer.appendChild(listContainer)
                }
                return listContainer
            }

            const htmlLegendPlugin = {
                id: 'htmlLegend',
                afterUpdate(chart, args, options) {
                    const ul = getOrCreateLegendList(chart, options.containerID)

                    // Remove old legend items
                    while (ul.firstChild) {
                        ul.firstChild.remove()
                    }

                    // Reuse the built-in legendItems generator
                    const items =
                        chart.options.plugins.legend.labels.generateLabels(
                            chart,
                        )

                    items.forEach((item) => {
                        const li = document.createElement('li')
                        li.onclick = () => {
                            chart.setDatasetVisibility(
                                item.datasetIndex,
                                !chart.isDatasetVisible(item.datasetIndex),
                            )
                            chart.update()
                        }

                        // Color box
                        const boxSpan = document.createElement('span')
                        boxSpan.style.background = item.fillStyle

                        // Text
                        const textContainer = document.createElement('p')
                        textContainer.style.textDecoration = item.hidden
                            ? 'line-through'
                            : ''

                        const text = document.createTextNode(
                            getLegendContainerLabel(item.text),
                        )
                        textContainer.appendChild(text)

                        li.appendChild(boxSpan)
                        li.appendChild(textContainer)
                        ul.appendChild(li)
                    })
                },
            }

            //**
            // TOOLTIP
            // **//
            const getOrCreateTooltip = (chart) => {
                let tooltipEl = document.getElementById('tooltip')
                console.log(chart.canvas.parentNode)

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
                            value + ' Antworten',
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
                        padding: { bottom: 150, top: 20 },
                    },
                    plugins: {
                        htmlLegend: {
                            // ID of the container to put the legend in
                            containerID: 'legend-container',
                        },
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
                                ctx.chart.data.datasets.forEach((dataset) => {
                                    sum += dataset.data[ctx.dataIndex]
                                })
                                return ((value * 100) / sum).toFixed(2) + '%'
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
                    htmlLegendPlugin,
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

<style lang="scss">
#legend-container {
    ul {
        display: flex;
        flex-direction: row;
        margin: 0;
        padding: 0;
        li {
            align-items: center;
            cursor: pointer;
            display: flex;
            flex-direction: row;
            margin-left: 10px;
            span {
                display: inline-block;
                height: 20px;
                width: 20px;
                margin-right: 10px;
            }
            p {
                margin: 0;
                padding: 0;
            }
        }
    }
}
</style>

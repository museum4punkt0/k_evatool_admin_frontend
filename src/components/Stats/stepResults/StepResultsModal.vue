<template>
    <TransitionRoot appear :show="isOpen" as="template">
        <Dialog as="div" @close="closeModal">
            <DialogOverlay class="fixed inset-0 bg-black opacity-70 z-10" />
            <div class="fixed inset-0 z-10 overflow-y-auto">
                <div class="min-h-screen px-4 text-center">
                    <TransitionChild
                        as="template"
                        enter="duration-300 ease-out"
                        enter-from="opacity-0"
                        enter-to="opacity-100"
                        leave="duration-200 ease-in"
                        leave-from="opacity-100"
                        leave-to="opacity-0"
                    >
                        <DialogOverlay class="fixed inset-0" />
                    </TransitionChild>

                    <span
                        class="inline-block h-screen align-middle"
                        aria-hidden="true"
                    >
                        &#8203;
                    </span>

                    <TransitionChild
                        as="template"
                        enter="duration-300 ease-out"
                        enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100"
                        leave="duration-200 ease-in"
                        leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95"
                    >
                        <div
                            class="inline-block w-full max-w-xl p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
                        >
                            <div class="flex justify-between">
                                <DialogTitle
                                    as="h3"
                                    class="text-lg font-medium leading-6 text-gray-900 text-capitalize"
                                    v-html="
                                        surveyStepList?.elementParams?.question
                                            ?.de
                                    "
                                ></DialogTitle>
                                <x-icon
                                    class="h-6 w-6 pointer"
                                    @click="closeModal"
                                />
                            </div>

                            <div class="mt-2">
                                <!--                                <pre>{{ surveyStepId }}</pre>-->
                                <pre
                                    v-if="
                                        surveyStepList.results?.timespan.results
                                            .length === 0
                                    "
                                >
                                    {{ surveyStepList }}
                                </pre>
                                <type-bar-chart
                                    v-else-if="
                                        barChart.includes(
                                            surveyStepList.elementType,
                                        )
                                    "
                                    :chart-label="surveyStepList.elementType"
                                    :labels="getChartLabels"
                                    :values="
                                        Object.values(
                                            surveyStepList.results.timespan
                                                .results,
                                        )
                                    "
                                />

                                <yay-nay-results
                                    v-else-if="
                                        surveyStepList.elementType === 'yayNay'
                                    "
                                    :chart-label="surveyStepList.elementType"
                                    :labels="
                                        Array.from(
                                            surveyStepList.results.timespan.results.images.keys(),
                                        )
                                    "
                                    :datasets="getDatasets(surveyStepList)"
                                />
                                <text-analysis-results
                                    v-else-if="
                                        ['textInput', 'voiceInput'].includes(
                                            surveyStepList.elementType,
                                        )
                                    "
                                    :results="
                                        surveyStepList.results.timespan.results
                                    "
                                />
                                <video-results
                                    v-else-if="
                                        surveyStepList.elementType === 'video'
                                    "
                                    :element-params="
                                        surveyStepList?.elementParams
                                    "
                                    :results="
                                        surveyStepList.results.timespan.results
                                    "
                                />
                            </div>
                        </div>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script>
import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
    DialogTitle,
} from '@headlessui/vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { StopIcon, TrashIcon, XIcon } from '@heroicons/vue/outline'
import TypeBarChart from './ChartTypes/TypeBarChart.vue'
import YayNayResults from './YayNayResults.vue'
import TextAnalysisResults from './TextAnalysisResults.vue'
import VideoResults from './VideoResults.vue'
import VideoResult from '../stepResult/VideoResult.vue'

export default {
    name: 'AssetModal',
    components: {
        TypeBarChart,
        TransitionRoot,
        TransitionChild,
        Dialog,
        DialogOverlay,
        DialogTitle,
        TrashIcon,
        StopIcon,
        XIcon,
        YayNayResults,
        TextAnalysisResults,
        VideoResults,
        VideoResult,
    },
    props: {
        surveyStepId: {
            type: Number,
            required: true,
        },
        surveyStepList: {
            type: Object,
            required: true,
        },
        isOpen: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update:is-open'],
    setup(props, { emit }) {
        const store = useStore()
        const { t } = useI18n()

        const barChart = [
            'simpleText',
            'binary',
            'emoji',
            'starRating',
            'multipleChoice',
        ]

        const modalIsOpen = computed({
            get: () => props.isOpen,
            set: (val) => emit('update:is-open', val),
        })

        const getChartLabels = computed({
            get: () => {
                if (props.surveyStepList?.elementParams?.emojis) {
                    const keys = Object.keys(
                        props.surveyStepList.results.timespan.results,
                    )
                    return keys.map((x) => {
                        return props.surveyStepList.elementParams.emojis.find(
                            (y) => x === y.meaning,
                        )?.type
                    })
                }
                return Object.keys(
                    props.surveyStepList.results.timespan.results,
                )
            },
        })

        const getDatasets = (surveyStepList) => {
            if (surveyStepList.elementType === 'yayNay') {
                const colors = ['rgb(29, 78, 216)', 'rgb(255, 78, 216)']
                const datasets = []
                const keys = []
                surveyStepList.results.timespan.results.images.forEach(
                    (image) => {
                        Object.keys(image).forEach((key) => {
                            if (!keys.includes(key)) {
                                keys.push(key)
                            }
                        })
                    },
                )
                keys.forEach((key, index) => {
                    const data = []

                    datasets.push({
                        label: key,
                        data,
                        borderColor: colors[index],
                        backgroundColor: colors[index],
                    })
                })

                surveyStepList.results.timespan.results.images.forEach(
                    (image) => {
                        Object.entries(image).forEach((entry) => {
                            datasets
                                .find((d) => d.label === entry[0])
                                .data.push(entry[1])
                        })
                    },
                )
                return datasets
            }
            return []
        }

        return {
            modalIsOpen,
            store,
            t,
            barChart,
            closeModal() {
                modalIsOpen.value = false
            },
            getDatasets,
            getChartLabels,
        }
    },
}
</script>

<style scoped></style>

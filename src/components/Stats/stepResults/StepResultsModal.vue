<template>
    <TransitionRoot
        appear
        :show="isOpen"
        as="template"
        @afterLeave="afterLeaveToRemoveInfoInParent()"
    >
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
                        <DialogOverlay class="fixed inset-0 mx-4" />
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
                            class="inline-block w-full max-w-xl my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
                        >
                            <div
                                class="bg-gray-200 rounded-t-2xl p-6 flex justify-between"
                            >
                                <DialogTitle
                                    as="h3"
                                    class="text-lg font-medium leading-6 text-gray-900 text-capitalize"
                                    v-html="t('stats')"
                                ></DialogTitle>
                                <x-icon
                                    class="h-6 w-6 pointer"
                                    @click="closeModal"
                                />
                            </div>

                            <div
                                v-if="dataHasLoaded"
                                id="results-content"
                                class="mt-6 px-6 pb-6"
                            >
                                <!--                                <pre>{{ surveyStepId }}</pre>-->
                                <h3
                                    class="mb-3"
                                    v-html="
                                        surveyStepList?.elementParams?.question[
                                            store.state.languageCode
                                        ]
                                    "
                                />
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
                                    :survey-step-list="surveyStepList"
                                    :show-compare="compareWith"
                                    :compare-values="
                                        surveyStepCompareList.results?.timespan
                                            ?.results
                                            ? Object.values(
                                                  surveyStepCompareList.results
                                                      ?.timespan?.results,
                                              )
                                            : []
                                    "
                                    :compare-time-span="timeSpanCompare"
                                />

                                <yay-nay-results
                                    v-else-if="
                                        surveyStepList.elementType === 'yayNay'
                                    "
                                    :chart-label="surveyStepList.elementType"
                                    :chart-legend="surveyStepList.elementParams"
                                    :labels="getImageLabels"
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
                            <div
                                v-else
                                class="w-full h-64 flex items-center justify-center flex-col"
                            >
                                <div
                                    :style="{ borderTopColor: 'transparent' }"
                                    class="w-16 h-16 mb-6 border-4 border-blue-900 border-solid rounded-full animate-spin"
                                ></div>
                                <p class="text-lg font-medium">
                                    {{ t('status_loading') }}
                                </p>
                            </div>
                            <div
                                v-if="
                                    !['textInput', 'voiceInput'].includes(
                                        surveyStepList.elementType,
                                    ) && dataHasLoaded
                                "
                                class="flex w-full bg-gray-100 rounded-b-2xl py-3 px-4"
                                :class="
                                    timeSpanCompare.length > 0 &&
                                    barChart.includes(
                                        surveyStepList.elementType,
                                    )
                                        ? 'justify-between'
                                        : 'justify-end'
                                "
                            >
                                <div
                                    v-if="
                                        timeSpanCompare.length > 0 &&
                                        barChart.includes(
                                            surveyStepList.elementType,
                                        )
                                    "
                                    class="flex items-center mr-2"
                                >
                                    <template
                                        v-if="
                                            typeof surveyStepCompareList.results
                                                ?.timespan?.results === 'object'
                                        "
                                    >
                                        <p
                                            class="text-xs whitespace-nowrap mr-2"
                                        >
                                            {{ t('label_compare_with') }}
                                        </p>
                                        <form-toggle
                                            v-model:enabled="compareWith"
                                            :label="''"
                                            class=""
                                        />
                                    </template>
                                    <template v-else>
                                        <p
                                            class="text-xs whitespace-nowrap mr-2"
                                        >
                                            {{
                                                t(
                                                    'notice_filter_has_no_results',
                                                )
                                            }}
                                        </p>
                                    </template>
                                </div>
                                <button
                                    v-tippy="{
                                        content: t(
                                            'tooltip_save_result_content',
                                        ),
                                        trigger: 'mouseenter',
                                    }"
                                    :disabled="isSaving"
                                    class="primary"
                                    @click="saveResultsContent"
                                >
                                    <animated-loader v-if="isSaving" />
                                    <span v-else class="flex">
                                        {{ t('action_save_result_content') }}
                                        <download-icon
                                            class="ml-3 h-6 w-6 pointer"
                                        />
                                    </span>
                                </button>
                            </div>
                        </div>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script>
import tailwindColors from 'tailwindcss/colors'
import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
    DialogTitle,
} from '@headlessui/vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'
import {
    DownloadIcon,
    StopIcon,
    TrashIcon,
    XIcon,
} from '@heroicons/vue/outline'
import TypeBarChart from './ChartTypes/TypeBarChart.vue'
import YayNayResults from './YayNayResults.vue'
import TextAnalysisResults from './TextAnalysisResults.vue'
import VideoResults from './VideoResults.vue'
import VideoResult from '../stepResult/VideoResult.vue'
import { saveAs } from 'file-saver'
import { toBlob } from 'html-to-image'
import AnimatedLoader from '@/components/Common/AnimatedLoader.vue'
import FormToggle from '@/components/Forms/FormToggle.vue'
import dayjs from 'dayjs'

export default {
    name: 'AssetModal',
    components: {
        FormToggle,
        AnimatedLoader,
        TypeBarChart,
        TransitionRoot,
        TransitionChild,
        Dialog,
        DialogOverlay,
        DialogTitle,
        DownloadIcon,
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
        surveyStepCompareList: {
            type: Object,
            default: () => {},
        },
        isOpen: {
            type: Boolean,
            default: false,
        },
        timeSpanCompare: {
            type: Array,
            default: () => [],
        },
        dataHasLoaded: {
            type: Boolean,
            required: true,
        },
    },
    emits: [
        'update:is-open',
        'update:data-has-loaded',
        'update:survey-step-list',
    ],
    setup(props, { emit }) {
        const store = useStore()
        const { t } = useI18n()
        const isSaving = ref(false)
        const compareWith = ref(false)
        const isClosing = ref(false)

        const barChart = [
            'simpleText',
            'binary',
            'emoji',
            'starRating',
            'multipleChoice',
        ]

        const assets = computed({
            get: () => store.state.assets.assets,
        })

        const modalIsOpen = computed({
            get: () => props.isOpen,
            set: (val) => {
                emit('update:is-open', val)
            },
        })

        const afterLeaveToRemoveInfoInParent = () => {
            emit('update:data-has-loaded', false)
            emit('update:survey-step-list', {})
            isClosing.value = false
        }

        const getImageLabels = computed({
            get: () => {
                let images = []
                props.surveyStepList?.elementParams?.assetIds?.forEach((x) =>
                    images.push(
                        assets.value.find((item) => item.id === x)?.urls
                            .original,
                    ),
                )
                return images
            },
        })

        const getChartLabels = computed({
            get: () => {
                if (props.surveyStepList?.elementParams?.emojis) {
                    return props.surveyStepList.elementParams.emojis.map(
                        (emoji) => emoji.type,
                    )
                }
                if (props.surveyStepList?.elementParams?.options) {
                    return props.surveyStepList?.elementParams?.options.map(
                        (option) => option.labels[store.state.languageCode],
                    )
                }
                const trueAndFalseLabel = ['binary', 'yayNay']
                if (
                    trueAndFalseLabel.includes(
                        props.surveyStepList?.elementType,
                    )
                ) {
                    return [
                        props.surveyStepList?.elementParams.trueLabel[
                            store.state.languageCode
                        ],
                        props.surveyStepList?.elementParams.falseLabel[
                            store.state.languageCode
                        ],
                    ]
                }
                return Object.keys(
                    props.surveyStepList.results.timespan.results,
                )
            },
        })

        const closeModal = () => {
            compareWith.value = false
            modalIsOpen.value = false
        }
        const colors = [
            tailwindColors.green['600'],
            tailwindColors.red['700'],
            tailwindColors.green['400'],
            tailwindColors.red['500'],
        ]

        const getDatasets = (surveyStepList) => {
            const datasets = []
            const keys = []
            keys.push(surveyStepList.elementParams.trueValue)
            keys.push(surveyStepList.elementParams.falseValue)
            keys.forEach((key, index) => {
                const data = []

                datasets.push({
                    label: key,
                    data,
                    borderColor: colors[index],
                    backgroundColor: colors[index],
                })
            })
            datasets.forEach((set) => {
                surveyStepList.results.timespan.results.forEach((result) => {
                    set.data.push(result[set.label])
                })
            })
            return datasets
        }

        function saveResultsContent() {
            if (isSaving.value) {
                return
            }
            isSaving.value = true
            const fileName =
                t('stats') +
                '_id' +
                props.surveyStepId +
                '_' +
                props.surveyStepList?.results?.timespan?.start +
                '_' +
                props.surveyStepList?.results?.timespan?.end +
                '.png'
            const resultsCanvas = document.getElementById('results-content')

            toBlob(resultsCanvas, {
                backgroundColor: '#ffffff',
                height: resultsCanvas.offsetHeight + 30,
            }).then((blob) => {
                saveAs(blob, fileName)
                isSaving.value = false
            })
        }

        return {
            afterLeaveToRemoveInfoInParent,
            assets,
            modalIsOpen,
            store,
            t,
            barChart,
            compareWith,
            closeModal,
            dayjs,
            getDatasets,
            getChartLabels,
            getImageLabels,
            isSaving,
            saveResultsContent,
        }
    },
}
</script>

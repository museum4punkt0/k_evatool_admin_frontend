<template>
    <TransitionRoot appear :show="open" as="template">
        <Dialog as="div">
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
                                >
                                    {{ t('stats_export') }}
                                </DialogTitle>
                                <x-icon
                                    class="h-6 w-6 pointer"
                                    @click="closeModal"
                                />
                            </div>

                            <div class="mt-4">
                                <div class="my-4 grid grid-cols-2 gap-4">
                                    <div>
                                        <label for="start" class="mb-1">
                                            {{ t('start') }}
                                        </label>
                                        <input
                                            id="start"
                                            v-model="params.start"
                                            type="text"
                                        />
                                    </div>
                                    <div>
                                        <label for="end" class="mb-1">
                                            {{ t('end') }}
                                        </label>
                                        <input
                                            id="end"
                                            v-model="params.end"
                                            type="text"
                                        />
                                    </div>
                                </div>

                                <form-toggle
                                    v-model:enabled="params.demo"
                                    label="Demo"
                                />

                                <form-select
                                    v-model:selected="params.exportType"
                                    class="mt-3"
                                    :label="t('export_type')"
                                    :options="exportTypes"
                                    value-key="id"
                                    title-key="title"
                                />

                                <hr class="my-4" />

                                <div class="flex justify-between items-center">
                                    <div>
                                        <template v-if="statsExportData.hash">
                                            <button
                                                class="primary"
                                                @click="downloadExport"
                                            >
                                                Download
                                            </button>
                                            {{ statsExportData.url }}
                                        </template>
                                        <template v-else>
                                            <button
                                                class="primary"
                                                :disabled="
                                                    statsExportData?.totalResults ===
                                                        0 || v$.$invalid
                                                "
                                                @click="exportStats(true)"
                                            >
                                                {{ t('action_export') }}
                                                <loader
                                                    v-if="isExporting"
                                                ></loader>
                                            </button>
                                            <button
                                                class="link ml-4"
                                                @click="closeModal"
                                            >
                                                {{ t('action_cancel') }}
                                            </button>
                                        </template>
                                    </div>
                                    <div>
                                        <div class="inline text-gray-500">
                                            {{ t('number_of_results') }}:
                                            {{ statsExportData.totalResults }}
                                        </div>
                                    </div>
                                </div>
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
    Dialog,
    DialogOverlay,
    DialogTitle,
    TransitionRoot,
    TransitionChild,
} from '@headlessui/vue'

import { useI18n } from 'vue-i18n'
import { XIcon } from '@heroicons/vue/outline'
import { computed, ref, watch } from 'vue'
import Datepicker from 'vue3-date-time-picker'
import SURVEY_STATS_SERVICE from '../../services/surveyStatsService'
import moment from 'moment'
import FormToggle from '../Forms/FormToggle.vue'
import useVuelidate from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import FormSelect from '../Forms/FormSelect.vue'
import { useState } from '../../composables/state'
import Loader from '../../components/Common/Loader.vue'

const dateFormat = helpers.regex(
    /^\d{4}-(02-(0[1-9]|[12][0-9])|(0[469]|11)-(0[1-9]|[12][0-9]|30)|(0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))$/,
)

const maxDate = (param) => (value) => {
    return (
        moment(value, 'YYYY-MM-DD').format('X') <=
        moment(param, 'YYYY-MM-DD').format('X')
    )
}

const minDate = (param) => (value) => {
    return (
        moment(value, 'YYYY-MM-DD').format('X') >=
        moment(param, 'YYYY-MM-DD').format('X')
    )
}

const exportTypes = [
    { id: 'xlsx', title: 'Excel (xlsx)' },
    { id: 'csv', title: 'CSV' },
    { id: 'json', title: 'JSON' },
]

const validExportType = (value) =>
    exportTypes.findIndex((x) => x.id === value) >= 0

export default {
    name: 'SurveyStatsExportModal',
    components: {
        FormSelect,
        FormToggle,
        TransitionRoot,
        TransitionChild,
        Dialog,
        DialogOverlay,
        DialogTitle,
        XIcon,
        Datepicker,
        Loader,
    },
    props: {
        open: {
            type: Boolean,
            default: false,
        },
        surveyId: {
            type: Number,
            default: -1,
        },
    },
    emits: ['update:open'],
    setup(props, { emit }) {
        const { t } = useI18n()

        const modalIsOpen = computed({
            get: () => props.open,
            set: (val) => emit('update:open', val),
        })

        const closeModal = () => {
            modalIsOpen.value = false
        }

        const [isExporting, setIsExporting] = useState(false)

        const statsExportData = ref({})

        const params = ref({})

        params.value.surveyId = ref(props.surveyId).value
        params.value.exportType = null
        params.value.end = moment().format('YYYY-MM-DD')
        params.value.start = moment().subtract(1, 'weeks').format('YYYY-MM-DD')
        params.value.demo = true

        const exportStats = async (execute = false) => {
            setIsExporting(true)
            statsExportData.value = await SURVEY_STATS_SERVICE.exportStats(
                { ...params.value },
                execute,
            )
            setIsExporting(false)
        }

        const downloadExport = async () => {
            if (statsExportData.value.hash) {
                const downloadFile = await SURVEY_STATS_SERVICE.downloadExport(
                    props.surveyId,
                    statsExportData.value,
                )

                const linkSource = `data:${statsExportData.value.mime};base64,${downloadFile}`
                const downloadLink = document.createElement('a')
                const fileName = statsExportData.value.filename

                downloadLink.href = linkSource
                downloadLink.download = fileName
                downloadLink.click()
            }
        }

        const validations = computed({
            get: () => {
                return {
                    start: {
                        required,
                        dateFormat,
                        maxDate: maxDate(params.value.end),
                    },
                    end: {
                        required,
                        dateFormat,
                        minDate: minDate(params.value.start),
                    },
                    demo: { required },
                    exportType: { validExportType },
                }
            },
            set: () => {},
        })

        const v$ = useVuelidate(validations, params.value)

        watch(
            () => params.value,
            () => {
                if (!v$.value.$invalid) {
                    exportStats(false)
                }
            },
            { deep: true, immediate: true },
        )

        return {
            t,
            modalIsOpen,
            closeModal,
            params,
            exportStats,
            statsExportData,
            v$,
            moment,
            validations,
            exportTypes,
            downloadExport,
            isExporting,
        }
    },
}
</script>

<style scoped></style>

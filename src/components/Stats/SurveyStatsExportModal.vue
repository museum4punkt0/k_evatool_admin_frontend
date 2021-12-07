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
                                <div class="flex mb-3">
                                    <Datepicker
                                        v-model="timespan"
                                        range
                                        locale="de"
                                        :cancel-text="t('action_cancel')"
                                        :select-text="t('action_select')"
                                        :enable-time-picker="false"
                                        :format="format"
                                        :preview-format="format"
                                        class="w-full"
                                    />
                                </div>
                                <button class="primary">
                                    {{ t('action_export') }}
                                </button>
                                <button class="link ml-4" @click="closeModal">
                                    {{ t('action_cancel') }}
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
import {
    Dialog,
    DialogOverlay,
    DialogTitle,
    TransitionRoot,
    TransitionChild,
} from '@headlessui/vue'
import { useI18n } from 'vue-i18n'
import { XIcon } from '@heroicons/vue/outline'
import { computed, ref } from 'vue'
import Datepicker from 'vue3-date-time-picker'
import SURVEY_STATS_SERVICE from '../../services/surveyStatsService'
import dayjs from 'dayjs'

export default {
    name: 'SurveyStatsExportModal',
    components: {
        TransitionRoot,
        TransitionChild,
        Dialog,
        DialogOverlay,
        DialogTitle,
        XIcon,
        Datepicker,
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

        const params = ref(null)

        const closeModal = () => {
            modalIsOpen.value = false
        }

        params.value.timespan = null
        params.value.endDate = new Date()
        params.value.startDate = new Date(
            new Date().setDate(params.value.endDate.getDate() - 30 * 6),
        )

        params.value.timespan = [params.value.startDate, params.value.endDate]
        params.value.demo = true

        const format = (date) => {
            // from Date
            const dayFrom = date[0].getDate()
            const monthFrom = date[0].getMonth() + 1
            const yearFrom = date[0].getFullYear()
            // until Date
            const dayTil = date[1].getDate()
            const monthTil = date[1].getMonth() + 1
            const yearTil = date[1].getFullYear()

            return `${dayFrom}.${monthFrom}.${yearFrom} - ${dayTil}.${monthTil}.${yearTil}`
        }

        const exportStats = async (execute = false) => {
            return await SURVEY_STATS_SERVICE.exportStats(params)
            /* return await SURVEY_STATS_SERVICE.exportStats({
                surveyId: props.surveyId,
                start: dayjs(params.value.timespan.value[0]).format(
                    'YYYY-MM-DD',
                ),
                end: dayjs(params.value.timespan.value[1]).format('YYYY-MM-DD'),
                demo: params.value.demo,
                execute,
            })*/
        }

        return {
            t,
            modalIsOpen,
            closeModal,
            params,
            format,
            exportStats,
        }
    },
}
</script>

<style scoped></style>

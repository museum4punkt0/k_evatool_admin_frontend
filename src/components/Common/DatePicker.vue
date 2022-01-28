<template>
    <litepie-datepicker
        v-model="timeSpan"
        trigger="open-datepicker"
        :shortcuts="datepickerShortcuts"
        :auto-apply="false"
        overlay
        :options="datepickerOptions"
        :formatter="formatter"
        :disable-date="disableDate"
        :separator="t('datepicker_date_separator')"
    />
</template>

<script>
import LitepieDatepicker from 'litepie-datepicker'
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

export default {
    name: 'DatePicker',
    components: { LitepieDatepicker },
    props: {
        modelValue: {
            type: Array,
            default: () => [],
        },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const { t } = useI18n()
        const timeSpan = ref([])
        const datepickerOptions = ref({
            footer: {
                apply: t('action_select'),
                cancel: t('action_cancel'),
            },
        })

        onMounted(() => {
            if (props.modelValue) {
                timeSpan.value = props.modelValue
            }
        })

        const datepickerShortcuts = () => {
            return [
                {
                    label: t('action_datepicker_today'),
                    atClick: () => {
                        const date = new Date()
                        return [
                            new Date(date.setDate(date.getDate())),
                            new Date(),
                        ]
                    },
                },
                {
                    label: t('action_datepicker_yesterday'),
                    atClick: () => {
                        const date = new Date()
                        return [
                            new Date(date.setDate(date.getDate() - 1)),
                            date,
                        ]
                    },
                },
                {
                    label: t('action_datepicker_past') + '7 ' + t('days', 2),
                    atClick: () => {
                        const date = new Date()
                        return [
                            new Date(new Date().setDate(date.getDate() - 6)),
                            date,
                        ]
                    },
                },
                {
                    label: t('action_datepicker_pastMonth'),
                    atClick: () => {
                        const date = new Date()
                        return [
                            new Date(
                                date.getFullYear(),
                                date.getMonth() - 1,
                                1,
                            ),
                            new Date(date.getFullYear(), date.getMonth(), 0),
                        ]
                    },
                },
                {
                    label: t('action_datepicker_currentMonth'),
                    atClick: () => {
                        const date = new Date()
                        return [
                            new Date(date.getFullYear(), date.getMonth(), 1),
                            date,
                        ]
                    },
                },
            ]
        }

        const formatter = ref({
            date: t('datepicker_date_formatter'),
        })

        const disableDate = (date) => {
            return date > new Date()
        }

        watch(
            () => timeSpan.value,
            () => {
                emit('update:modelValue', timeSpan)
            },
        )

        return {
            datepickerOptions,
            datepickerShortcuts,
            disableDate,
            formatter,
            t,
            timeSpan,
        }
    },
}
</script>

<style scoped></style>

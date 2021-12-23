<template>
    <div
        v-if="notifications.length > 0"
        class="mb-5 bottom-1 left-5 absolute z-10"
    >
        <div
            v-for="notification in notifications"
            :key="notification.id"
            class="my-2 flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md pointer"
            @click="onRemove(notification)"
        >
            <div
                class="flex items-center justify-center w-16"
                :class="getBackgroundColor(notification.type)"
            >
                <check-circle-icon
                    v-if="notification.type === TYPES.SUCCESS"
                    class="text-white h-6 w-6"
                />
                <information-circle-icon
                    v-else-if="notification.type === TYPES.INFO"
                    class="text-white h-6 w-6"
                />
                <information-circle-icon
                    v-else-if="notification.type === TYPES.WARNING"
                    class="text-white h-6 w-6"
                />
                <exclamation-circle-icon
                    v-else-if="notification.type === TYPES.ERROR"
                    class="text-white h-6 w-6"
                />
            </div>

            <div class="px-4 py-2 -mx-3">
                <div class="mx-3">
                    <span
                        v-if="notification.type === TYPES.SUCCESS"
                        class="font-semibold text-green-500"
                    >
                        {{ t('notification_success_headline') }}
                    </span>
                    <span
                        v-else-if="notification.type === TYPES.INFO"
                        class="font-semibold text-blue-500"
                    >
                        {{ t('notification_info_headline') }}
                    </span>
                    <span
                        v-else-if="notification.type === TYPES.WARNING"
                        class="font-semibold text-yellow-400"
                    >
                        {{ t('notification_warning_headline') }}
                    </span>
                    <span
                        v-else-if="notification.type === TYPES.ERROR"
                        class="font-semibold text-red-500"
                    >
                        {{ t('notification_error_headline') }}
                    </span>
                    <p
                        class="text-sm text-gray-600 dark:text-gray-200"
                        v-html="t(notification.message)"
                    ></p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    CheckCircleIcon,
    ExclamationCircleIcon,
    InformationCircleIcon,
} from '@heroicons/vue/solid'
import { TrashIcon } from '@heroicons/vue/outline'
import { createNamespacedHelpers } from 'vuex-composition-helpers'
import { TYPES } from '../../store/notifications'
import { useI18n } from 'vue-i18n'
const { useState, useActions } = createNamespacedHelpers('notifications')

export default {
    components: {
        TrashIcon,
        CheckCircleIcon,
        ExclamationCircleIcon,
        InformationCircleIcon,
    },
    setup() {
        const { t } = useI18n()
        const { notifications } = useState(['notifications'])
        const { remove } = useActions(['remove'])

        const getBackgroundColor = (type) => {
            if (type === TYPES.ERROR) {
                return 'bg-red-500'
            } else if (type === TYPES.WARNING) {
                return 'bg-yellow-400'
            } else if (type === TYPES.SUCCESS) {
                return 'bg-green-500'
            }
            return 'bg-blue-500'
        }

        const onRemove = (notification) => {
            remove({ notification })
        }
        return {
            getBackgroundColor,
            t,
            TYPES,
            notifications,
            onRemove,
        }
    },
}
</script>

<style scoped></style>

<template>
    <ul v-if="notifications.length > 0" class="notifications">
        <li
            v-for="notification in notifications"
            :key="notification.id"
            class="flex text-black p-4 border border-black"
            :class="{
                'bg-white': notification.type === TYPES.INFO,
                'bg-green-400': notification.type === TYPES.SUCCESS,
                'bg-yellow-400': notification.type === TYPES.WARNING,
                'bg-red-400': notification.type === TYPES.ERROR,
            }"
        >
            <div class="flex-grow">
                <!-- {{ notification.type }}: -->
                {{ notification.message }}
            </div>
            <div>
                <TrashIcon
                    class="h-5 w-5"
                    @click="handlers.onRemove(notification)"
                />
            </div>
        </li>
    </ul>
</template>

<script>
import { TrashIcon } from '@heroicons/vue/outline'
import { createNamespacedHelpers } from 'vuex-composition-helpers'
import { TYPES } from '../../store/notifications'
const { useState, useActions } = createNamespacedHelpers('notifications')

export default {
    components: {
        TrashIcon,
    },
    setup() {
        const { notifications } = useState(['notifications'])
        const { remove } = useActions(['remove'])

        const onRemove = (notification) => {
            remove({ notification })
        }
        return {
            TYPES,
            notifications,
            handlers: {
                onRemove,
            },
        }
    },
}
</script>

<style scoped>
.notifications {
    position: absolute;
    top: 12px;
    left: 0;
    width: 50vw;
    z-index: 10001;
}
</style>

<template>
    <SwitchGroup as="div" class="flex items-center">
        <Switch
            v-model="enabledLocal"
            :class="[
                enabled ? 'bg-blue-600' : 'bg-gray-200',
                'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
            ]"
        >
            <span
                aria-hidden="true"
                :class="[
                    enabledLocal ? 'translate-x-5' : 'translate-x-0',
                    'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
                ]"
            />
        </Switch>
        <SwitchLabel as="span" class="ml-3">
            <span class="text-sm font-medium text-gray-900">
                {{ label }}
            </span>
        </SwitchLabel>
    </SwitchGroup>
</template>

<script>
import { computed } from 'vue'
import { Switch, SwitchGroup, SwitchLabel } from '@headlessui/vue'

export default {
    name: 'FormToggle',
    components: {
        Switch,
        SwitchGroup,
        SwitchLabel,
    },
    props: {
        label: {
            type: String,
            default: 'Label',
        },
        enabled: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update:enabled'],
    setup(props, { emit }) {
        const enabledLocal = computed({
            get: () => props.enabled,
            set: (val) => emit('update:enabled', val),
        })

        return {
            enabledLocal,
        }
    },
}
</script>

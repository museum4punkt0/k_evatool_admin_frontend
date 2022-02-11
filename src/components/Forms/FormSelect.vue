<template>
    <div>
        <Listbox v-model="selectedLocal" as="div" :disabled="disabled">
            <ListboxLabel class="block text-sm font-medium text-gray-700">
                {{ label }}
            </ListboxLabel>
            <div class="mt-1 relative">
                <ListboxButton
                    class="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    :class="
                        invalid
                            ? 'focus:ring-red-500 focus:border-red-50 bg-red-200 border-red-700'
                            : ''
                    "
                >
                    <span class="block truncate">
                        {{
                            localOptions.find((x) => x.id === selectedLocal)
                                ?.title
                        }}
                    </span>
                    <span
                        class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
                    >
                        <SelectorIcon
                            class="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                        />
                    </span>
                </ListboxButton>

                <transition
                    leave-active-class="transition ease-in duration-100"
                    leave-from-class="opacity-100"
                    leave-to-class="opacity-0"
                >
                    <ListboxOptions
                        class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                    >
                        <ListboxOption
                            v-for="option in localOptions"
                            :key="option.id"
                            v-slot="{ active, selectedLocal2 }"
                            as="template"
                            :value="option.id"
                            :class="{
                                pointer: !disabledValues.includes(option.id),
                            }"
                            :disabled="disabledValues.includes(option.id)"
                        >
                            <li
                                :class="[
                                    active
                                        ? 'text-white bg-blue-600'
                                        : 'text-gray-900',
                                    'cursor-default select-none relative py-2 pl-3 pr-9',
                                ]"
                            >
                                <span
                                    :class="[
                                        selectedLocal2
                                            ? 'font-semibold'
                                            : 'font-normal',
                                        'block truncate',
                                        {
                                            'opacity-50':
                                                disabledValues.includes(
                                                    option.id,
                                                ),
                                        },
                                    ]"
                                >
                                    {{ option.title }}
                                </span>

                                <span
                                    v-if="selectedLocal2"
                                    :class="[
                                        active ? 'text-white' : 'text-blue-600',
                                        'absolute inset-y-0 right-0 flex items-center pr-4',
                                    ]"
                                >
                                    <CheckIcon
                                        class="h-5 w-5"
                                        aria-hidden="true"
                                    />
                                </span>
                            </li>
                        </ListboxOption>
                    </ListboxOptions>
                </transition>
            </div>
        </Listbox>
    </div>
</template>

<script>
import { computed } from 'vue'
import {
    Listbox,
    ListboxButton,
    ListboxLabel,
    ListboxOption,
    ListboxOptions,
} from '@headlessui/vue'

import { CheckIcon, SelectorIcon } from '@heroicons/vue/solid'

export default {
    name: 'FormSelect',
    components: {
        Listbox,
        ListboxButton,
        ListboxLabel,
        ListboxOption,
        ListboxOptions,
        CheckIcon,
        SelectorIcon,
    },
    props: {
        options: { type: Array, required: true, default: () => [] },
        label: { type: String, default: 'label' },
        titleKey: { type: String, default: 'title' },
        valueKey: { type: String, default: 'value' },
        defaultValue: { type: [String, Number], default: null },
        defaultTitle: { type: String, default: 'Nicht ausgewählt' },
        titleGetter: { type: Function, default: null },
        useDefault: { type: Boolean, default: true },
        invalid: {
            type: Boolean,
            default: false,
        },
        selected: {
            type: [String, Number],
            default: '',
        },
        disabledValues: {
            type: Array,
            default: () => [],
        },
        disabled: { type: Boolean, default: false },
    },
    emits: ['update:selected'],
    setup(props, { emit }) {
        const localOptions = computed({
            get: () => {
                const localOptions2 = [...props.options].map((option) => {
                    return {
                        title: props.titleGetter
                            ? props.titleGetter(option)
                            : option[props.titleKey],
                        id: option[props.valueKey],
                    }
                })

                // set default if specified
                if (props.useDefault) {
                    localOptions2.unshift({
                        id: props.defaultValue,
                        title: props.defaultTitle,
                    })
                }
                return localOptions2
            },
        })

        /*const localOptions = [...props.options].map((option) => {
        return {
            title: option[props.titleKey],
            id: option[props.valueKey],
        }
    })*/

        const selectedLocal = computed({
            get: () => props.selected || props.defaultValue,
            set: (val) => emit('update:selected', val),
        })

        return {
            selectedLocal,
            localOptions,
        }
    },
}
</script>

<style scoped></style>

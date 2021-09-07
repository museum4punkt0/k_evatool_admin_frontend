<template>
    <Listbox v-model="selected" as="div">
        <ListboxLabel class="block text-sm font-medium text-gray-700">
            {{ label }}
        </ListboxLabel>
        <div class="mt-1 relative">
            <ListboxButton
                class="
                    bg-white
                    relative
                    w-full
                    border border-gray-300
                    rounded-md
                    shadow-sm
                    pl-3
                    pr-10
                    py-2
                    text-left
                    cursor-default
                    focus:outline-none
                    focus:ring-1
                    focus:ring-blue-500
                    focus:border-blue-500
                    sm:text-sm
                "
            >
                <span class="block truncate">
                    {{ localOptions.find((x) => x.id === selected).title }}
                </span>
                <span
                    class="
                        absolute
                        inset-y-0
                        right-0
                        flex
                        items-center
                        pr-2
                        pointer-events-none
                    "
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
                    class="
                        absolute
                        z-10
                        mt-1
                        w-full
                        bg-white
                        shadow-lg
                        max-h-60
                        rounded-md
                        py-1
                        text-base
                        ring-1 ring-black ring-opacity-5
                        overflow-auto
                        focus:outline-none
                        sm:text-sm
                    "
                >
                    <ListboxOption
                        v-for="option in localOptions"
                        :key="option.id"
                        v-slot="{ active, selected }"
                        as="template"
                        :value="option.id"
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
                                    selected ? 'font-semibold' : 'font-normal',
                                    'block truncate',
                                ]"
                            >
                                {{ option.title }}
                            </span>

                            <span
                                v-if="selected"
                                :class="[
                                    active ? 'text-white' : 'text-blue-600',
                                    'absolute inset-y-0 right-0 flex items-center pr-4',
                                ]"
                            >
                                <CheckIcon class="h-5 w-5" aria-hidden="true" />
                            </span>
                        </li>
                    </ListboxOption>
                </ListboxOptions>
            </transition>
        </div>
    </Listbox>
</template>

<script>
import { watch, ref } from 'vue'
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
        useDefault: { type: Boolean, default: true },
    },
    setup(props) {
        const localOptions = [...props.options].map((option) => {
            return {
                title: option[props.titleKey],
                id: option[props.valueKey],
            }
        })

        if (props.useDefault) {
            localOptions.unshift({
                id: null,
                title: 'Nicht ausgewählt',
            })
        }

        const selected = ref(localOptions[0].id)

        watch(selected, (value) => {
            console.log(value)
        })

        return {
            selected,
            localOptions,
        }
    },
}
</script>

<style scoped></style>

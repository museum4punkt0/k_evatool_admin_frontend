<template>
    <div>
        <Listbox v-model="selectedLocal" as="div">
            <label :for="name">{{ label }}</label>
            <div class="mt-1 relative">
                <ListboxButton
                    class="
                        bg-white
                        relative
                        w-20
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
                    <span class="text-white">
                        {{
                            selectedLocal
                                ? emojis.find((x) => x === selectedLocal)
                                : '_'
                        }}
                    </span>
                    <span
                        class="
                            absolute
                            inset-y-0
                            right-0
                            flex
                            items-center
                            py-2
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
                            p-1
                            text-base
                            ring-1 ring-black ring-opacity-5
                            overflow-auto
                            focus:outline-none
                            sm:text-sm
                        "
                    >
                        <ListboxOption
                            v-for="emoji in emojis"
                            :key="'emoji_name' + emoji"
                            v-slot="{ active }"
                            as="template"
                            :value="emoji"
                            class="float-left"
                            :class="{
                                pointer: !disabledValues.includes(emoji),
                            }"
                            :disabled="disabledValues.includes(emoji)"
                        >
                            <div
                                class="cursor-default select-none relative p-2"
                                :class="{
                                    'bg-blue-600': active,
                                    'bg-blue-300': emoji === selectedLocal,
                                }"
                            >
                                <span
                                    class="inline-block w-5 h-5"
                                    :class="[
                                        'block truncate',
                                        {
                                            'opacity-50':
                                                disabledValues.includes(emoji),
                                        },
                                    ]"
                                >
                                    {{ emoji }}
                                </span>
                            </div>
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
    name: 'FormSelectEmoji',
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
        label: {
            type: String,
            default: 'label',
        },
        defaultValue: {
            type: [String, Number],
            default: null,
        },
        defaultTitle: {
            type: String,
            default: 'Nicht ausgewählt',
        },
        useDefault: {
            type: Boolean,
            default: true,
        },
        selected: {
            type: String,
            default: '',
        },
        disabledValues: {
            type: Array,
            default: () => [],
        },
    },
    emits: ['update:selected'],
    setup(props, { emit }) {
        const emojis = [
            '🔥',
            '⚡️',
            '✨',
            '❤️',
            '🏆',
            '🎉',
            '💰',
            '💵',
            '💸',
            '⏱',
            '⏰',
            '🚚',
            '💪',
            '🔑',
            '🗝',
            '🥇',
            '👀',
            '🎯',
            '💣',
            '🎁',
            '🎈',
            '⏳',
            '👏',
            '📣',
            '⭐️',
            '💡',
            '🔦',
            '🛒',
            '🛍',
            '🎟',
            '🥳',
            '😍',
            '🥰',
            '😎',
            '😂',
            '🤗',
        ]
        const selectedLocal = computed({
            get: () => props.selected,
            set: (val) => {
                console.log(val)
                emit('update:selected', val)
            },
        })

        return {
            emojis,
            selectedLocal,
            open: false,
        }
    },
}
</script>

<style scoped></style>

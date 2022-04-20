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
                                <div class="flex flex-col gap-1">
                                    <div
                                        class="flex flex-row gap-2"
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
                                            v-if="
                                                valueKey === 'id' &&
                                                option.id !== -1 &&
                                                option.id !== 'stars' &&
                                                option.id !== 'grades' &&
                                                option.id !== 'neutral'
                                            "
                                            :class="[
                                                selectedLocal2
                                                    ? 'font-semibold'
                                                    : 'font-normal',
                                                'block truncate text-xs align-bottom inline-block leading-5 opacity-50',
                                                {
                                                    'opacity-50':
                                                        disabledValues.includes(
                                                            option.id,
                                                        ),
                                                },
                                            ]"
                                        >
                                            {{ getAdditional(option.id).type }}
                                        </span>
                                    </div>
                                    <div
                                        v-if="
                                            option.surveyElementType !==
                                                'video' &&
                                            valueKey === 'id' &&
                                            option.id !== -1 &&
                                            option.id !== 'stars' &&
                                            option.id !== 'grades' &&
                                            option.id !== 'neutral'
                                        "
                                        class="text-xs"
                                        v-html="getAdditional(option.id).desc"
                                    ></div>
                                </div>
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
import { useStore } from 'vuex'

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
        defaultValue: { type: [String, Number], default: -1 },
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
        const store = useStore()

        //TODO: fix display with <p> tag

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

        const selectedLocal = computed({
            get: () => props.selected || props.defaultValue,
            set: (val) => {
                console.log(val)
                emit('update:selected', val)
            },
        })

        const getAdditional = (surveyElementId) => {
            const idInOptions = props.options.find(
                (e) => e.id === surveyElementId,
            ).surveyElementId
            const element = store.state.surveyElements.surveyElements.find(
                (e) => e.id === idInOptions,
            )

            if (element?.surveyElementType !== 'video') {
                const clearedString = shortenQuestion(
                    getLangString(
                        element?.params?.question
                            ? element?.params?.question
                            : element?.params?.text,
                    ),
                )

                const type = getTypeDisplay(element?.surveyElementType)

                return {
                    desc: clearedString,
                    type: type,
                }
            } else {
                return {
                    desc: '',
                    name: '',
                }
            }
        }

        const getLangString = (obj) => {
            try {
                if (
                    obj[store.state.languageCode] !== undefined &&
                    obj !== undefined &&
                    obj !== null
                ) {
                    return obj[store.state.languageCode]
                } else {
                    if (store.state.languageCode === 'en') {
                        return obj?.de
                    } else {
                        return obj?.en
                    }
                }
            } catch (e) {
                return ''
            }
        }

        const htmlDecode = (input) => {
            const doc = new DOMParser().parseFromString(input, 'text/html')
            return doc.documentElement.textContent
        }

        const shortenQuestion = (text) => {
            const maxStringLength = 25
            const newString = htmlDecode(text)

            if (newString.length > maxStringLength) {
                return newString.substring(0, maxStringLength) + '...'
            }
            return newString
        }

        const langPack = {
            binary: {
                de: 'Binäre Auswahl',
                en: 'Binary selection',
            },
            emoji: {
                de: 'Emojis',
                en: 'Emojis',
            },
            multipleChoice: {
                de: 'Muliple-Choice',
                en: 'Muliple Choice',
            },
            simpleText: {
                de: 'Infotext',
                en: 'Informational text',
            },
            scales: {
                de: 'Skalen',
                en: 'Scales',
            },
            textInput: {
                de: 'Freitext-Frage',
                en: 'Text input',
            },
            video: {
                de: 'Video',
                en: 'Video',
            },
            voiceInput: {
                de: 'Sprach-Eingabe',
                en: 'Voice input',
            },
            yayNay: {
                de: 'Bilder swipen',
                en: 'Image swipe',
            },
        }

        const getTypeDisplay = (type) => {
            const displayLang = store.state.languageCode
                ? store.state.languageCode
                : 'de'

            switch (type) {
                case 'binary':
                    return langPack.binary[displayLang]
                case 'emoji':
                    return langPack.emoji[displayLang]
                case 'multipleChoice':
                    return langPack.multipleChoice[displayLang]
                case 'simpleText':
                    return langPack.simpleText[displayLang]
                case 'starRating':
                    return langPack.scales[displayLang]
                case 'textInput':
                    return langPack.textInput[displayLang]
                case 'video':
                    return langPack.video[displayLang]
                case 'voiceInput':
                    return langPack.voiceInput[displayLang]
                case 'yayNay':
                    return langPack.yayNay[displayLang]
                default:
                    return ''
            }
        }

        return {
            selectedLocal,
            localOptions,
            getAdditional,
            shortenQuestion,
            htmlDecode,
        }
    },
}
</script>

<style scoped></style>

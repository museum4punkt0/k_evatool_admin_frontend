<template>
    <language-switch
        class="mt-6"
        :active-language="selectedLanguage"
        @select="setSelectedLanguage($event)"
    />
    <label class="my-2">
        {{ t('questions', 1) }} ({{ selectedLanguage.title }})
    </label>

    <tiny-mce
        v-for="language in store.state.languages.languages.filter(
            (item) => item.code === selectedLanguage.code,
        )"
        :key="'lang' + language.id"
        v-model:text="paramsLocal.question[language.code]"
        :invalid="!v$.question?.validateLanguageLabel?.$response[language.code]"
    />

    <div class="grid grid-cols-1 divide-y divide-gray-300">
        <div
            v-for="(option, index) in paramsLocal.options"
            :key="`option_${index}`"
        >
            <div class="py-3 flex flex-col">
                <div class="rounded flex flex-row">
                    <form-input
                        v-model:value="paramsLocal.options[index]['value']"
                        :invalid="
                            v$.options?.$each?.$response?.$data[index]?.value
                                ?.$invalid
                        "
                        :name="'system_value_' + index"
                        class="flex-auto rounded-tl-none"
                        :label="`${t('system_value')} ${index + 1}`"
                    />
                    <button
                        class="danger flex-1 mt-6 rounded-tl-none:important ml-1"
                        :disabled="paramsLocal.options.length <= 2"
                        @click="removeOption(option, index)"
                    >
                        <TrashIcon class="mx-1 h-5 w-5 pointer" />
                    </button>
                </div>
                <p class="text-xs text-gray-500 ml-1 mt-1">
                    {{ t('validation_snake_case') }}
                </p>
                <div>
                    <form-input
                        v-for="language in store.state.languages.languages.filter(
                            (item) => item.code === selectedLanguage.code,
                        )"
                        :key="'option_lang' + language.id"
                        v-model:value="
                            paramsLocal.options[index]['labels'][language.code]
                        "
                        :invalid="
                            !v$.options?.$each?.$response?.$data[index]?.labels
                                ?.validateLanguageLabel[language.code]
                        "
                        :name="'option_lang_' + index"
                        class="mt-3"
                        :label="`${t('display_value')} ${index + 1} (${
                            language.title
                        })`"
                    />
                </div>
            </div>
        </div>
    </div>
    <button class="primary" @click="addOption">
        <PlusIcon class="mx-1 h-5 w-5 pointer" />
    </button>

    <div class="mt-8">
        {{ t('headline_selectable') }}
    </div>
    <div class="grid grid-cols-2 gap-4">
        <form-input
            v-model:value="paramsLocal.minSelectable"
            :invalid="v$.minSelectable.$invalid"
            class="mt-3"
            :label="t('min_selectable')"
            name="minSelectable"
        />
        <form-input
            v-model:value="paramsLocal.maxSelectable"
            :invalid="v$.maxSelectable.$invalid"
            class="mt-3"
            :label="t('max_selectable')"
            name="maxSelectable"
        />
    </div>
</template>

<script>
import { useStore } from 'vuex'
import FormInput from '../../Forms/FormInput.vue'
import { useI18n } from 'vue-i18n'
import { computed, ref, watch } from 'vue'
import _ from 'lodash'

import useVuelidate from '@vuelidate/core'
import { required, between, helpers, maxValue } from '@vuelidate/validators'
const snakeCaseValidator = helpers.regex(/^[a-z]+(?:[_][a-z]+)*$/)

import { TrashIcon, PlusIcon } from '@heroicons/vue/outline'

import LanguageSwitch from '../../Languages/LanguageSwitch.vue'
import TinyMce from '../../Common/TinyMce.vue'

export default {
    name: 'ElementTypeMultipleChoiceQuestion',
    components: {
        TinyMce,
        LanguageSwitch,
        FormInput,
        TrashIcon,
        PlusIcon,
    },
    props: {
        params: {
            type: Object,
            default: () => null,
        },
    },
    emits: ['update:params', 'update:params-valid', 'isValid'],
    setup(props, { emit }) {
        const store = useStore()
        const { t } = useI18n()
        const tinyMceKey = 'c9kxwmlosfk0pm4jnj8j1pm8hzprlnt04hhftgpsnunje615'
        const selectedLanguage = ref(
            store.state.languages.languages.find((lang) => lang.default),
        )

        const paramsLocal = computed({
            get: () => props.params,
            set: (val) => emit('update:params', val),
        })

        const addOption = () => {
            const langObj = Object.fromEntries(
                store.state.languages.languages.map((lang) => {
                    return [[lang.code], '']
                }),
            )
            const newParams = {
                ...paramsLocal.value,
                options: [
                    ...paramsLocal.value.options,
                    {
                        value: '',
                        labels: langObj,
                    },
                ],
            }
            emit('update:params', newParams)
        }
        const removeOption = (option, index) => {
            const options = [...paramsLocal.value.options]
            options.splice(index, 1)
            const newParams = {
                ...paramsLocal.value,
                options,
            }
            emit('update:params', newParams)
        }

        const setSelectedLanguage = (language) => {
            selectedLanguage.value = language
        }

        const validateLanguageLabel = (object) => {
            const newObject = Object.assign({}, object)
            for (const [key, value] of Object.entries(object)) {
                newObject[key] = !!value
            }
            return newObject
        }

        const validations = computed({
            get: () => {
                return {
                    minSelectable: {
                        required,
                        maxValue: maxValue(
                            paramsLocal.value.options.length - 1,
                        ),
                        between: between(1, paramsLocal.value.maxSelectable),
                    },
                    maxSelectable: {
                        required,
                        between: between(
                            paramsLocal.value.minSelectable,
                            paramsLocal.value.options.length,
                        ),
                    },
                    question: {
                        required,
                        validateLanguageLabel,
                    },
                    options: {
                        $each: helpers.forEach({
                            value: {
                                required,
                                snakeCaseValidator,
                            },
                            labels: {
                                required,
                                validateLanguageLabel,
                            },
                        }),
                    },
                }
            },
            set: (val) => emit('update:params', val),
        })
        const paramsValidation = useVuelidate(validations, paramsLocal, {
            $scope: 'surveyElement',
        })

        watch(
            () => _.cloneDeep(paramsLocal.value),
            (currentValue) => {
                let singleLangIsValid = false
                const counterLangCount = 1 + currentValue.options.length
                store.state.languages.languages.forEach((lang) => {
                    let currentCount = 0
                    if (currentValue.question[lang.code] !== '') {
                        currentCount++
                    }
                    currentValue.options.forEach((option) => {
                        if (option.labels[lang.code] !== '') {
                            currentCount++
                        }
                    })
                    if (parseInt(currentCount) === parseInt(counterLangCount)) {
                        singleLangIsValid = true
                    }
                })
                const isValid =
                    singleLangIsValid && !paramsValidation.value.$invalid
                emit('isValid', isValid)
            },
            { immediate: true },
        )

        return {
            store,
            paramsLocal,
            t,
            v$: paramsValidation,
            selectedLanguage,
            setSelectedLanguage,
            addOption,
            removeOption,
            tinyMceKey,
        }
    },
}
</script>

<style scoped></style>

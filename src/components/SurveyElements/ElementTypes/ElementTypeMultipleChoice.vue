<template>
    <tiny-mce
        v-for="language in store.state.languages.languages.filter(
            (item) => item.code === selectedLanguage.code,
        )"
        :key="'lang' + language.id"
        v-model:text="paramsLocal.question[language.code]"
        :invalid="!v$.question?.validateLanguageLabel?.$response[language.code]"
        :label="t('questions', 1) + ' ' + language.title"
        :language-switch="true"
    />

    <div class="grid grid-cols-1">
        <div
            v-for="(option, index) in paramsLocal.options"
            :key="`option_${index}`"
            class="option mt-8"
        >
            <div class="title font-bold">
                {{ `Option ${index + 1}` }}
            </div>
            <div class="py-3 flex flex-col">
                <form-input
                    v-for="language in store.state.languages.languages.filter(
                        (item) => item.code === selectedLanguage.code,
                    )"
                    :key="'option_lang' + language.id"
                    v-model:value="
                        paramsLocal.options[index]['labels'][language.code]
                    "
                    language-switch
                    :invalid="
                        !v$.options?.$each?.$response?.$data[index]?.labels
                            ?.validateLanguageLabel[language.code]
                    "
                    :name="'option_lang_' + index"
                    :label="`${t('display_value')} ${index + 1} (${
                        language.title
                    })`"
                />
                <div class="flex flex-row items-end">
                    <form-input
                        v-model:value="paramsLocal.options[index]['value']"
                        :invalid="
                            v$.options?.$each?.$response?.$data[index]?.value
                                ?.$invalid
                        "
                        :name="'system_value_' + index"
                        class="flex-auto rounded-tl-none mt-3"
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
                <p class="text-xs text-gray-500 ml-1 mt-1">
                    {{ t('system_value_explaination') }}
                </p>
                <div class="flex flex-row items-end">
                    <input
                        type="checkbox"
                        class="form-checkbox rounded"
                        :checked="paramsLocal.options[index].commentable"
                        @change="commentableChange(option, $event)"
                    />
                    <label class="inline-flex items-center pointer-events-none">
                        <span class="ml-2">{{ t('commentable') }}</span>
                    </label>
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
const snakeCaseValidator = helpers.regex(/(^[a-z][a-z0-9]+(?:_[a-z0-9]+)*$)+/)

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

        const selectedLanguage = ref(store.state.languages.maintainLanguage)
        watch(
            () => store.state.languages.maintainLanguage,
            (value) => {
                selectedLanguage.value = value
            },
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
                        value: `value_${paramsLocal.value.options.length + 1}`,
                        labels: langObj,
                        commentable: false,
                    },
                ],
            }
            emit('update:params', newParams)
        }
        const removeOption = (option, index) => {
            let confirmDeleteOption = false
            // check if the key value is set/not empty
            if (option.value) {
                confirmDeleteOption = true
            }
            // check if labels are set/not empty
            let labels = Object.keys(option.labels)
            labels.forEach((lang) => {
                if (option.labels[lang]) {
                    confirmDeleteOption = true
                }
            })
            if (confirmDeleteOption) {
                if (confirm(t('confirm_delete_option'))) {
                    deleteOption(index)
                } else {
                    console.log('cancel')
                }
            } else {
                deleteOption(index)
            }
        }
        const deleteOption = (index) => {
            const options = [...paramsLocal.value.options]
            options.splice(index, 1)
            const newParams = {
                ...paramsLocal.value,
                options,
            }
            emit('update:params', newParams)
        }

        const validateLanguageLabel = (object) => {
            const newObject = Object.assign({}, object)
            for (const [key, value] of Object.entries(object)) {
                newObject[key] = !!value && value.length < 1500
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

        const commentableChange = (option, event) => {
            const checked = event.target.checked
            const index = paramsLocal.value.options.findIndex(
                (o) => o.value === option.value,
            )
            paramsLocal.value.options[index].commentable = checked
        }

        return {
            store,
            paramsLocal,
            t,
            v$: paramsValidation,
            selectedLanguage,
            addOption,
            removeOption,
            deleteOption,
            commentableChange,
        }
    },
}
</script>

<style scoped>
button.language {
    padding: 2px 8px;
}
</style>

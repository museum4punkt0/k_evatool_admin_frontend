<template>
    <div class="flex mt-8">
        <label class="flex-grow">{{ t('questions', 1) }}</label>
        <div class="languages flex">
            <button
                v-for="language in store.state.languages.languages"
                :key="language.code"
                class="language"
                :class="{
                    primary: language.code === selectedLanguage.code,
                    secondary: language.code !== selectedLanguage.code,
                }"
                @click="setSelectedLanguage(language)"
            >
                {{ language.code }}
            </button>
        </div>
    </div>
    <tiny-mce
        v-for="language in store.state.languages.languages.filter(
            (item) => item.code === selectedLanguage.code,
        )"
        :key="'lang' + language.id"
        v-model:text="paramsLocal.question[language.code]"
        :invalid="
            !validateParams.question?.validateLanguageLabel?.$response[
                language.code
            ]
        "
    />
    <div v-if="paramsLocal.emojis.length > 0" class="table-wrap mt-3">
        <table>
            <thead>
                <tr>
                    <th colspan="3">Emojis</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(emoji, index) in paramsLocal.emojis" :key="index">
                    <td>{{ emoji.type }}</td>
                    <td>{{ emoji.meaning }}</td>
                    <td class="pointer" @click="deleteEmoji(index)">
                        <TrashIcon class="h-5 w-5" />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="rounded-lg mt-3">
        <!-- <form-select-emoji
            v-model:selected="selectedEmoji.type"
            name="emoji"
            :label="t('emojis')"
        /> -->
        <VuemojiPicker
            v-if="showEmojiPicker"
            class="vuemoji-picker"
            :i18n="i18nDe"
            :picker-style="pickerStyle"
            :is-dark="false"
            @emojiClick="handleEmojiClick"
        />
        <div class="mt-3 flex justify-between">
            <form-input
                v-model:value="selectedEmoji.type"
                readonly
                class="w-1/2"
                name="type"
                :invalid="validateEmoji.type.$invalid"
                :label="t('type', 1)"
                @click="toggleEmojiPicker"
            />
            <button class="primary self-end" @click="toggleEmojiPicker">
                {{ t('action_pick_emoji') }}
            </button>
        </div>

        <form-input
            v-model:value="selectedEmoji.meaning"
            class="mt-3"
            name="meaning"
            :invalid="validateEmoji.meaning.$invalid"
            :label="t('meanings', 1)"
            :helptext="t('validation_emoji_meaning')"
        />
        <button
            class="primary mt-3"
            :disabled="validateEmoji.$invalid"
            @click="addEmoji"
        >
            {{ t('action_add_emoji') }}
        </button>
    </div>
</template>

<script>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import FormInput from '../../Forms/FormInput.vue'
import LanguageSwitch from '../../Languages/LanguageSwitch.vue'
import FormSelectEmoji from '../../Forms/FormSelectEmoji.vue'
import { VuemojiPicker } from 'vuemoji-picker'
import i18nDe from 'emoji-picker-element/i18n/de'

import { TrashIcon } from '@heroicons/vue/outline'
import { useStore } from 'vuex'
import { minLength, maxLength, required, helpers } from '@vuelidate/validators'

const snakeCaseValidator = helpers.regex(/(^[a-z][a-z0-9]+(?:_[a-z0-9]+)*$)+/)
import useVuelidate from '@vuelidate/core'
import TinyMce from '../../Common/TinyMce.vue'
import _ from 'lodash'

export default {
    name: 'ElementTypeEmoji',
    components: {
        TinyMce,
        FormSelectEmoji,
        FormInput,
        TrashIcon,
        LanguageSwitch,
        VuemojiPicker,
    },
    props: {
        params: {
            type: Object,
            default: () => null,
        },
    },
    emits: ['update:params', 'isValid'],
    setup(props, { emit }) {
        const store = useStore()
        const { t } = useI18n()
        const tinyMceKey = 'c9kxwmlosfk0pm4jnj8j1pm8hzprlnt04hhftgpsnunje615'
        const showEmojiPicker = ref(false)
        const selectedEmoji = ref({
            type: '',
            meaning: '',
        })
        const selectedLanguage = ref(
            store.state.languages.languages.find((lang) => lang.default),
        )
        const setSelectedLanguage = (language) => {
            selectedLanguage.value = language
        }

        const paramsLocal = computed({
            get: () => props.params,
            set: (val) => emit('update:params', val),
        })

        function toggleEmojiPicker() {
            showEmojiPicker.value = !showEmojiPicker.value
        }

        const validateLanguageLabel = (object) => {
            const newObject = Object.assign({}, object)
            for (const [key, value] of Object.entries(object)) {
                newObject[key] = !!value
            }
            return newObject
        }

        const emojiValidation = () => {
            const valid = /\p{Extended_Pictographic}/u.test(
                selectedEmoji.value.type,
            )
            return {
                type: {
                    required,
                    valid,
                },
                meaning: {
                    required,
                    minLength: minLength(1),
                    maxLength: maxLength(50),
                    snakeCaseValidator,
                },
            }
        }

        const validations = computed({
            get: () => {
                return {
                    params: {
                        emojis: {
                            required,
                            $each: emojiValidation(),
                        },
                        question: {
                            required,
                            validateLanguageLabel,
                        },
                    },
                    selectedEmoji: emojiValidation(),
                }
            },
            set: (val) => emit('update:params', val),
        })

        const addEmoji = () => {
            let execute = true

            if (
                paramsLocal.value.emojis.findIndex(
                    (x) =>
                        x.type.trim() === selectedEmoji.value.type.trim() ||
                        x.meaning.trim() === selectedEmoji.value.meaning.trim(),
                ) >= 0
            ) {
                execute = false
                alert(t('error_emoji_already_in_use'))
            }

            if (execute) {
                paramsLocal.value.emojis.push({ ...selectedEmoji.value })
                selectedEmoji.value = {
                    type: '',
                    meaning: '',
                }
            }
        }

        const validateParams = useVuelidate(
            validations.value.params,
            paramsLocal.value,
            { $scope: 'surveyElement' },
        )

        const validateEmoji = useVuelidate(
            validations.value.selectedEmoji,
            selectedEmoji,
            { $scope: 'emoji' },
        )

        watch(
            () => _.cloneDeep(paramsLocal.value),
            (currentValue) => {
                let singleLangIsValid = false
                const counterLangCount = 1
                store.state.languages.languages.forEach((lang) => {
                    let currentCount = 0
                    if (currentValue.question[lang.code] !== '') {
                        currentCount++
                    }
                    if (parseInt(currentCount) === parseInt(counterLangCount)) {
                        singleLangIsValid = true
                    }
                })
                const isValid =
                    singleLangIsValid && !validateParams.value.$invalid
                emit('isValid', isValid)
            },
            { immediate: true },
        )

        const deleteEmoji = (index) => {
            const confirmDelete = confirm(t('confirm_delete_emoji'))
            if (confirmDelete) {
                paramsLocal.value.emojis.splice(index, 1)
            }
        }
        const handleEmojiClick = (emoji) => {
            // console.log(emoji.unicode)
            // do something
            showEmojiPicker.value = false
            selectedEmoji.value.type = emoji.unicode
        }

        const pickerStyle = {
            borderSize: '2px',
            buttonActiveBackground: 'white',
        }

        return {
            paramsLocal,
            selectedEmoji,
            store,
            t,
            addEmoji,
            deleteEmoji,
            selectedLanguage,
            setSelectedLanguage,
            toggleEmojiPicker,
            showEmojiPicker,
            validateParams,
            validateEmoji,
            tinyMceKey,
            handleEmojiClick,
            pickerStyle,
            i18nDe,
        }
    },
}
</script>

<style lang="scss" scoped>
button.language {
    padding: 2px 8px;
}
.vuemoji-picker {
    position: absolute;
    transform: translateX(-105%);
}
</style>

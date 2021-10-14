<template>
    <language-switch
        class="mt-6"
        :active-language="selectedLanguage"
        @select="setSelectedLanguage($event)"
    />
    <tip-tap
        v-for="language in store.state.languages.languages.filter(
            (item) => item.code === selectedLanguage.code,
        )"
        :key="'lang' + language.id"
        :value="paramsLocal.question[language.code]"
        @update:value="onTipTapUpdate(language, $event)"
    ></tip-tap>
    <!-- <form-input
        v-for="language in store.state.languages.languages.filter(
            (item) => item.code === selectedLanguage.code,
        )"
        :key="'question_lang' + language.id"
        v-model:value="paramsLocal.question[language.code]"
        class="mt-3"
        :name="'question' + language.id"
        :label="t('questions', 1) + ' (' + language.title + ')'"
    /> -->

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

    <div class="p-2 bg-blue-200 rounded-lg mt-3">
        <form-select-emoji
            v-model:selected="selectedEmoji.type"
            name="emoji"
            :label="t('emojis')"
        />
        <form-input
            v-model:value="selectedEmoji.meaning"
            class="mt-3"
            name="meaning"
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
import TipTap from '../../../components/Common/TipTap.vue'

import { TrashIcon } from '@heroicons/vue/outline'
import { useStore } from 'vuex'
import { minLength, maxLength, required, helpers } from '@vuelidate/validators'

const meaningValidation = helpers.regex(/^[a-z0-9_]*$/)

import useVuelidate from '@vuelidate/core'

export default {
    name: 'ElementTypeEmoji',
    components: {
        FormSelectEmoji,
        FormInput,
        TrashIcon,
        LanguageSwitch,
        TipTap,
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

        const questionValidation = {}
        store.state.languages.languages.forEach((language) => {
            questionValidation[language.code] = {
                required,
                minLength: minLength(1),
            }
        })

        // Todo: Regex for Emoji validation ... https://vuelidate-next.netlify.app/custom_validators.html#regex-based-validator
        // Todo: Some emojis appear to not be valid, example ❤️ ... length > 1?
        const emojiValidation = () => {
            return {
                type: {
                    required,
                    minLength: minLength(1),
                    maxLength: maxLength(1),
                },
                meaning: {
                    required,
                    minLength: minLength(1),
                    maxLength: maxLength(50),
                    meaningValidation,
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
                        question: questionValidation,
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
            () => validateParams.value.$invalid,
            (invalid) => {
                emit('isValid', !invalid)
            },
        )

        const deleteEmoji = (index) => {
            const confirmDelete = confirm(t('confirm_delete_time_based_step'))
            if (confirmDelete) {
                paramsLocal.value.emojis.splice(index, 1)
            }
        }

        const onTipTapUpdate = (language, value) => {
            paramsLocal.value.question[language.code] = value
            emit('update:params', paramsLocal.value)
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
            validateParams,
            validateEmoji,
            onTipTapUpdate,
        }
    },
}
</script>

<style scoped></style>

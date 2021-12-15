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
    />
</template>

<script>
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import FormInput from '../../Forms/FormInput.vue'
import { useI18n } from 'vue-i18n'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { TrashIcon, PlusIcon } from '@heroicons/vue/outline'
import LanguageSwitch from '../../Languages/LanguageSwitch.vue'
import TinyMce from '../../Common/TinyMce.vue'

export default {
    name: 'ElementTypeMultipleChoiceQuestion',
    components: { TinyMce, FormInput, TrashIcon, PlusIcon, LanguageSwitch },
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
        const setSelectedLanguage = (language) => {
            selectedLanguage.value = language
        }

        const paramsLocal = computed({
            get: () => props.params,
            set: (val) => emit('update:params', val),
        })
        const existsInAllLanguages = (value) => {
            let valid = true
            Object.entries(value).forEach((entry) => {
                // TODO: check language key
                if (!entry[1] || entry[1].length === 0) {
                    valid = false
                }
            })
            return valid
        }
        const validations = computed({
            get: () => {
                return {
                    question: {
                        required,
                        existsInAllLanguages,
                    },
                }
            },
            set: (val) => emit('update:params', val),
        })

        const paramsValidation = useVuelidate(validations, paramsLocal, {
            $scope: 'surveyElement',
        })

        watch(
            () => paramsValidation.value.$invalid,
            (invalid) => {
                emit('isValid', !invalid)
            },
        )

        return {
            store,
            paramsLocal,
            selectedLanguage,
            setSelectedLanguage,
            t,
            v$: paramsValidation,
            tinyMceKey,
        }
    },
}
</script>

<style scoped>
button.language {
    padding: 2px 8px;
}
</style>

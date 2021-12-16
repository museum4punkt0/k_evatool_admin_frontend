<template>
    <div class="flex mt-8">
        <label class="flex-grow">{{ t('texts', 1) }}</label>
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
        v-model:text="paramsLocal.text[language.code]"
        :invalid="v$.text[language.code].$invalid"
    />
</template>

<script>
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import FormInput from '../../Forms/FormInput.vue'
import LanguageSwitch from '../../Languages/LanguageSwitch.vue'
import useVuelidate from '@vuelidate/core'
import { minLength, required } from '@vuelidate/validators'
import TinyMce from '../../Common/TinyMce.vue'

export default {
    name: 'ElementTypeSimpleText',
    components: { TinyMce, FormInput, LanguageSwitch },
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
        const paramsLocal = computed({
            get: () => props.params,
            set: (val) => emit('update:params', val),
        })
        const selectedLanguage = ref(
            store.state.languages.languages.find((lang) => lang.default),
        )
        const setSelectedLanguage = (language) => {
            selectedLanguage.value = language
        }

        const textValidation = {}
        store.state.languages.languages.forEach((language) => {
            textValidation[language.code] = {
                required,
                minLength: minLength(1),
            }
        })

        const validations = computed({
            get: () => {
                return {
                    text: textValidation,
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
            selectedLanguage,
            setSelectedLanguage,
            paramsLocal,
            store,
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

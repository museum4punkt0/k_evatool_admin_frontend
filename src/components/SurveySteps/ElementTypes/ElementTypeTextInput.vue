<template>
    <div>
        <language-switch
            class="mt-6"
            :active-language="selectedLanguage"
            @select="setSelectedLanguage($event)"
        />
        <label>{{ t('questions', 1) }}</label>
        <tip-tap
            v-for="language in store.state.languages.languages.filter(
                (item) => item.code === selectedLanguage.code,
            )"
            :key="'lang' + language.id"
            :value="paramsLocal.question[language.code]"
            @update:value="onTipTapUpdate(language, $event)"
        ></tip-tap>
    </div>
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
import TipTap from '../../../components/Common/TipTap.vue'

export default {
    name: 'ElementTypeMultipleChoiceQuestion',
    components: { FormInput, TrashIcon, PlusIcon, LanguageSwitch, TipTap },
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
        const onTipTapUpdate = (language, value) => {
            paramsLocal.value.question[language.code] = value
            emit('update:params', paramsLocal.value)
        }

        return {
            store,
            paramsLocal,
            t,
            v$: paramsValidation,
            selectedLanguage,
            setSelectedLanguage,
            onTipTapUpdate,
        }
    },
}
</script>

<style scoped></style>

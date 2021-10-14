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
        :value="paramsLocal.text[language.code]"
        @update:value="onUpdate(language, $event)"
    ></tip-tap>
</template>

<script>
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import FormInput from '../../Forms/FormInput.vue'
import LanguageSwitch from '../../Languages/LanguageSwitch.vue'
import useVuelidate from '@vuelidate/core'
import { minLength, required } from '@vuelidate/validators'
import TipTap from '../../../components/Common/TipTap.vue'

export default {
    name: 'ElementTypeSimpleText',
    components: { FormInput, LanguageSwitch, TipTap },
    props: {
        params: {
            type: Object,
            default: () => null,
        },
    },
    emits: ['update:params', 'isValid'],
    setup(props, { emit }) {
        const store = useStore()
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

        const onUpdate = (language, value) => {
            paramsLocal.value.text[language.code] = value
            emit('update:params', paramsLocal.value)
        }

        return {
            selectedLanguage,
            setSelectedLanguage,
            paramsLocal,
            store,
            v$: paramsValidation,
            onUpdate,
        }
    },
}
</script>

<style scoped></style>

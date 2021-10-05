<template>
    <language-switch
        class="mt-6"
        :active-language="selectedLanguage"
        @select="setSelectedLanguage($event)"
    />

    <form-input
        v-for="language in store.state.languages.languages.filter(
            (item) => item.code === selectedLanguage.code,
        )"
        :key="'lang' + language.id"
        v-model:value="paramsLocal.text[language.code]"
        class="mt-3"
        :name="'lang' + language.id"
        :label="'Text (' + language.title + ')'"
    />
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue'
import defaultParams from './defaultParams'
import { useStore } from 'vuex'
import FormInput from '../../Forms/FormInput.vue'
import LanguageSwitch from '../../Languages/LanguageSwitch.vue'
import useVuelidate from '@vuelidate/core'
import { minLength, required } from '@vuelidate/validators'

export default {
    name: 'ElementTypeSimpleText',
    components: { FormInput, LanguageSwitch },
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

        onMounted(() => {
            if (!paramsLocal.value) {
                paramsLocal.value = defaultParams.simpleText
            }
        })

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
                    params: {
                        text: textValidation,
                    },
                }
            },
            set: (val) => emit('update:params', val),
        })

        const validateSimpleText = useVuelidate(
            validations.value.params,
            paramsLocal.value,
            { $scope: 'surveyElement' },
        )

        watch(
            () => validateSimpleText.value.$invalid,
            (invalid) => {
                console.log(invalid)
                emit('isValid', !invalid)
            },
        )

        return {
            selectedLanguage,
            setSelectedLanguage,
            paramsLocal,
            store,
            validateSimpleText,
        }
    },
}
</script>

<style scoped></style>

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
        v-model:value="paramsLocal.question[language.code]"
        :name="'lang' + language.id"
        class="mt-3"
        :label="t('questions', 1) + ' (' + language.title + ')'"
    />
    <div class="grid grid-cols-12 gap-4">
        <form-input
            v-for="language in store.state.languages.languages.filter(
                (item) => item.code === selectedLanguage.code,
            )"
            :key="'lang' + language.id"
            v-model:value="paramsLocal.trueLabel[language.code]"
            :name="'lang' + language.id"
            class="mt-3 col-span-6"
            :label="t('binary_positive_label') + ' (' + language.title + ')'"
        />
        <form-input
            v-for="language in store.state.languages.languages.filter(
                (item) => item.code === selectedLanguage.code,
            )"
            :key="'lang' + language.id"
            v-model:value="paramsLocal.falseLabel[language.code]"
            :name="'lang' + language.id"
            class="mt-3 col-span-6"
            :label="t('binary_negative_label') + ' (' + language.title + ')'"
        />
    </div>
    <div class="grid grid-cols-12 gap-4">
        <form-input
            v-model:value="paramsLocal.trueValue"
            class="mt-3 col-span-6"
            :label="t('binary_positive')"
            name="trueValue"
        />
        <form-input
            v-model:value="paramsLocal.falseValue"
            class="mt-3 col-span-6"
            :label="t('binary_negative')"
            name="falseValue"
        />
    </div>
</template>

<script>
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import FormInput from '../../Forms/FormInput.vue'
import { useI18n } from 'vue-i18n'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import LanguageSwitch from '../../Languages/LanguageSwitch.vue'

export default {
    name: 'ElementTypeBinaryQuestion',
    components: { LanguageSwitch, FormInput },
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
        const selectedLanguage = ref(
            store.state.languages.languages.find((lang) => lang.default),
        )

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
                    question: (params) => {
                        let valid = true
                        Object.entries(params?.question).forEach((entry) => {
                            // TODO: check language key
                            if (!entry[1] || entry[1].length === 0) {
                                valid = false
                            }
                        })
                        return valid
                    },
                    trueValue: {
                        required,
                    },
                    falseValue: {
                        required,
                    },
                    // TODO: check if lables are different
                    trueLabel: {
                        required,
                        existsInAllLanguages,
                    },
                    falseLabel: {
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

        const setSelectedLanguage = (language) => {
            selectedLanguage.value = language
        }

        return {
            store,
            paramsLocal,
            t,
            v$: paramsValidation,
            selectedLanguage,
            setSelectedLanguage,
        }
    },
}
</script>

<style scoped></style>

<template>
    <tiny-mce
        v-for="language in store.state.languages.languages.filter(
            (item) => item.code === selectedLanguage.code,
        )"
        :key="'lang' + language.id"
        v-model:text="paramsLocal.question[language.code]"
        :invalid="!v$.question?.validateLanguageLabel?.$response[language.code]"
        :label="t('questions', 1)"
        :language-switch="true"
    />
    <div class="grid grid-cols-12 gap-4">
        <form-input
            v-for="language in store.state.languages.languages.filter(
                (item) => item.code === selectedLanguage.code,
            )"
            :key="'lang' + language.id"
            v-model:value="paramsLocal.trueLabel[language.code]"
            language-switch
            :invalid="
                !v$.trueLabel.validateLanguageLabel.$response[language.code]
            "
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
            language-switch
            :invalid="
                !v$.falseLabel.validateLanguageLabel.$response[language.code]
            "
            :name="'lang' + language.id"
            class="mt-3 col-span-6"
            :label="t('binary_negative_label') + ' (' + language.title + ')'"
        />
        <pre>{{}}</pre>
    </div>
    <div class="grid grid-cols-12 gap-4">
        <form-input
            v-model:value="paramsLocal.trueValue"
            :invalid="v$.trueValue.$invalid"
            class="mt-3 col-span-6"
            :label="t('binary_positive')"
            name="trueValue"
        />
        <form-input
            v-model:value="paramsLocal.falseValue"
            :invalid="v$.falseValue.$invalid"
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
import { useState } from '../../../composables/state'
import { useI18n } from 'vue-i18n'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import LanguageSwitch from '../../Languages/LanguageSwitch.vue'
import TinyMce from '../../Common/TinyMce.vue'
import _ from 'lodash'

export default {
    name: 'ElementTypeBinaryQuestion',
    components: { TinyMce, LanguageSwitch, FormInput },
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

        const [showSystemValues, setShowSystemValues] = useState(false)

        const paramsLocal = computed({
            get: () => props.params,
            set: (val) => emit('update:params', val),
        })

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
                    question: {
                        validateLanguageLabel,
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
                        validateLanguageLabel,
                    },
                    falseLabel: {
                        required,
                        validateLanguageLabel,
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
                const counterLangCount = 3
                store.state.languages.languages.forEach((lang) => {
                    let currentCount = 0
                    if (currentValue.question[lang.code] !== '') {
                        currentCount++
                    }
                    if (currentValue.falseLabel[lang.code] !== '') {
                        currentCount++
                    }
                    if (currentValue.trueLabel[lang.code] !== '') {
                        currentCount++
                    }
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
            showSystemValues,
            setShowSystemValues,
        }
    },
}
</script>

<style scoped>
button.language {
    padding: 2px 8px;
}
</style>

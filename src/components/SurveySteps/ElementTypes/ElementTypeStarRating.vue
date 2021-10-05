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
        class="mt-3"
        :name="'lang' + language.id"
        :label="'question (' + language.code + ')'"
    />

    <form-input
        v-model:value="paramsLocal.numberOfStars"
        name="numberOfStars"
        :label="t('number_of_stars')"
    />

    <div class="grid grid-cols-12 gap-4">
        <form-input
            v-model:value="paramsLocal.meaningLowestValue"
            name="meaningLowestValue"
            :label="t('meaning_lowest_value')"
            class="col-span-6"
        />
        <form-input
            v-model:value="paramsLocal.meaningHighestValue"
            name="meaningHighestValue"
            :label="t('meaning_highest_value')"
            class="col-span-6"
        />
    </div>

    <!-- <form-toggle
        v-model:enabled="paramsLocal.allowHalfSteps"
        :label="t('allow_half_steps')"
        class="my-3"
    /> -->
    invalid: {{ v$.$invalid }}
    <!-- <pre>
        {{ v$ }}
    </pre>
    <pre>
        {{ paramsLocal }}
    </pre> -->
</template>

<script>
import { useI18n } from 'vue-i18n'
import { computed, onMounted, ref, watch } from 'vue'
import FormInput from '../../Forms/FormInput.vue'
import FormToggle from '../../Forms/FormToggle.vue'
import { useStore } from 'vuex'
import LanguageSwitch from '../../Languages/LanguageSwitch.vue'
import defaultParams from './defaultParams'
import useVuelidate from '@vuelidate/core'
import { required, between } from '@vuelidate/validators'

export default {
    name: 'ElementTypeStarRating',
    components: { FormToggle, FormInput, LanguageSwitch },
    props: {
        params: {
            type: Object,
            default: () => null,
        },
    },
    emits: ['update:params', 'isValid'],
    setup(props, { emit }) {
        const { t } = useI18n()
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
                    // TODO: max number
                    numberOfStars: { required, between: between(1, 10) },
                    meaningLowestValue: {
                        required,
                    },
                    meaningHighestValue: {
                        required,
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
                console.log('emmiting isvalid', !invalid)
                emit('isValid', !invalid)
            },
        )
        return {
            selectedLanguage,
            setSelectedLanguage,
            paramsLocal,
            t,
            store,
            v$: paramsValidation,
        }
    },
}
</script>

<style scoped></style>

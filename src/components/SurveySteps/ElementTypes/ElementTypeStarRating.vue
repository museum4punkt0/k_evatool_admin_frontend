<template>
    <language-switch
        class="mt-6"
        :active-language="selectedLanguage"
        @select="setSelectedLanguage($event)"
    />
    <label>{{ t('questions', 1) }}</label>

    <tiny-mce
        v-for="language in store.state.languages.languages.filter(
            (item) => item.code === selectedLanguage.code,
        )"
        :key="'lang' + language.id"
        v-model:text="paramsLocal.question[language.code]"
    />

    <form-input
        v-model:value="paramsLocal.numberOfStars"
        name="numberOfStars"
        class="mt-3"
        :label="t('number_of_stars')"
    />
    <form-select
        v-model:selected="paramsLocal.displayType"
        class="mt-3"
        :options="[
            { name: t('star_rating_type_stars'), id: 'stars' },
            { name: t('star_rating_type_grades'), id: 'grades' },
            { name: t('star_rating_type_neutral'), id: 'neutral' },
        ]"
        :label="t('star_rating_display_types', 1)"
        title-key="name"
        value-key="id"
        readonly
    />

    <div class="grid grid-cols-12 gap-4 mt-3">
        <form-input
            v-for="language in store.state.languages.languages.filter(
                (item) => item.code === selectedLanguage.code,
            )"
            :key="'lang' + language.id"
            v-model:value="paramsLocal.lowestValueLabel[language.code]"
            name="meaningLowestValue"
            :label="t('label_lowest_value')"
            class="col-span-4"
        />
        <form-input
            v-for="language in store.state.languages.languages.filter(
                (item) => item.code === selectedLanguage.code,
            )"
            :key="'lang' + language.id"
            v-model:value="paramsLocal.middleValueLabel[language.code]"
            name="meaningHighestValue"
            :label="t('label_middle_value')"
            class="col-span-4"
        />
        <form-input
            v-for="language in store.state.languages.languages.filter(
                (item) => item.code === selectedLanguage.code,
            )"
            :key="'lang' + language.id"
            v-model:value="paramsLocal.highestValueLabel[language.code]"
            name="meaningHighestValue"
            :label="t('label_highest_value')"
            class="col-span-4"
        />
    </div>

    <div class="flex flex-row mt-3">
        <div class="mr-3">
            <form-input
                v-model:value="paramsLocal.meaningLowestValue"
                name="meaningLowestValue"
                :label="t('meaning_lowest_value')"
                class="col-span-6"
            />
            <p class="text-xs text-gray-500 ml-1 mt-1">
                {{ t('validation_snake_case') }}
            </p>
        </div>
        <div>
            <form-input
                v-model:value="paramsLocal.meaningHighestValue"
                name="meaningHighestValue"
                :label="t('meaning_highest_value')"
                class="col-span-6"
            />
            <p class="text-xs text-gray-500 ml-1 mt-1">
                {{ t('validation_snake_case') }}
            </p>
        </div>
    </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { computed, ref, watch } from 'vue'
import FormInput from '../../Forms/FormInput.vue'
import FormToggle from '../../Forms/FormToggle.vue'
import FormSelect from '../../Forms/FormSelect.vue'
import TinyMce from '../../Common/TinyMce.vue'
import { useStore } from 'vuex'
import LanguageSwitch from '../../Languages/LanguageSwitch.vue'
import useVuelidate from '@vuelidate/core'
import {
    required,
    between,
    minLength,
    maxLength,
    helpers,
} from '@vuelidate/validators'

export default {
    name: 'ElementTypeStarRating',
    components: { TinyMce, FormToggle, FormInput, FormSelect, LanguageSwitch },
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

        const questionValidation = {}
        store.state.languages.languages.forEach((language) => {
            questionValidation[language.code] = {
                required,
                minLength: minLength(1),
                maxLength: maxLength(200),
            }
        })

        const labelValidation = {}
        store.state.languages.languages.forEach((language) => {
            labelValidation[language.code] = {
                required,
                minLength: minLength(1),
                maxLength: maxLength(20),
            }
        })

        const meaningValidation = helpers.regex(/^[a-z][a-z0-9_]*$/)
        const validations = computed({
            get: () => {
                return {
                    question: questionValidation,
                    lowestValueLabel: labelValidation,
                    middleValueLabel: labelValidation,
                    highestValueLabel: labelValidation,
                    numberOfStars: {
                        required,
                        between: between(3, 9),
                    },
                    meaningLowestValue: {
                        required,
                        minLength: minLength(1),
                        maxLength: maxLength(20),
                        meaningValidation,
                    },
                    meaningHighestValue: {
                        required,
                        minLength: minLength(1),
                        maxLength: maxLength(20),
                        meaningValidation,
                    },
                }
            },
            set: (val) => emit('update:params', val),
        })

        const validateParams = useVuelidate(validations, paramsLocal.value, {
            $scope: 'surveyElement',
        })

        watch(
            () => validateParams.value.$invalid,
            (invalid) => {
                emit('isValid', !invalid)
            },
        )

        return {
            selectedLanguage,
            setSelectedLanguage,
            paramsLocal,
            t,
            store,
            validateParams,
            tinyMceKey,
        }
    },
}
</script>

<style scoped></style>

<template>
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

    <form-input
        v-model:value="paramsLocal.numberOfStars"
        name="numberOfStars"
        class="mt-3"
        :label="t('number_of_stars')"
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

    <!-- <div class="grid grid-cols-12 gap-4 mt-3">
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
    </div> -->

    <!-- <form-toggle
    v-model:enabled="paramsLocal.allowHalfSteps"
    :label="t('allow_half_steps')"
    class="my-3"
/> -->
</template>

<script>
import { useI18n } from 'vue-i18n'
import { computed, ref, watch } from 'vue'
import FormInput from '../../Forms/FormInput.vue'
import FormToggle from '../../Forms/FormToggle.vue'
import { useStore } from 'vuex'
import LanguageSwitch from '../../Languages/LanguageSwitch.vue'
import TipTap from '../../../components/Common/TipTap.vue'
import useVuelidate from '@vuelidate/core'
import { required, between, minLength, maxLength } from '@vuelidate/validators'

export default {
    name: 'ElementTypeStarRating',
    components: { FormToggle, FormInput, LanguageSwitch, TipTap },
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
                    },
                    meaningHighestValue: {
                        required,
                        minLength: minLength(1),
                        maxLength: maxLength(20),
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
        const onTipTapUpdate = (language, value) => {
            paramsLocal.value.question[language.code] = value
            emit('update:params', paramsLocal.value)
        }

        return {
            selectedLanguage,
            setSelectedLanguage,
            paramsLocal,
            t,
            store,
            v$: paramsValidation,
            onTipTapUpdate,
        }
    },
}
</script>

<style scoped></style>

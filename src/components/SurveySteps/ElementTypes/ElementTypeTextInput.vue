<template>
    <div>
        <language-switch
            class="mt-6"
            :active-language="selectedLanguage"
            @select="setSelectedLanguage($event)"
        />
        <form-input
            v-for="language in store.state.languages.languages.filter(
                (item) => item.code === selectedLanguage.code,
            )"
            :key="'question_lang' + language.id"
            v-model:value="paramsLocal.question[language.code]"
            class="mt-3"
            :name="'question' + language.id"
            :label="t('questions', 1) + ' (' + language.title + ')'"
        />
    </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import FormInput from '../../Forms/FormInput.vue'
import { useI18n } from 'vue-i18n'
import useVuelidate from '@vuelidate/core'
// import { required, between } from '@vuelidate/validators'
import { TrashIcon, PlusIcon } from '@heroicons/vue/outline'
import LanguageSwitch from '../../Languages/LanguageSwitch.vue'

export default {
    name: 'ElementTypeMultipleChoiceQuestion',
    components: { FormInput, TrashIcon, PlusIcon, LanguageSwitch },
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
        const validations = computed({
            get: () => {
                return {}
            },
            set: (val) => emit('update:params', val),
        })

        return {
            store,
            paramsLocal,
            t,
            v$: useVuelidate(validations, paramsLocal),
            selectedLanguage,
            setSelectedLanguage,
        }
    },
}
</script>

<style scoped></style>

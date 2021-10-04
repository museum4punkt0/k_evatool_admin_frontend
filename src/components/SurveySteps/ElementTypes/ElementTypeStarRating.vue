<template>
    <language-switch
        class="mt-6"
        :active-language="selectedLanguage"
        @select="setSelectedLanguage($event)"
    />
    <form-input
        v-model:value="paramsLocal.numberOfStars"
        name="numberOfStars"
        :label="t('number_of_stars')"
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

    <form-toggle
        v-model:enabled="paramsLocal.allowHalfSteps"
        :label="t('allow_half_steps')"
        class="my-3"
    />

    <form-input
        v-for="language in store.state.languages.data"
        :key="'lang' + language.id"
        v-model:value="paramsLocal.question[language.code]"
        :name="'lang' + language.id"
        :label="'question (' + language.code + ')'"
    />
</template>

<script>
import { useI18n } from 'vue-i18n'
import { computed, onMounted, ref } from 'vue'
import FormInput from '../../Forms/FormInput.vue'
import FormToggle from '../../Forms/FormToggle.vue'
import { useStore } from 'vuex'
import LanguageSwitch from '../../Languages/LanguageSwitch.vue'
import defaultParams from './defaultParams'

export default {
    name: 'ElementTypeStarRating',
    components: { FormToggle, FormInput, LanguageSwitch },
    props: {
        params: {
            type: Object,
            default: () => null,
        },
    },
    emits: ['update:params'],
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

        return {
            selectedLanguage,
            setSelectedLanguage,
            paramsLocal,
            t,
            store,
        }
    },
}
</script>

<style scoped></style>

<template>
    <language-switch
        class="mt-6"
        :active-language="selectedLanguage"
        @select="setSelectedLanguage($event)"
    />
    <h3>Simple text</h3>

    <form-input
        v-for="language in store.state.languages.languages.filter(
            (item) => item.code === selectedLanguage.code,
        )"
        :key="'lang' + language.id"
        v-model:value="paramsLocal.text[language.code]"
        class="mt-3"
        :name="'lang' + language.id"
        :label="'text (' + language.code + ')'"
    />
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import defaultParams from './defaultParams'
import { useStore } from 'vuex'
import FormInput from '../../Forms/FormInput.vue'
import LanguageSwitch from '../../Languages/LanguageSwitch.vue'

export default {
    name: 'ElementTypeSimpleText',
    components: { FormInput, LanguageSwitch },
    props: {
        params: {
            type: Object,
            default: () => null,
        },
    },
    emits: ['update:params'],
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

        return {
            selectedLanguage,
            setSelectedLanguage,
            paramsLocal,
            store,
        }
    },
}
</script>

<style scoped></style>

<template>
    <div>
        <button
            class="mr-2"
            :class="{
                primary: language === 'de',
                secondary: language !== 'de',
            }"
            @click="setLanguage('de')"
        >
            deutsch
        </button>
        <button
            :class="{
                primary: language === 'en',
                secondary: language !== 'en',
            }"
            @click="setLanguage('en')"
        >
            english
        </button>
    </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

export default {
    components: {},
    setup() {
        const store = useStore()
        const i18n = useI18n()
        const { t } = i18n
        const language = computed(() => store.state.language)

        const setLanguage = (language) => {
            console.log(language, t)
            i18n.locale.value = language
            store.dispatch('setLanguage', language)
        }
        return {
            store,
            language,
            setLanguage,
            i18n,
            t,
        }
    },
}
</script>

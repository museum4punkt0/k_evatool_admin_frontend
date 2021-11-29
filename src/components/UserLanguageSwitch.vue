<template>
    <div>
        <button
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
        const { t } = useI18n()
        const language = computed(() => store.state.language)

        const setLanguage = (language) => {
            console.log(language, t)
            //     store.dispatch('setLanguage', language)
        }
        return {
            store,
            language,
            setLanguage,
            t,
        }
    },
}
</script>

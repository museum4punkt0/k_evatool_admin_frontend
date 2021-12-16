<template>
    <div>
        {{ languageCode }}
        <button
            class="mr-2"
            :class="{
                primary: languageCode === 'de',
                secondary: languageCode !== 'de',
            }"
            @click="setLanguageCode('de')"
        >
            deutsch
        </button>
        <button
            :class="{
                primary: languageCode === 'en',
                secondary: languageCode !== 'en',
            }"
            @click="setLanguageCode('en')"
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
        const languageCode = computed(() => store.state.languageCode)

        const setLanguageCode = (languageCode) => {
            i18n.locale.value = languageCode
            store.dispatch('setLanguageCode', languageCode)
        }
        return {
            store,
            languageCode,
            setLanguageCode,
            i18n,
            t,
        }
    },
}
</script>

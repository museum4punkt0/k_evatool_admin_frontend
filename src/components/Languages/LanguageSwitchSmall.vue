<template>
    <div class="flex self-end">
        <button
            v-for="language in store.state.languages.languages"
            :key="language.code"
            class="small ml-1 mb-1"
            :class="{
                primary:
                    language.code ===
                    store.state.languages.maintainLanguage.code,
                secondary:
                    language.code !==
                    store.state.languages.maintainLanguage.code,
            }"
            @click="setMaintainLanguage(language)"
        >
            {{ language.code.toUpperCase() }}
        </button>
    </div>
</template>

<script>
import { useStore } from 'vuex'

export default {
    name: 'LanguageSwitchSmall',
    emits: ['languageSelect'],
    setup() {
        const store = useStore()

        function setMaintainLanguage(lang) {
            store.dispatch('languages/setMaintainLanguage', lang)
        }

        return {
            store,
            setMaintainLanguage,
        }
    },
}
</script>

<style scoped></style>

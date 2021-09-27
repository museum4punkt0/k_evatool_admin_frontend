<template>
    <div>
        {{ languages }}
        <button
            v-for="language in languages"
            :key="language.id"
            @click="selectLanguage(language)"
        >
            {{ language }}
        </button>
    </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
    name: 'LanguageSwitch',
    props: {
        activeLanguage: {
            type: String,
            default: '',
        },
    },
    emits: ['select'],
    setup(props, { emit }) {
        const store = useStore()
        const languages = computed({
            get: store.state.languages.data,
        })
        const selectLanguage = (language) => {
            emit('select', language)
        }
        return { languages, selectLanguage }
    },
}
</script>

<style scoped></style>

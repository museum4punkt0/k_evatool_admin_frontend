<template>
    <div>
        <div class="rounded overflow-hidden flex flex-row bg-green-700">
            <button
                v-for="language in languages"
                :key="language.id"
                class="text-white px-2 py-1 text-sm flex-auto pointer"
                :class="
                    activeLanguage.code === language.code
                        ? 'bg-blue-500'
                        : 'bg-blue-700'
                "
                @click="selectLanguage(language)"
            >
                {{ language.title }}
            </button>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
    name: 'LanguageSwitch',
    props: {
        activeLanguage: {
            type: Object,
            default: null,
        },
    },
    emits: ['select'],
    setup(props, { emit }) {
        const store = useStore()
        const languages = computed({
            get: () => store.state.languages.languages,
        })
        const selectLanguage = (language) => {
            emit('select', language)
        }
        return { languages, selectLanguage }
    },
}
</script>

<style scoped></style>

<template>
    <div>
        <div class="rounded flex flex-row">
            <button
                v-for="(language, index) in languages"
                :key="language.id"
                class="text-white px-2 py-1 text-sm flex-auto pointer my-1"
                :class="{
                    primary:
                        activeLanguage.code === language.code &&
                        !isInvalid.includes(language.code),
                    'bg-red-500':
                        activeLanguage.code === language.code &&
                        isInvalid.includes(language.code),
                    secondary:
                        activeLanguage.code !== language.code &&
                        !isInvalid.includes(language.code),
                    'bg-red-700':
                        activeLanguage.code !== language.code &&
                        isInvalid.includes(language.code),
                    'mr-1': languages.length - 1 !== index,
                }"
                @click="selectLanguage(language)"
            >
                {{ language.title }}
                <exclamation-icon
                    v-if="isInvalid.includes(language.code)"
                    class="float-right ml-3 h-5 w-5"
                />
            </button>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { ExclamationIcon } from '@heroicons/vue/outline'

export default {
    name: 'LanguageSwitch',
    components: { ExclamationIcon },
    props: {
        activeLanguage: {
            type: Object,
            default: null,
        },
        isInvalid: {
            type: Array,
            default: () => [],
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

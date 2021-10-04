<template>
    <div>
        <div class="rounded overflow-hidden flex flex-row">
            <button
                v-for="language in languages"
                :key="language.id"
                class="text-white px-2 py-1 text-sm flex-auto pointer"
                :class="{
                    'bg-blue-500':
                        activeLanguage.code === language.code && isValid.code,
                    'bg-red-500':
                        activeLanguage.code === language.code && !isValid.code,
                    'bg-blue-700':
                        activeLanguage.code !== language.code && isValid.code,
                    'bg-red-700':
                        activeLanguage.code !== language.code && !isValid.code,
                }"
                @click="selectLanguage(language)"
            >
                {{ language.title }}
                <exclamation-icon
                    v-if="!isValid"
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
        isValid: {
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

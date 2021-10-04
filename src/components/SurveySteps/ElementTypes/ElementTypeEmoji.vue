<template>
    <language-switch
        class="mt-6"
        :active-language="selectedLanguage"
        @select="setSelectedLanguage($event)"
    />
    <form-input
        v-for="language in store.state.languages.languages.filter(
            (item) => item.code === selectedLanguage.code,
        )"
        :key="'question_lang' + language.id"
        v-model:value="paramsLocal.question[language.code]"
        class="mt-3"
        :name="'question' + language.id"
        :label="t('questions', 1) + ' (' + language.title + ')'"
    />

    <div class="table-wrap mt-3">
        <table>
            <thead>
                <tr>
                    <th colspan="3">Emojis</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(emoji, e) in paramsLocal.emojis" :key="e">
                    <td>{{ emoji.type }}</td>
                    <td>{{ emoji.meaning }}</td>
                    <td class="pointer" @click="deleteTimeBasedStep(tIndex)">
                        <TrashIcon class="h-5 w-5" />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="p-2 bg-blue-200 rounded-lg mt-3">
        <form-input
            v-model:value="selectedEmoji.type"
            name="emoji"
            label="emoji"
        />
        <form-input
            v-model:value="selectedEmoji.meaning"
            name="meaning"
            label="meaning"
        />
        <button class="primary mt-3" @click="addEmoji">Add</button>
    </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import FormInput from '../../Forms/FormInput.vue'
import LanguageSwitch from '../../Languages/LanguageSwitch.vue'

import { TrashIcon } from '@heroicons/vue/outline'
import { useStore } from 'vuex'

export default {
    name: 'ElementTypeEmoji',
    components: { FormInput, TrashIcon, LanguageSwitch },
    props: {
        params: {
            type: Object,
            default: () => null,
        },
    },
    emits: ['update:params'],
    setup(props, { emit }) {
        const store = useStore()
        const { t } = useI18n()
        const selectedEmoji = ref({
            type: '',
            meaning: '',
        })
        const selectedLanguage = ref(
            store.state.languages.languages.find((lang) => lang.default),
        )
        const setSelectedLanguage = (language) => {
            selectedLanguage.value = language
        }
        const paramsLocal = computed({
            get: () => props.params,
            set: (val) => emit('update:params', val),
        })

        const addEmoji = () => {
            paramsLocal.value.emojis.push(selectedEmoji.value)
            selectedEmoji.value = {
                type: '',
                meaning: '',
            }
        }

        const deleteEmoji = (index) => {
            paramsLocal.value.emojis.splice(index, 1)
        }

        return {
            paramsLocal,
            selectedEmoji,
            store,
            t,
            addEmoji,
            deleteEmoji,
            selectedLanguage,
            setSelectedLanguage,
        }
    },
}
</script>

<style scoped></style>

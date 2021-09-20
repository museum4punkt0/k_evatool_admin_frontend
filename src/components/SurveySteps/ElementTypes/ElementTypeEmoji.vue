<template>
    <form-input
        v-for="language in store.state.languages.data"
        :key="'lang' + language.id"
        v-model:value="paramsLocal.question[language.code]"
        class="mt-3"
        :label="'question (' + language.code + ')'"
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
        <form-input v-model:value="selectedEmoji.type" label="emoji" />
        <form-input v-model:value="selectedEmoji.meaning" label="meaning" />
        <button class="primary mt-3" @click="addEmoji">Add</button>
    </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import FormInput from '../../Forms/FormInput.vue'

import { TrashIcon } from '@heroicons/vue/outline'
import { useStore } from 'vuex'

export default {
    name: 'ElementTypeEmoji',
    components: { FormInput, TrashIcon },
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
        }
    },
}
</script>

<style scoped></style>

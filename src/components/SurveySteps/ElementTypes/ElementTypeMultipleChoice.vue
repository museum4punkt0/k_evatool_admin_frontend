<template>
    {{ selectedLanguage.code }}
    <button
        v-for="language in store.state.languages.data"
        :key="'lang' + language.id"
        class="primary"
        :class="{ active: selectedLanguage.code === language.code }"
        @click="setSelectedLanguage(language)"
    >
        {{ language.code }}
    </button>

    <form-input
        v-for="language in store.state.languages.data.filter(
            (item) => item.code === selectedLanguage.code,
        )"
        :key="'question_lang' + language.id"
        v-model:value="paramsLocal.question[language.code]"
        class="mt-3"
        :label="'question (' + language.code + ')'"
    />

    <div
        v-for="(option, index) in paramsLocal.options"
        :key="`option_${index}`"
        class="grid grid-cols-12 grap-4"
    >
        <form-input
            v-model:value="paramsLocal.options[index]['value']"
            class="mt-3 col-span-10"
            :label="`value ${index + 1}`"
        />
        <form-input
            v-for="language in store.state.languages.data.filter(
                (item) => item.code === selectedLanguage.code,
            )"
            :key="'option_lang' + language.id"
            v-model:value="paramsLocal.options[index]['labels'][language.code]"
            class="mt-3 col-span-10"
            :label="`option ${index + 1} ( ${language.code})`"
        />
        <button class="primary col-span-2" @click="removeOption(option, index)">
            <TrashIcon class="mx-1 h-5 w-5 pointer" />
        </button>
    </div>
    <button class="primary" @click="addOption">
        <PlusIcon class="mx-1 h-5 w-5 pointer" />
    </button>

    <div class="grid grid-cols-2 gap-4">
        <form-input
            v-model:value="paramsLocal.minSelectable"
            class="mt-3"
            label="minSelectable"
        />
        <form-input
            v-model:value="paramsLocal.maxSelectable"
            class="mt-3"
            label="maxSelectable"
        />
    </div>
</template>

<script>
import { useStore } from 'vuex'
import FormInput from '../../Forms/FormInput.vue'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, between } from '@vuelidate/validators'
import { useState } from '../../../composables/state'
import { TrashIcon, PlusIcon } from '@heroicons/vue/outline'

export default {
    name: 'ElementTypeMultipleChoiceQuestion',
    components: { FormInput, TrashIcon, PlusIcon },
    props: {
        params: {
            type: Object,
            default: () => null,
        },
    },
    emits: ['update:params', 'update:params-valid'],
    setup(props, { emit }) {
        const store = useStore()
        const { t } = useI18n()
        const [selectedLanguage, setSelectedLanguage] = useState(
            store.state.languages.languages.find((lang) => lang.default),
        )

        const paramsLocal = computed({
            get: () => props.params,
            set: (val) => emit('update:params', val),
        })

        console.log(paramsLocal.value.options)

        const validations = {
            minSelectable: {
                required,
                between: between(1, paramsLocal.value.options.length),
            },
            maxSelectable: {
                required,
                between: between(
                    paramsLocal.value.minSelectable,
                    paramsLocal.value.options.length,
                ),
            },
        }
        const addOption = () => {
            // TODO: how to mutate computed property
            // TODO: force rerender to update validation rules
            const newParams = {
                ...paramsLocal.value,
                options: [
                    ...paramsLocal.value.options,
                    {
                        value: '',
                        labels: { de: 'test', en: 'test', fr: 'test' },
                    },
                ],
            }
            emit('update:params', newParams)
        }
        const removeOption = (option, index) => {
            // TODO: how to mutate computed property
            const options = [...paramsLocal.value.options]
            options.splice(index, 1)
            const newParams = {
                ...paramsLocal.value,
                options,
            }
            emit('update:params', newParams)
        }

        return {
            store,
            paramsLocal,
            t,
            v$: useVuelidate(validations, paramsLocal),
            selectedLanguage,
            setSelectedLanguage,
            addOption,
            removeOption,
        }
    },
}
</script>

<style scoped></style>

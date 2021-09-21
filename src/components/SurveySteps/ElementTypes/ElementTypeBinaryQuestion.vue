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
        :key="'lang' + language.id"
        v-model:value="paramsLocal.question[language.code]"
        class="mt-3"
        :label="'question (' + language.code + ')'"
    />
    <div class="grid grid-cols-12 gap-4">
        <form-input
            v-for="language in store.state.languages.data.filter(
                (item) => item.code === selectedLanguage.code,
            )"
            :key="'lang' + language.id"
            v-model:value="paramsLocal.trueLabel[language.code]"
            class="mt-3 col-span-6"
            :label="t('binary_positive_label') + ' (' + language.code + ')'"
        />
        <form-input
            v-for="language in store.state.languages.data.filter(
                (item) => item.code === selectedLanguage.code,
            )"
            :key="'lang' + language.id"
            v-model:value="paramsLocal.falseLabel[language.code]"
            class="mt-3 col-span-6"
            :label="t('binary_negative_label') + ' (' + language.code + ')'"
        />
    </div>
    <div class="grid grid-cols-12 gap-4">
        <form-input
            v-model:value="paramsLocal.trueValue"
            class="mt-3 col-span-6"
            :label="t('binary_positive')"
        />
        <form-input
            v-model:value="paramsLocal.falseValue"
            class="mt-3 col-span-6"
            :label="t('binary_negative')"
        />
    </div>
</template>

<script>
import { useStore } from 'vuex'
import FormInput from '../../Forms/FormInput.vue'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import useVuelidate from '@vuelidate/core'
import { maxLength, minLength, required } from '@vuelidate/validators'
import { useState } from '../../../composables/state'

export default {
    name: 'ElementTypeBinaryQuestion',
    components: { FormInput },
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

        return {
            store,
            paramsLocal,
            t,
            v$: useVuelidate(),
            selectedLanguage,
            setSelectedLanguage,
        }
    },
    validations: {
        paramsLocal: {
            trueValue: {
                required,
                minLength: minLength(1),
                maxLength: maxLength(20),
            },
            falseValue: {
                required,
                minLength: minLength(1),
                maxLength: maxLength(20),
            },
        },
    },
}
</script>

<style scoped></style>

<template>
    <form-input
        v-for="language in store.state.languages.data"
        :key="'lang' + language.id"
        v-model:value="paramsLocal.question[language.code]"
        class="mt-3"
        :label="'question (' + language.code + ')'"
    />

    <form-input
        v-model:value="paramsLocal.trueValue"
        class="mt-3"
        :label="t('binary_positive')"
    />
    <form-input
        v-model:value="paramsLocal.falseValue"
        class="mt-3"
        :label="t('binary_negative')"
    />
</template>

<script>
import { useStore } from 'vuex'
import FormInput from '../../Forms/FormInput.vue'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import useVuelidate from '@vuelidate/core'
import { maxLength, minLength, required } from '@vuelidate/validators'

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

        const paramsLocal = computed({
            get: () => props.params,
            set: (val) => emit('update:params', val),
        })

        return { store, paramsLocal, t, v$: useVuelidate() }
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

<template>
    <h1>Binary question</h1>
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
        :label="t('binary_megative')"
    />
</template>

<script>
import { useStore } from 'vuex'
import FormInput from '../../Forms/FormInput.vue'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

export default {
    name: 'ElementTypeBinaryQuestion',
    components: { FormInput },
    props: {
        params: {
            type: Object,
            default: () => null,
        },
        validation: {
            type: Object,
            default: null,
        },
    },
    emits: ['update:params'],
    setup(props, { emit }) {
        const store = useStore()
        const { t } = useI18n()

        const paramsLocal = computed({
            get: () => props.params,
            set: (val) => emit('update:params', val),
        })
        return { store, paramsLocal, t }
    },
}
</script>

<style scoped></style>

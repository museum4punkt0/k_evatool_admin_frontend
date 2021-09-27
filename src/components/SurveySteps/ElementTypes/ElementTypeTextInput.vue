<template>
    <form-input
        v-for="language in store.state.languages.data"
        :key="'lang' + language.id"
        v-model:value="paramsLocal.question[language.code]"
        :label="'question (' + language.code + ')'"
    />
</template>

<script>
import { useStore } from 'vuex'
import FormInput from '../../Forms/FormInput.vue'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import useVuelidate from '@vuelidate/core'
// import { required, between } from '@vuelidate/validators'
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

        const paramsLocal = computed({
            get: () => props.params,
            set: (val) => emit('update:params', val),
        })
        const validations = computed({
            get: () => {
                return {}
            },
            set: (val) => emit('update:params', val),
        })

        return {
            store,
            paramsLocal,
            t,
            v$: useVuelidate(validations, paramsLocal),
        }
    },
}
</script>

<style scoped></style>

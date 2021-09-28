<template>
    <h3>Simple text</h3>
    <form-input
        v-for="language in store.state.languages.languages"
        :key="'lang' + language.id"
        v-model:value="paramsLocal.text[language.code]"
        :name="'lang' + language.id"
        :label="'question (' + language.code + ')'"
    />
</template>

<script>
import { computed, onMounted } from 'vue'
import defaultParams from './defaultParams'
import { useStore } from 'vuex'
import FormInput from '../../Forms/FormInput.vue'

export default {
    name: 'ElementTypeSimpleText',
    components: { FormInput },
    props: {
        params: {
            type: Object,
            default: () => null,
        },
    },
    emits: ['update:params'],
    setup(props, { emit }) {
        const store = useStore()
        const paramsLocal = computed({
            get: () => props.params,
            set: (val) => emit('update:params', val),
        })

        onMounted(() => {
            if (!paramsLocal.value) {
                paramsLocal.value = defaultParams.simpleText
            }
        })

        return {
            paramsLocal,
            store,
        }
    },
}
</script>

<style scoped></style>

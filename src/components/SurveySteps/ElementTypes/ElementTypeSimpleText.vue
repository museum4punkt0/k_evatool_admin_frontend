<template>
    <h1>Simple text</h1>
    <input v-model="paramsLocal.text.de" type="text" />
</template>

<script>
import { computed } from 'vue'
import defaultParams from './defaultParams'

export default {
    name: 'ElementTypeSimpleText',
    props: {
        params: {
            type: Object,
            default: () => ({}),
        },
    },
    emits: ['update:params'],
    setup(props, { emit }) {
        const paramsLocal = computed({
            get: () => props.params || defaultParams.simpleText,
            set: (val) => emit('update:params', val),
        })

        return {
            paramsLocal,
        }
    },
}
</script>

<style scoped></style>

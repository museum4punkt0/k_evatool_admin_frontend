<template>
    <h3>Simple text</h3>
    <input v-if="paramsLocal?.text" v-model="paramsLocal.text.de" type="text" />
</template>

<script>
import { computed, onMounted } from 'vue'
import defaultParams from './defaultParams'

export default {
    name: 'ElementTypeSimpleText',
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
        }
    },
}
</script>

<style scoped></style>

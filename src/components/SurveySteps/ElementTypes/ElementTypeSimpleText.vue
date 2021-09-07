<template>
    <h1>Simple text</h1>

    <pre class="text-xs mt-4">{{ params }}</pre>

    <input v-model="params.text.de" type="text" />
</template>

<script>
import { reactive } from 'vue'

export default {
    name: 'ElementTypeSimpleText',
    emits: ['update:params'],
    setup() {
        const params = reactive({
            text: {
                de: '',
                en: '',
                fr: '',
            },
        })

        return {
            params,
        }
    },
}
</script>

<style scoped></style>

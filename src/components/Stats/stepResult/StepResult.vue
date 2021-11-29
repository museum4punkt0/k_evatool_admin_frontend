<template>
    <simple-text-result
        v-if="step.surveyElementType === 'simpleText'"
        :result="result"
    ></simple-text-result>
    <binary-result
        v-else-if="step.surveyElementType === 'binary'"
        :result="result"
    ></binary-result>
    <template v-else>
        {{ result }}
    </template>
</template>

<script>
import SimpleTextResult from './SimpleTextResult.vue'
import BinaryResult from './BinaryResult.vue'
export default {
    name: 'StepResult',
    components: { SimpleTextResult, BinaryResult },
    props: {
        step: {
            type: Object,
            required: true,
        },
        result: {
            type: Object,
            required: true,
        },
    },
    setup() {
        return {}
    },
}
</script>

<style scoped></style>

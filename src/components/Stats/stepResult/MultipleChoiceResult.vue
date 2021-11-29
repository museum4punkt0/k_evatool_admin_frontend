<template>
    <div>value: {{ result.value.selected }}</div>
</template>

<script>
export default {
    name: 'MultipleChoiceResult',
    props: {
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

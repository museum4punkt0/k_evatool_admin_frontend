<template>
    <div>{{ result?.value?.selected.join(', ') }}</div>
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

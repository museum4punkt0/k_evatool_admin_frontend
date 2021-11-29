<template>
    <div>{{ result.value.value }}</div>
</template>

<script>
export default {
    name: 'BinaryResult',
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

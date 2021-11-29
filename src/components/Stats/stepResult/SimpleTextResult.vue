<template>
    <div>{{ result.value.read ? 'read' : 'not read' }}</div>
</template>

<script>
export default {
    name: 'SimpleTextResult',
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

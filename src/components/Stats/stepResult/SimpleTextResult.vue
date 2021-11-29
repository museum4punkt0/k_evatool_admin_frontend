<template>
    <div>simple text result</div>
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

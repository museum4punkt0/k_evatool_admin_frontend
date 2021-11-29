<template>
    <div>{{ result?.value?.text }}</div>
</template>

<script>
export default {
    name: 'VideoResult',
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

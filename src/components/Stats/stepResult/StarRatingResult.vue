<template>
    <div>{{ result?.value?.rating }}</div>
</template>

<script>
export default {
    name: 'StarRatingResult',
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

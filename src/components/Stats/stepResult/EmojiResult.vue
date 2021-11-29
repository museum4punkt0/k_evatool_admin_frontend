<template>
    <div>{{ result?.value?.meaning }}</div>
</template>

<script>
export default {
    name: 'EmojiResult',
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

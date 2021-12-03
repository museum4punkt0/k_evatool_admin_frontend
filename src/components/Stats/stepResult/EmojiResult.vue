<template>
    <div>
        {{ params.find((x) => x.meaning === result?.value?.meaning)?.type }}
    </div>
</template>

<script>
export default {
    name: 'EmojiResult',
    props: {
        result: {
            type: Object,
            required: true,
        },
        params: {
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

<template>
    <div>{{ result?.value?.audio }}</div>
</template>

<script>
export default {
    name: 'VoiceInputResult',
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

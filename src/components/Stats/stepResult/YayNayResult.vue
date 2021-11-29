<template>
    <div>
        <div v-for="(image, index) in result?.value?.images" :key="index">
            asset: {{ image.asset }}, value: {{ image.value }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'YayNayResult',
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

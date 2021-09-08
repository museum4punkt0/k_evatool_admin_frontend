<template>
    <pre
        class="
            text-xs
            w-full
            bg-yellow-100
            rounded-md
            p-3
            border border-yellow-400
        "
        >{{ data }}</pre
    >
</template>

<script>
export default {
    name: 'DataViewer',
    props: {
        data: {
            type: [Object, Array, Number, String, Boolean],
            default: () => {},
        },
    },
}
</script>

<style scoped></style>

<template>
    <pre class="text-xs w-full bg-yellow-200 rounded-md p-3">{{ data }}</pre>
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

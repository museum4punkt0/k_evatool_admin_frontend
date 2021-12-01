<template>
    <div>
        <pre>
            {{ results.total.results.analysis }}
        </pre>
    </div>
</template>

<script>
export default {
    name: 'TextInputResults',
    components: {},
    props: {
        results: {
            type: Array,
            required: true,
        },
    },
    setup() {
        return {}
    },
}
</script>

<style scoped></style>

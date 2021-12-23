<template>
    <div>
        {{
            result?.value?.selected
                .map((opt) => {
                    if (opt.comment) {
                        return opt.value + ': ' + opt.comment
                    }
                    return opt.value
                })
                .join(', ')
        }}
    </div>
</template>

<script>
export default {
    name: 'MultipleChoiceResult',
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

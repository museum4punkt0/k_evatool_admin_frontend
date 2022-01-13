<template>
    <div>
        {{
            result?.value?.selected
                .map((opt) => {
                    const value = params.find((x) => x.value === opt.value)
                        .labels[store.state.languageCode]
                    if (opt.comment) {
                        return value + ': ' + opt.comment
                    }
                    return value
                })
                .join(', ')
        }}
    </div>
</template>

<script>
import { useStore } from 'vuex'

export default {
    name: 'MultipleChoiceResult',
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
        const store = useStore()
        return {
            store,
        }
    },
}
</script>

<style scoped></style>

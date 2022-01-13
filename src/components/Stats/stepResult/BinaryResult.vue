<template>
    <div>
        {{ getLabel() }}
    </div>
</template>

<script>
import { useStore } from 'vuex'

export default {
    name: 'BinaryResult',
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
    setup(props) {
        const store = useStore()

        function getLabel() {
            if (props.params.trueValue === props.result?.value?.value) {
                return props.params.trueLabel[store.state.languageCode]
            }
            return props.params.falseLabel[store.state.languageCode]
        }

        return {
            getLabel,
        }
    },
}
</script>

<style scoped></style>

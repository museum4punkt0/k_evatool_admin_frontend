<template>
    <pre
        v-if="store.state.debug"
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
import { useStore } from 'vuex'

export default {
    name: 'DataViewer',
    props: {
        data: {
            type: [Object, Array, Number, String, Boolean],
            default: () => {},
        },
    },
    setup() {
        const store = useStore()
        return { store }
    },
}
</script>

<style scoped></style>

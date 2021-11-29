<template>
    <div>
        {{ result?.value.text }}
    </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
    name: 'TextInputDetailResult',
    props: {
        result: {
            type: Object,
            required: true,
        },
    },
    setup() {
        const store = useStore()
        const assets = computed({
            get: () => store.state.assets.assets,
        })
        return { assets }
    },
}
</script>

<style scoped></style>

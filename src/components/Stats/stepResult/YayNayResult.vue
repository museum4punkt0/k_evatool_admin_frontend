<template>
    <div class="flex">
        <div v-for="(image, index) in result?.value?.images" :key="index">
            <div class="mr-2">
                <small>{{ image.value }}</small>
                <img
                    class="rounded"
                    :src="
                        assets.find((item) => item.id === image.asset)?.urls
                            .original
                    "
                />
            </div>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
    name: 'YayNayResult',
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

<style scoped>
img {
    max-width: 40px;
    max-height: 40px;
}
</style>

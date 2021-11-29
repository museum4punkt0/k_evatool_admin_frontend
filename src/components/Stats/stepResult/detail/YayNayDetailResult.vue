<template>
    <div class="flex">
        <div v-for="(image, index) in result?.value?.images" :key="index">
            <div class="mr-3">
                {{ image.value }}
                <img
                    class="rounded mr-3"
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
    name: 'YayNayDetailResult',
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

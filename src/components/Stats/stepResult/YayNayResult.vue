<template>
    <div class="flex overflow-x-auto">
        <div v-for="(image, index) in result?.value?.images" :key="index">
            <div class="mr-2">
                <small>{{ getLabel(image.value) }}</small>
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
        params: {
            type: Object,
            required: true,
        },
    },
    setup(props) {
        const store = useStore()

        function getLabel(value) {
            if (props.params.trueValue === value) {
                return props.params.trueLabel[store.state.languageCode]
            }
            return props.params.falseLabel[store.state.languageCode]
        }

        const assets = computed({
            get: () => store.state.assets.assets,
        })
        return { assets, getLabel }
    },
}
</script>

<style scoped>
img {
    max-width: 40px;
    height: 40px;
}
</style>

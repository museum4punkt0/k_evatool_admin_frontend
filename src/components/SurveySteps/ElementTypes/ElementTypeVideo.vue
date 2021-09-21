<template>
    <form-select
        v-model:selected="paramsLocal.videoAssetId"
        :options="assets"
        title-key="filename"
        value-key="id"
        :default-value="-1"
        :label="t('videos', 1)"
    />
</template>

<script>
import FormSelect from '../../Forms/FormSelect.vue'
import { useStore } from 'vuex'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import defaultParams from './defaultParams'

export default {
    name: 'ElementTypeVideo',
    components: { FormSelect },
    props: {
        params: {
            type: Object,
            default: () => null,
        },
    },
    emits: ['update:params'],
    setup(props, { emit }) {
        const store = useStore()
        const video = ref(null)
        const { t } = useI18n()

        const assets = computed({
            get: () =>
                store.state.assets.data.filter((x) => x.mime.includes('video')),
        })

        const paramsLocal = computed({
            get: () => props.params,
            set: (val) => emit('update:params', val),
        })

        return { assets, t, paramsLocal, video }
    },
}
</script>

<style scoped></style>

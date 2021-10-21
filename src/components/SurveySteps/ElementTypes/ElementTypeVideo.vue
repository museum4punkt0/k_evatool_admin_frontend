<template>
    <div v-if="paramsLocal.videoAssetId === -1">video not yet selected</div>
    <video v-else class="rounded" controls>
        <source
            :src="
                assets.find((item) => item.id === paramsLocal.videoAssetId)
                    ?.urls.original
            "
            type="video/mp4"
        />
    </video>
    <button class="primary" @click="setAssetSelectorModalOpen(true)">
        {{ t('button_choose_video') }}
    </button>
    <asset-selector-modal
        :is-open="assetSelectorModalOpen"
        :selected-assets="[paramsLocal.videoAssetId]"
        mime-type-filter-prefix="video"
        :multiple-select="false"
        :auto-close="true"
        @update:is-open="setAssetSelectorModalOpen"
        @update:selected-assets="onAssetsSelected"
    ></asset-selector-modal>
    <!-- <form-select
        v-model:selected="paramsLocal.videoAssetId"
        :options="assets"
        title-key="filename"
        value-key="id"
        :default-value="-1"
        :label="t('videos', 1)"
    /> -->
</template>

<script>
import FormSelect from '../../Forms/FormSelect.vue'
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useState } from '../../../composables/state'
import AssetSelectorModal from '../../Assets/AssetSelectorModal.vue'

export default {
    name: 'ElementTypeVideo',
    components: { FormSelect, AssetSelectorModal },
    props: {
        params: {
            type: Object,
            default: () => null,
        },
    },
    emits: ['update:params', 'isValid'],
    setup(props, { emit }) {
        const store = useStore()
        const video = ref(null)
        const { t } = useI18n()
        const [assetSelectorModalOpen, setAssetSelectorModalOpen] =
            useState(false)

        const assets = computed({
            get: () =>
                store.state.assets.assets.filter((x) =>
                    x.mime.includes('video'),
                ),
        })

        const paramsLocal = computed({
            get: () => props.params,
            set: (val) => emit('update:params', val),
        })

        const onAssetsSelected = (assets) => {
            console.log('assets selected', assets)
            paramsLocal.value.videoAssetId = assets
        }

        return {
            assets,
            t,
            paramsLocal,
            video,
            assetSelectorModalOpen,
            setAssetSelectorModalOpen,
            onAssetsSelected,
        }
    },
}
</script>

<style scoped></style>

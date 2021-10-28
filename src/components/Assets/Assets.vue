<template>
    <div class="flex overflow-hidden">
        <main class="flex h-full w-full flex-col p-3">
            <div class="flex flex-row justify-between">
                <!-- <h1 v-if="store.state.assets?.assets" class="mb-3">
                    {{ store.state.assets.assets.length }}
                    {{ t('assets', store.state.assets.assets.length) }}
                </h1> -->
                <h1
                    v-if="
                        filteredAssets.length > 0 &&
                        filteredAssets.length < assets.length
                    "
                >
                    {{ filteredAssets.length }} {{ t('of') }}
                    {{ assets.length }}
                    {{ t('assets', filteredAssets.length) }}
                </h1>
                <h1 v-else>
                    {{ assets.length }} {{ t('assets', assets.length) }}
                </h1>
                <div class="flex-1 flex flex-row justify-end">
                    <form-input
                        v-model:value="searchQuery"
                        name="name"
                        type="text"
                        label=""
                        :placeholder="`${t('filter', 1)}: ${t('id')}, ${t(
                            'file',
                        )}, ${t('type')}`"
                        class="mr-4"
                    />
                </div>
            </div>
            <div
                v-if="
                    store.state.assets?.assets &&
                    store.state.assets.assets.length > 0
                "
                class="table-wrap mt-3"
            >
                <table class="table-fixed">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th></th>
                            <th>{{ t('filename') }}</th>
                            <th>{{ t('filetype') }}</th>
                            <th>{{ t('filesize') }}</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(asset, i) in assets.filter(filter)"
                            :key="asset.id"
                            :ref="
                                (el) => {
                                    assetRefs['asset' + i] = el
                                }
                            "
                            @click="openAssetModal(asset.id)"
                        >
                            <td class="text-lg">
                                {{ asset.id }}
                            </td>
                            <td class="m-0 p-0">
                                <img
                                    v-if="asset.urls.thumbnail"
                                    class="max-h-8 max-w-16"
                                    :alt="asset.filename"
                                    :src="asset.urls.thumbnail"
                                />
                            </td>
                            <td>
                                {{ asset.filename }}
                                <p class="text-xs text-gray-500">
                                    {{ asset.hash }}
                                </p>
                            </td>
                            <td class="text-sm">
                                {{ asset.mime }}
                            </td>
                            <td>
                                {{ asset.sizeHuman }}
                            </td>
                            <td class="px-6 py-4 flex flex-row">
                                <!-- TODO: DISABLE DELETE IF IN USE -->
                                <!--
                                    <trash-icon
                                        v-if="inUse > 0"
                                        class="
                                            mx-1
                                            h-5
                                            w-5
                                            text-gray-500
                                            cursor-not-allowed
                                        "
                                        @click.prevent.stop="null"
                                    />
                                    -->
                                <trash-icon
                                    class="mx-1 h-5 w-5 text-red-500 pointer"
                                    @click.prevent.stop="deleteAsset(asset.id)"
                                />
                                <EyeIcon
                                    class="mx-1 h-5 w-5 pointer"
                                    @click.prevent.stop="
                                        openAssetModal(asset.id)
                                    "
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </main>
        <aside>
            <h1 class="text-xl">Upload</h1>

            <dashboard class="mt-3" :uppy="uppy" :props="dashboardOptions" />
            <asset-selector-modal
                v-model:selected-assets="selectedAssets"
                v-model:is-open="selectorModalIsOpen"
            ></asset-selector-modal>
        </aside>
    </div>
    <asset-modal
        v-if="assetModalStepId > 0 && assetModalIsOpen"
        v-model:is-open="assetModalIsOpen"
        :asset="
            store.state.assets?.assets.find((x) => x.id === assetModalStepId)
        "
    />
</template>

<script>
import { TrashIcon, EyeIcon } from '@heroicons/vue/outline'
import {
    onUpdated,
    ref,
    onMounted,
    onBeforeUpdate,
    watchEffect,
    watch,
    computed,
} from 'vue'
import { useStore } from 'vuex'

import { Dashboard } from '@uppy/vue'
import FormInput from '../Forms/FormInput.vue'

import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'

import Uppy from '@uppy/core'
import Tus from '@uppy/tus'

// language pack
import German from '@uppy/locales/lib/de_DE'
import { useI18n } from 'vue-i18n'
import AssetModal from './AssetModal.vue'
import AssetSelectorModal from './AssetSelectorModal.vue'
import { useState } from '../../composables/state'

import { searchForWordsInString } from '../../utils/search'

export default {
    name: 'Assets',
    components: {
        AssetSelectorModal,
        AssetModal,
        Dashboard,
        EyeIcon,
        FormInput,
        TrashIcon,
    },
    setup() {
        const assetRefs = ref([])
        const store = useStore()
        const isBusy = ref(false)
        const { t } = useI18n()

        const selectedAssets = ref(-1)
        const searchQuery = ref('')

        const assetModalIsOpen = ref(false)
        const selectorModalIsOpen = ref(false)
        const assetModalStepId = ref(-1)

        const assets = computed(() => store.state.assets.assets)
        const [filteredAssets, setFilteredAssets] = useState(assets.value)

        onMounted(() => {
            store.dispatch('assets/getAssets')
        })

        watchEffect(() => {})

        onBeforeUpdate(() => {})
        onUpdated(() => {})

        const uppy = computed({
            get: () =>
                new Uppy({
                    autoProceed: true,
                    locale: German,
                })
                    .on('upload-success', () => {
                        // Todo: Remove file from list after upload
                        // this.uppy.removeFile(file.id)
                    })
                    .on('complete', () => {
                        console.log('complete')
                        store.dispatch('assets/getAssets')
                    })
                    .use(Tus, {
                        endpoint: import.meta.env.VITE_TUS_URL,
                        retryDelays: [0, 1000, 3000, 5000],
                        removeFingerprintOnSuccess: true,
                        uploadDataDuringCreation: false,
                        chunkSize: 1000000,
                        // Todo: Implement api authorization on TUS server
                        /*headers: {
                            Authorization: `Bearer ${store.state.users.token}`
                        }*/
                    }),
        })

        const openAssetModal = async (assetId) => {
            assetModalIsOpen.value = true
            assetModalStepId.value = assetId
        }

        const deleteAsset = async (assetId) => {
            const confirmAssetDelete = confirm(t('confirm_delete_asset'))
            isBusy.value = true
            if (confirmAssetDelete) {
                await store.dispatch('assets/deleteAsset', assetId)
            }
            isBusy.value = false
        }

        const filter = (asset) => {
            return (
                searchForWordsInString([asset], searchQuery.value, [
                    'id',
                    'filename',
                    'mime',
                ]).length > 0
            )
        }
        watch(searchQuery, () => {
            const filteredSurveys = assets.value.filter(filter)
            setFilteredAssets(filteredSurveys)
        })

        return {
            selectedAssets,
            assetModalIsOpen,
            selectorModalIsOpen,
            assetModalStepId,
            deleteAsset,
            openAssetModal,
            dashboardOptions: {
                theme: 'light',
                showProgressDetails: true,
                height: '100%',
                width: '100%',
            },
            store,
            assetRefs,
            t,
            uppy,
            assets,
            filter,
            filteredAssets,
            searchQuery,
        }
    },
}
</script>

<style scoped></style>

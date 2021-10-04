<template>
    <div class="flex-1 flex items-stretch overflow-hidden">
        <main class="flex-1 overflow-y-auto p-3">
            <h1 v-if="store.state.assets?.data" class="mb-3">
                {{ store.state.assets.data.length }}
                {{ t('assets', store.state.assets.data.length) }}
            </h1>

            <template
                v-if="
                    store.state.assets?.data &&
                    store.state.assets.data.length > 0
                "
            >
                <h2 class="text-lg mb-1">
                    {{ store.state.assets?.data.length }}
                    {{ t('assets', store.state.assets?.data.length) }}
                </h2>
                <div class="table-wrap">
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
                                v-for="(asset, i) in store.state.assets?.data"
                                :key="asset.id"
                                :ref="
                                    (el) => {
                                        assetRefs['asset' + i] = el
                                    }
                                "
                            >
                                <td class="text-lg">
                                    {{ asset.id }}
                                </td>
                                <td class="w-12 m-0 p-0">
                                    <img
                                        v-if="asset.urls.thumbnail"
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
                                    />
                                    -->
                                    <trash-icon
                                        class="
                                            mx-1
                                            h-5
                                            w-5
                                            text-red-500
                                            pointer
                                        "
                                        @click.prevent.stop="
                                            deleteAsset(asset.id)
                                        "
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
            </template>
        </main>
        <aside>
            <h1 class="text-xl">Upload</h1>
            <dashboard class="mt-3" :uppy="uppy" :props="dashboardOptions" />
        </aside>
    </div>
    <asset-modal
        v-if="assetModalStepId > 0 && assetModalIsOpen"
        v-model:is-open="assetModalIsOpen"
        :asset="store.state.assets?.data.find((x) => x.id === assetModalStepId)"
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
    computed,
} from 'vue'
import { useStore } from 'vuex'

import { Dashboard } from '@uppy/vue'

import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'

import Uppy from '@uppy/core'
import Tus from '@uppy/tus'

// language pack
import German from '@uppy/locales/lib/de_DE'
import { useI18n } from 'vue-i18n'
import AssetModal from './AssetModal.vue'

export default {
    name: 'Assets',
    components: {
        AssetModal,
        Dashboard,
        EyeIcon,
        TrashIcon,
    },
    setup() {
        const assetRefs = ref([])
        const store = useStore()
        const isBusy = ref(false)
        const { t } = useI18n()

        const assetModalIsOpen = ref(false)
        const assetModalStepId = ref(-1)

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

        return {
            assetModalIsOpen,
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
        }
    },
}
</script>

<style scoped></style>

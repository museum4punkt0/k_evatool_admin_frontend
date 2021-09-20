<template>
    <div class="flex-1 flex items-stretch overflow-hidden">
        <main class="flex-1 overflow-y-auto p-3">
            <h1 class="mb-3">{{ $tc('assets', 2) }}</h1>

            <template
                v-if="
                    store.state.assets?.data &&
                    store.state.assets.data.length > 0
                "
            >
                <h2 class="text-lg mb-1">
                    {{ store.state.assets?.data.length }}
                    {{ $tc('assets', store.state.assets?.data.length) }}
                </h2>
                <div class="table-wrap">
                    <table class="table-fixed">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>{{ $t('filename') }}</th>
                                <th>{{ $t('filesize') }}</th>
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
                                <td>
                                    {{ asset.id }}
                                </td>
                                <td>
                                    {{ asset.filename }}
                                    <p class="text-xs text-gray-500">
                                        {{ asset.hash }}
                                    </p>
                                </td>
                                <td>
                                    {{ asset.sizeHuman }}
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
</template>

<script>
import { onUpdated, ref, onMounted, onBeforeUpdate, watchEffect } from 'vue'
import { useStore } from 'vuex'

import { Dashboard } from '@uppy/vue'

import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'

import Uppy from '@uppy/core'
import Tus from '@uppy/tus'

// language pack
import German from '@uppy/locales/lib/de_DE'

export default {
    name: 'Assets',
    components: {
        Dashboard,
    },
    setup() {
        const assetRefs = ref([])
        const store = useStore()

        onMounted(() => {
            store.dispatch('assets/getAssets')
        })

        watchEffect(() => {})

        onBeforeUpdate(() => {})
        onUpdated(() => {})

        return {
            dashboardOptions: {
                theme: 'light',
                showProgressDetails: true,
                height: '100%',
                width: '100%',
            },
            store,
            assetRefs,
        }
    },
    computed: {
        uppy: () =>
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
                })
                .use(Tus, {
                    endpoint: import.meta.env.VITE_TUS_URL,
                    retryDelays: [0, 1000, 3000, 5000],
                    removeFingerprintOnSuccess: true,
                    uploadDataDuringCreation: false,
                }),
    },
}
</script>

<style scoped></style>

<template>
    <dashboard class="mt-3" :uppy="uppy" :props="dashboardOptions" />
</template>

<script>
import { Dashboard } from '@uppy/vue'
import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import Uppy from '@uppy/core'
import Tus from '@uppy/tus'
import German from '@uppy/locales/lib/de_DE'

import { computed } from 'vue'
import { useStore } from 'vuex'
import _ from 'lodash'

export default {
    name: 'Uploader',
    components: { Dashboard },
    props: {
        type: { type: String, default: 'surveyAsset', required: true },
        meta: { type: Object, default: () => {} },
    },
    setup(props) {
        const store = useStore()

        const metaPayload = _.cloneDeep(props.meta)
        metaPayload.type = _.cloneDeep(props.type)

        const uppy = computed({
            get: () => {
                const uppy = new Uppy({
                    autoProceed: true,
                    locale: German,
                })

                uppy.on('upload-success', () => {
                    // Todo: Remove file from list after upload
                    // this.uppy.removeFile(file.id)
                })

                uppy.on('complete', () => {
                    console.log('complete')
                    store.dispatch('assets/getAssets')
                })

                uppy.use(Tus, {
                    endpoint: import.meta.env.VITE_TUS_URL,
                    retryDelays: [0, 1000, 3000, 5000],
                    removeFingerprintOnSuccess: true,
                    uploadDataDuringCreation: false,
                    chunkSize: 1000000,
                    metaFields: { ...metaPayload },
                })

                return uppy
            },
        })

        const dashboardOptions = {
            theme: 'light',
            showProgressDetails: true,
            height: '100%',
            width: '100%',
        }

        return {
            uppy,
            dashboardOptions,
        }
    },
}
</script>

<style scoped></style>

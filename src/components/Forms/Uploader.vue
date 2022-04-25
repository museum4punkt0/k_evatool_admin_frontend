<template>
    <dashboard class="mt-3" :uppy="uppy" :props="dashboardOptions" />
</template>

<script>
import { Dashboard } from '@uppy/vue'
import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import Uppy from '@uppy/core'
import XHRUpload from '@uppy/xhr-upload'
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
        endpoint: { type: String, default: '', required: true },
        maxFileSize: { type: Number, default: null },
        maxFiles: { type: Number, default: null },
        mimeType: { type: Array, default: null },
    },
    emits: ['success'],
    setup(props, ctx) {
        const metaPayload = _.cloneDeep(props.meta)
        metaPayload.type = _.cloneDeep(props.type)

        const uppy = computed({
            get: () => {
                const uppy = new Uppy({
                    autoProceed: true,
                    locale: German,
                    meta: { assetMeta: JSON.stringify(metaPayload) },
                    restrictions: {
                        maxFileSize: props.maxFileSize,
                        maxNumberOfFiles: props.maxFiles,
                        allowedFileTypes: props.mimeType,
                    },
                })

                uppy.on('upload-success', (file, response) => {
                    ctx.emit('success', response.body)
                })

                uppy.on('complete', () => {})

                uppy.use(XHRUpload, {
                    endpoint: props.endpoint,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            'evaToken',
                        )}`,
                    },
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

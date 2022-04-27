<template>
    <dashboard class="mt-3" :uppy="uppy" :props="dashboardOptions" />
    <div
        v-if="
            props.minWidth > 0 ||
            props.maxWidth > 0 ||
            props.minHeight > 0 ||
            props.maxHeight > 0 ||
            props.ratio > 0
        "
        class="text-gray-600 text-sm mt-2 bg-gray-300 px-3 py-2 rounded-lg"
    >
        <div v-if="props.minWidth > 0">
            {{ t('min_width') }}: {{ props.minWidth }}px
        </div>
        <div v-if="props.maxWidth > 0">
            {{ t('max_width') }}: {{ props.maxWidth }}px
        </div>
        <div v-if="props.minHeight > 0">
            {{ t('min_height') }}: {{ props.minHeight }}px
        </div>
        <div v-if="props.maxHeight > 0">
            {{ t('max_height') }}: {{ props.maxHeight }}px
        </div>
        <div v-if="props.ratio > 0">
            {{ t('image_ratio') }}: {{ props.ratio }}:1
        </div>
    </div>
</template>

<script>
import { Dashboard } from '@uppy/vue'
import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import Uppy from '@uppy/core'
import XHRUpload from '@uppy/xhr-upload'
import German from '@uppy/locales/lib/de_DE'

import { computed } from 'vue'
import _ from 'lodash'
import { useI18n } from 'vue-i18n'

export default {
    name: 'Uploader',
    components: { Dashboard },
    props: {
        type: { type: String, default: 'surveyAsset', required: true },
        meta: {
            type: Object,
            default: () => {},
        },
        endpoint: { type: String, default: '', required: true },
        maxFileSize: { type: Number, default: null },
        maxFiles: { type: Number, default: null },
        mimeType: { type: Array, default: null },
        minWidth: { type: Number, default: 0 },
        maxWidth: { type: Number, default: 0 },
        minHeight: { type: Number, default: 0 },
        maxHeight: { type: Number, default: 0 },
        ratio: { type: Number, default: 0 },
    },
    emits: ['success'],
    setup(props, ctx) {
        const { t } = useI18n()
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
                }).on('file-added', (file) => {
                    const fileReader = new FileReader()

                    fileReader.readAsDataURL(file.data)

                    fileReader.onload = () => {
                        const image = new Image()

                        image.onload = () => {
                            console.log(image.width, image.height)
                            console.log(
                                props.minWidth,
                                props.maxWidth,
                                props.minHeight,
                                props.maxHeight,
                            )
                            if (props.minWidth > 0) {
                                if (image.width < props.minWidth) {
                                    uppy.info(
                                        `${file.name}: width must be minimum ${props.minWidth}px`,
                                    )
                                    uppy.removeFile(file.id)
                                }
                            }
                            if (props.maxWidth > 0) {
                                if (image.width > props.maxWidth) {
                                    uppy.info(
                                        `${file.name}: width must be maximum ${props.maxWidth}px`,
                                    )
                                    uppy.removeFile(file.id)
                                }
                            }
                            if (props.minHeight > 0) {
                                if (image.height < props.minHeight) {
                                    uppy.info(
                                        `${file.name}: height must be minimum ${props.minHeight}px`,
                                    )
                                    uppy.removeFile(file.id)
                                }
                            }
                            if (props.maxHeight > 0) {
                                if (image.height > props.maxHeight) {
                                    uppy.info(
                                        `${file.name}: height must be maximum ${props.maxHeight}px`,
                                    )
                                    uppy.removeFile(file.id)
                                }
                            }
                        }

                        image.src = fileReader.result
                    }
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
            height: '250px',
            width: '100%',
        }

        return {
            uppy,
            dashboardOptions,
            props,
            t,
        }
    },
}
</script>

<style scoped></style>

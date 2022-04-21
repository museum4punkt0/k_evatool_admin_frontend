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

                const endpoint =
                    import.meta.env.VITE_API_BASE_URL_API +
                    '/evaluation-tool/settings-asset'

                console.log(localStorage.getItem('evaToken'))

                uppy.use(XHRUpload, {
                    endpoint,
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

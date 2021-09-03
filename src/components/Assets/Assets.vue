<template>
    <h1 class="text-3xl">Assets</h1>
    <dashboard class="mt-3" :uppy="uppy" :props="dashboardOptions" />
</template>

<script>
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
        return {
            dashboardOptions: {
                theme: 'light',
                showProgressDetails: true,
                height: 200,
                width: '100%',
            },
        }
    },
    computed: {
        uppy: () =>
            new Uppy({
                autoProceed: true,
                locale: German,
            }).use(Tus, {
                endpoint: 'http://localhost:8085/tus/', // use your tus endpoint here
                retryDelays: [0, 1000, 3000, 5000],
            }),
    },
    beforeUnmount() {
        this.uppy.close()
    },
}
</script>

<style scoped></style>

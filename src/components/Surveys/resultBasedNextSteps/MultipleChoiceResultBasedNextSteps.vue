<template>
    <h1>mc next steps</h1>
</template>
<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import useVuelidate from '@vuelidate/core'
export default {
    setup() {
        const store = useStore()
        const { t } = useI18n()
        const surveyStep = computed(() => store.state.surveys.surveyStep)

        return {
            v$: useVuelidate(),
            store,
            t,
            surveyStep,
        }
    },
}
</script>

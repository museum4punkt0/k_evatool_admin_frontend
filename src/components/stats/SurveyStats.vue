<template>
    <div class="flex-1 flex items-stretch overflow-hidden">
        <main class="flex-1 overflow-y-auto p-3">
            <h1>{{ t('stats', 1) }}</h1>
        </main>
    </div>
</template>

<script>
import { useI18n } from 'vue-i18n'

export default {
    name: 'SurveyStats',
    setup() {
        const { t } = useI18n()
        return {
            t,
        }
    },
}
</script>

<style scoped></style>

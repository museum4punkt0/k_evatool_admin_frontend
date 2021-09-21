<template>
    <div class="flex-1 flex items-stretch overflow-hidden">
        <main class="flex-1 overflow-y-auto p-3">
            <h1>
                {{ t('welcome') }}
                <strong>{{ store.state.users.user.name }}</strong>
            </h1>
            <div class="grid grid-cols-3 grid-flow-row gap-4 mt-5">
                <dashboard-tile
                    class="w-full"
                    :title="t('surveys', 2)"
                    route="/surveys"
                />
                <dashboard-tile
                    class="w-full"
                    :title="t('survey_elements', 2)"
                    route="/survey-elements"
                />
                <dashboard-tile
                    class="w-full"
                    :title="t('assets', 2)"
                    route="/assets"
                />
                <dashboard-tile
                    class="w-full"
                    :title="t('users', 2)"
                    route="/users"
                />
                <dashboard-tile
                    class="w-full"
                    :title="t('languages', 2)"
                    route="/languages"
                />
            </div>
        </main>
        <aside></aside>
    </div>
</template>

<script>
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import DashboardTile from './Dashboard/DashboardTile.vue'

export default {
    components: { DashboardTile },
    setup() {
        const store = useStore()
        const { t } = useI18n()
        return { store, t }
    },
}
</script>

<style></style>

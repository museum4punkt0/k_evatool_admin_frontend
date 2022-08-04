<template>
    <div class="flex-1 flex items-stretch overflow-hidden">
        <main class="flex-1 overflow-y-auto p-3">
            <h1 class="capitalize">
                {{ t('welcome') }}
                <strong>{{ store.state.users.user.name }}</strong>
            </h1>
            <div class="grid grid-cols-3 grid-flow-row gap-4 mt-5 capitalize">
                <dashboard-tile
                    v-for="menuElement in menuElements"
                    :key="'element_name_' + menuElement.name"
                    class="w-full"
                    :title="t(menuElement.name, 2)"
                    :icon="menuElement.icon"
                    :route="menuElement.href"
                />
            </div>
        </main>
        <!--        <aside></aside>-->
    </div>
</template>

<script>
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import DashboardTile from './Dashboard/DashboardTile.vue'
import {
    ChartBarIcon,
    GlobeAltIcon,
    PhotographIcon,
    PresentationChartLineIcon,
    UsersIcon,
    ViewGridIcon,
    CogIcon,
} from '@heroicons/vue/outline'

export default {
    components: { DashboardTile },
    setup() {
        const store = useStore()
        const { t } = useI18n()

        const menuElements = [
            {
                name: 'surveys',
                href: '/surveys',
                icon: PresentationChartLineIcon,
            },
            {
                name: 'elements',
                href: '/survey-elements',
                icon: ViewGridIcon,
            },
            {
                name: 'assets',
                href: '/assets',
                icon: PhotographIcon,
            },
            {
                name: 'languages',
                href: '/languages',
                icon: GlobeAltIcon,
            },
            {
                name: 'users',
                href: '/users',
                icon: UsersIcon,
            },
            {
                name: 'stats',
                href: '/stats',
                icon: ChartBarIcon,
            },
            {
                name: 'survey_settings',
                href: '/settings',
                icon: CogIcon,
            },
        ]
        return { menuElements, store, t }
    },
}
</script>

<style></style>

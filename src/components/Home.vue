<template>
    <div class="flex-1 flex items-stretch overflow-hidden">
        <main class="flex-1 overflow-y-auto p-3">
            <h1>
                {{ t('welcome') }}
                <strong>{{ store.state.users.user.name }}</strong>
            </h1>
            <div class="grid grid-cols-3 grid-flow-row gap-4 mt-5">
                <dashboard-tile
                    v-for="menuElement in menuElements"
                    :key="'element_name_' + menuElement.name"
                    class="w-full"
                    :title="menuElement.name"
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
} from '@heroicons/vue/outline'

export default {
    components: { DashboardTile },
    setup() {
        const store = useStore()
        const { t } = useI18n()

        const menuElements = [
            {
                name: t('surveys', 2),
                href: '/surveys',
                icon: PresentationChartLineIcon,
            },
            {
                name: t('elements', 2),
                href: '/survey-elements',
                icon: ViewGridIcon,
            },
            {
                name: t('assets', 2),
                href: '/assets',
                icon: PhotographIcon,
            },
            {
                name: t('languages', 2),
                href: '/languages',
                icon: GlobeAltIcon,
            },
            {
                name: t('users', 2),
                href: '/users',
                icon: UsersIcon,
            },
            {
                name: t('stats', 2),
                href: '/stats',
                icon: ChartBarIcon,
            },
        ]
        return { menuElements, store, t }
    },
}
</script>

<style></style>

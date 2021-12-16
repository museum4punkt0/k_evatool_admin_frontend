<template>
    <div
        class="border shadow rounded-lg p-3 bg-white pointer flex flex-col items-center justify-around"
        @click="goToRoute"
    >
        <component :is="icon" class="text-black h-12 w-12" aria-hidden="true" />
        <h2 class="text-center">
            {{ title }}
        </h2>
    </div>
</template>

<script>
import {
    ChartBarIcon,
    HomeIcon,
    PhotographIcon,
    ViewGridIcon,
    PresentationChartLineIcon,
    UsersIcon,
    GlobeAltIcon,
} from '@heroicons/vue/outline'

import { useRouter } from 'vue-router'

export default {
    name: 'DashboardTile',
    components: {
        ChartBarIcon,
        HomeIcon,
        PhotographIcon,
        ViewGridIcon,
        PresentationChartLineIcon,
        UsersIcon,
        GlobeAltIcon,
    },
    props: {
        icon: {
            type: String,
            default: '',
        },
        title: {
            type: String,
            default: '',
        },
        route: {
            type: String,
            default: '/',
        },
    },
    setup(props) {
        const router = useRouter()
        const goToRoute = () => {
            router.push(props.route)
        }
        return {
            goToRoute,
        }
    },
}
</script>

<style scoped></style>

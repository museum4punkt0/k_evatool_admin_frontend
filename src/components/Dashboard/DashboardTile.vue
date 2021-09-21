<template>
    <div
        class="border shadow rounded-lg p-3 bg-white pointer"
        @click="goToRoute"
    >
        <h2>
            {{ title }}
        </h2>
    </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
    name: 'DashboardTile',
    props: {
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

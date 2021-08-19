<template>
    <h2>Survey</h2>
    id: {{ id }}
    <Button>
        <router-link :to="{ name: 'surveySteps', params: { id } }">
            steps
        </router-link>
    </Button>

    <router-view></router-view>
</template>

<script>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
import Button from '../Button'

export default {
    components: {
        Button,
    },
    setup(props) {
        const id = ref()

        const route = useRoute()
        onBeforeRouteUpdate(async (to, from) => {
            console.log('before route update')
            if (to.params.id !== from.params.id) {
                console.log('param changed on update', to.params.id)
                //     TODO: fetch survey with id
            }
        })
        id.value = route.params.id
        watch(
            () => route.params.id,
            (newId) => {
                id.value = newId
                //     TODO: fetch survey with id
            },
        )
        return {
            id,
        }
    },
}
</script>

<style></style>

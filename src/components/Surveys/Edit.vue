<template>
    <Record
        v-if="selectedSurvey"
        :data="selectedSurvey"
        :title-selector="selectors.title"
        :on-delete="handlers.onDelete"
    >
        <ul>
            <li>
                <input v-model.lazy="selectedSurvey.name" @change="update" />
            </li>
            <li>
                <input
                    v-model.lazy="selectedSurvey.description"
                    @change="update"
                />
            </li>
        </ul>
        <router-view></router-view>
    </Record>
</template>

<script>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
import { createNamespacedHelpers } from 'vuex-composition-helpers'
import Record from '../Common/Record.vue'

const { useState, useActions } = createNamespacedHelpers('surveys')
const { useActions: useNotificationsActions } =
    createNamespacedHelpers('notifications')

export default {
    components: {
        Record,
    },
    setup(props) {
        const id = ref()
        const route = useRoute()
        const router = useRouter()
        const { selectedSurvey } = useState(['selectedSurvey'])
        const {
            getOneSelectAndUpdateStore,
            updateOneSelectAndUpdateStore,
            deleteOneSelectAndUpdateStore,
        } = useActions([
            'getOneSelectAndUpdateStore',
            'updateOneSelectAndUpdateStore',
            'deleteOneSelectAndUpdateStore',
        ])
        const { addError } = useNotificationsActions(['addError'])

        const update = () => {
            updateOneSelectAndUpdateStore({
                id: selectedSurvey.value.id,
                data: selectedSurvey.value,
            })
        }

        onBeforeRouteUpdate(async (to, from) => {
            if (to.params.id !== from.params.id && to.params.id) {
                id.value = to.params.id
                getOneSelectAndUpdateStore(id.value)
            }
        })
        watch(
            () => route.params.id,
            (newId) => {
                id.value = newId
                if (id.value) {
                    getOneSelectAndUpdateStore({ id: newId })
                }
            },
        )
        id.value = route.params.id
        if (id.value) {
            getOneSelectAndUpdateStore({ id: id.value })
        }
        return {
            id,
            selectedSurvey,
            selectors: {
                title: (item) => item.name,
            },
            handlers: {
                onDelete: (item) => {
                    deleteOneSelectAndUpdateStore(item)
                        .then((value) => {
                            router.push({
                                name: 'surveys',
                            })
                        })
                        .catch((error) => {
                            addError({ message: error })
                        })
                },
            },
            update,
        }
    },
}
</script>

<style></style>

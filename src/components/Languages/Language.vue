<template>
    <Record
        v-if="selectedLanguage"
        :data="selectedLanguage"
        :title-selector="selectors.title"
        :on-delete="handlers.onDelete"
    ></Record>
</template>

<script>
import { createNamespacedHelpers } from 'vuex-composition-helpers'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
import Record from '../Record/Record.vue'

const { useState, useActions } = createNamespacedHelpers('languages')

export default {
    components: {
        Record,
    },
    setup(props) {
        const id = ref()
        const route = useRoute()
        const { selectedLanguage } = useState(['selectedLanguage'])
        const {
            selectOneAndUpdateStore,
            updateSelectedAndUpdateStore,
            deleteSelectedAndUpdateStore,
        } = useActions([
            'selectOneAndUpdateStore',
            'updateSelectedAndUpdateStore',
            'deleteSelectedAndUpdateStore',
        ])

        id.value = route.params.id
        selectOneAndUpdateStore({ id: id.value })

        onBeforeRouteUpdate(async (to, from) => {
            if (to.params.id !== from.params.id) {
                id.value = to.params.id
                selectOneAndUpdateStore({ id: to.params.id })
            }
        })
        watch(
            () => route.params.id,
            (newId) => {
                id.value = newId
                selectOneAndUpdateStore({ id: newId })
            },
        )
        return {
            id,
            selectedLanguage,
            //     update,
            selectors: {
                title: (item) => item.title,
            },
            handlers: {
                onDelete: () => {
                    deleteSelectedAndUpdateStore()
                },
            },
        }
    },
}
</script>

<style></style>

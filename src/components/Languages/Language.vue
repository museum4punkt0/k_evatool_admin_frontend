<template>
    <Record
        v-if="selectedLanguage"
        :data="selectedLanguage"
        :title-selector="selectors.title"
        :on-delete="handlers.onDelete"
    >
        <ul>
            <li>
                <input
                    v-model.lazy="selectedLanguage.code"
                    @change="handlers.onUpdate"
                />
            </li>
            <li>
                <input
                    v-model.lazy="selectedLanguage.sub_code"
                    @change="handlers.onUpdate"
                />
            </li>
            <li>
                <input
                    v-model.lazy="selectedLanguage.title"
                    @change="handlers.onUpdate"
                />
            </li>
            <li>
                <input
                    v-model="selectedLanguage.default"
                    type="checkbox"
                    @change="handlers.onUpdate"
                />
            </li>
            <li>
                <input
                    v-model="selectedLanguage.published"
                    type="checkbox"
                    @change="handlers.onUpdate"
                />
            </li>
        </ul>
    </Record>
</template>

<script>
import { createNamespacedHelpers } from 'vuex-composition-helpers'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
import Record from '../Common/Record.vue'

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
            updateOneSelectAndUpdateStore,
            deleteSelectedAndUpdateStore,
        } = useActions([
            'selectOneAndUpdateStore',
            'updateOneSelectAndUpdateStore',
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
                onUpdate: () => {
                    updateOneSelectAndUpdateStore({
                        id: selectedLanguage.value.id,
                        data: selectedLanguage.value,
                    })
                },
                onDelete: () => {
                    deleteSelectedAndUpdateStore()
                },
            },
        }
    },
}
</script>

<style></style>

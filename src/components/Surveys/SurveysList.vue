<template>
    <div class="flex flex-col my-5 px-3">
        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div
                class="
                    py-2
                    align-middle
                    inline-block
                    min-w-full
                    sm:px-6
                    lg:px-8
                "
            >
                <div
                    class="
                        shadow
                        overflow-hidden
                        border-b border-gray-200
                        sm:rounded-lg
                    "
                >
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-blue-500">
                            <tr>
                                <th
                                    scope="col"
                                    class="
                                        px-6
                                        py-3
                                        text-left text-xs
                                        font-medium
                                        text-white
                                        uppercase
                                    "
                                >
                                    ID
                                </th>
                                <th
                                    scope="col"
                                    class="
                                        px-6
                                        py-3
                                        text-left text-xs
                                        font-medium
                                        text-white
                                        uppercase
                                        tracking-wider
                                    "
                                >
                                    Title
                                </th>
                                <th
                                    scope="col"
                                    class="
                                        px-6
                                        py-3
                                        text-left text-xs
                                        font-medium
                                        text-white
                                        uppercase
                                        tracking-wider
                                    "
                                >
                                    Status
                                </th>
                                <th
                                    scope="col"
                                    class="
                                        px-6
                                        py-3
                                        text-left text-xs
                                        font-medium
                                        text-white
                                        uppercase
                                        tracking-wider
                                    "
                                >
                                    Steps
                                </th>
                                <th scope="col" class="relative px-6 py-3">
                                    <span class="sr-only">Edit</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody
                            v-for="survey in surveys"
                            :key="'survey_row_' + survey.id"
                            class="bg-white divide-y divide-gray-200"
                        >
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center text-2xl">
                                        {{ survey.id }}
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="text-sm text-gray-900">
                                        {{ survey.name }}
                                    </div>
                                    <div class="text-sm text-gray-500">
                                        {{ survey.description }}
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span
                                        :class="
                                            survey.published
                                                ? ' bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        "
                                        class="
                                            px-2
                                            inline-flex
                                            text-xs
                                            leading-5
                                            font-semibold
                                            rounded-full
                                        "
                                    >
                                        {{
                                            survey.published
                                                ? 'Published'
                                                : 'Unpublished'
                                        }}
                                    </span>
                                </td>
                                <td
                                    class="
                                        px-6
                                        py-4
                                        whitespace-nowrap
                                        text-sm text-gray-500
                                    "
                                >
                                    {{ survey.surveyStepsCount }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <EyeIcon
                                        class="mx-1 h-5 w-5"
                                        @click="handlers.onView(survey)"
                                    />
                                    <PencilAltIcon
                                        class="mx-1 h-5 w-5"
                                        @click="handlers.onEdit(survey)"
                                    />
                                    <TrashIcon
                                        class="mx-1 h-5 w-5"
                                        @click="handlers.onDelete(survey)"
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <!--    <Collection
        :title="$t('survey')"
        :items="surveys"
        :text-filter="textFilter"
        :item-title-selector="selectors.itemTitle"
        :on-refresh="handlers.onRefresh"
        :on-new="handlers.onNew"
        :on-view="handlers.onView"
        :on-edit="handlers.onEdit"
        :on-delete="handlers.onDelete"
    ></Collection>-->
</template>

<script>
import { TrashIcon, PencilAltIcon, EyeIcon } from '@heroicons/vue/outline'
import { useRouter } from 'vue-router'
import { createNamespacedHelpers } from 'vuex-composition-helpers'
import Collection from '../Common/Collection/Collection.vue'

const { useState, useActions } = createNamespacedHelpers('surveys')
const { useActions: useNotificationsActions } =
    createNamespacedHelpers('notifications')

export default {
    name: 'SurveysList',
    components: {
        Collection,
        TrashIcon,
        EyeIcon,
        PencilAltIcon,
    },
    setup() {
        const router = useRouter()
        const { surveys } = useState(['surveys'])
        const { getAllAndUpdateStore, deleteOneAndUpdateStore } = useActions([
            'getAllAndUpdateStore',
            'deleteOneAndUpdateStore',
        ])
        const { addError } = useNotificationsActions(['addError'])
        const onView = (items) => {
            if (Array.isArray(items)) {
                items.forEach((item) => {
                    router.push({
                        name: 'survey',
                        params: { id: item.id },
                    })
                })
            } else if (typeof items === 'object') {
                router.push({
                    name: 'survey/view',
                    params: { id: items.id },
                })
            }
        }
        const onEdit = (items) => {
            if (Array.isArray(items)) {
                items.forEach((item) => {
                    router.push({
                        name: 'survey/edit',
                        params: { id: item.id },
                    })
                })
            } else if (typeof items === 'object') {
                router.push({
                    name: 'survey/edit',
                    params: { id: items.id },
                })
            }
        }
        const onDelete = (items) => {
            if (Array.isArray(items)) {
                items.forEach((item) => {
                    deleteOneAndUpdateStore(item).catch((error) =>
                        addError({ message: error }),
                    )
                })
            } else if (typeof items === 'object') {
                deleteOneAndUpdateStore(items).catch((error) =>
                    addError({ message: error }),
                )
            }
        }

        getAllAndUpdateStore()
        return {
            surveys,
            textFilter: (item, text) =>
                item.name.toLowerCase().includes(text.toLowerCase()),
            selectors: {
                itemTitle: (item) => item.name,
            },
            handlers: {
                onRefresh: getAllAndUpdateStore,
                onNew: () => {
                    console.log('on new')
                    return router.push({
                        name: 'surveys/new',
                    })
                },
                onView,
                onEdit,
                onDelete,
            },
        }
    },
}
</script>

<style></style>

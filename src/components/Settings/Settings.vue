<template>
    <div class="flex flex-grow overflow-hidden">
        <main class="flex h-full w-full flex-col p-3">
            <div class="flex flex-row justify-between mb-3">
                <h1 class="mb-3">
                    {{ settings.length }}
                    {{ t('survey_settings', settings.length) }}
                </h1>
                <button class="btn-primary" @click="newSetting">
                    {{ t('action_new') }}
                </button>
            </div>
            <div v-if="settings.length > 0" class="table-wrap">
                <table class="table-fixed">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th># {{ t('surveys', 2) }}</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="setting in settings"
                            :key="'setting_' + setting.id"
                        >
                            <td>{{ setting.id }}</td>
                            <td>{{ setting.name }}</td>
                            <td>{{ setting.surveyCount }}</td>
                            <td class="px-6 py-4 flex flex-row">
                                <PencilAltIcon
                                    class="mx-1 h-5 w-5 pointer"
                                    @click.prevent.stop="
                                        editSetting(setting.id)
                                    "
                                />
                                <TrashIcon
                                    v-if="setting.surveyCount === 0"
                                    class="mx-1 h-5 w-5 pointer"
                                    @click.prevent.stop="
                                        deleteSetting(setting.id)
                                    "
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </main>
    </div>
</template>

<script>
import PublishedState from '../Common/PublishedState.vue'
import { CheckIcon, PencilAltIcon, TrashIcon } from '@heroicons/vue/outline'
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

export default {
    components: {
        PublishedState,
        CheckIcon,
        PencilAltIcon,
        TrashIcon,
    },
    setup() {
        const store = useStore()
        const router = useRouter()
        const { t } = useI18n()

        store.dispatch('surveySettings/getSettings')

        const settings = computed({
            get: () => store.state.surveySettings.settings,
        })

        const editSetting = (settingId) => {
            router.push('/settings/' + settingId)
        }

        const deleteSetting = async (settingId) => {
            const confirmDelete = confirm(t('confirm_delete_setting'))
            if (confirmDelete) {
                await store.dispatch('surveySettings/deleteSetting', settingId)
                await store.dispatch('surveySettings/getSettings')
            }
        }

        const newSetting = () => {
            router.push('/settings/0')
        }

        return {
            settings,
            store,
            t,
            editSetting,
            deleteSetting,
            newSetting,
        }
    },
}
</script>

<style></style>

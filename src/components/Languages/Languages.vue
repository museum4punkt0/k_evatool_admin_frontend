<template>
    <div class="flex flex-grow overflow-hidden">
        <main class="flex h-full w-full flex-col p-3">
            <div class="flex flex-row justify-between">
                <h1 class="mb-3">
                    {{ languages.length }}
                    {{ t('languages', languages.length) }}
                </h1>
                <button class="btn-primary">
                    {{ t('action_add_language') }}
                </button>
            </div>
            <div class="table-wrap">
                <table class="table-fixed">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Code</th>
                            <th>Subcode</th>
                            <th>{{ $t('language_default') }}</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="language in languages"
                            :key="'language_' + language.id"
                        >
                            <td>{{ language.id }}</td>
                            <td>{{ language.code }}</td>
                            <td>{{ language.subCode }}</td>
                            <td class="text-center">
                                <CheckIcon
                                    v-if="language.default"
                                    class="h-5 w-5"
                                />
                            </td>
                            <td>
                                <published-state
                                    :published="language.published"
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
import { CheckIcon } from '@heroicons/vue/outline'
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

export default {
    components: {
        PublishedState,
        CheckIcon,
    },
    setup() {
        const store = useStore()
        const { t } = useI18n()

        const languages = computed({
            get: () => store.state.languages.languages,
        })

        return {
            languages,
            store,
            t,
        }
    },
}
</script>

<style></style>

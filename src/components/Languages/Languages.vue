<template>
    <div class="flex-1 flex items-stretch overflow-hidden">
        <main class="flex-1 overflow-y-auto p-3">
            <h1 class="mb-3">
                {{ languages.length }} {{ t('languages', languages.length) }}
            </h1>
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
                        <tr v-for="language in languages" :key="language.id">
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
import Collection from '../Common/Collection/Collection.vue'
import PublishedState from '../Common/PublishedState.vue'
import { CheckIcon } from '@heroicons/vue/outline'
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

export default {
    components: {
        PublishedState,
        Collection,
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

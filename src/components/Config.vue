<template>
    <div class="flex flex-grow overflow-hidden">
        <main class="flex h-full w-full flex-col p-3">
            <div class="flex flex-row justify-between">
                <h1>
                    {{ t('config') }}
                </h1>
                <div class="flex-1 flex flex-row justify-end"></div>
            </div>

            <div class="table-wrap mt-3">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr></tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200"></tbody>
                </table>
            </div>
        </main>
    </div>
</template>

<script>
import FormInput from './Forms/FormInput.vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import TinyMce from '../components/Common/TinyMce.vue'

export default {
    name: 'Login',
    components: { FormInput, TinyMce },
    setup() {
        const { t } = useI18n()
        const store = useStore()

        return { store, t }
    },
}
</script>

<style scoped></style>

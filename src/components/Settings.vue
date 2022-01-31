<template>
    <div class="flex flex-grow overflow-auto">
        <main class="flex h-full w-full flex-col p-3">
            <div class="flex flex-row justify-between">
                <h1>
                    {{ t('config') }}
                </h1>
                <div class="flex-1 flex flex-row justify-end"></div>
            </div>
            {{ validation }}
            invalid: {{ validation.$invalid }}
            <template v-for="language in Object.keys(data)" :key="language">
                <form v-if="selectedLanguage.code === language" @submit.prevent>
                    <form-input
                        v-model:value="data[language].companyName"
                        :label="t('company_name', 1)"
                    />
                    <tiny-mce
                        v-model:text="data[language].imprint"
                        :label="t('imprint', 1)"
                    />

                    <form-input
                        v-model:value="data[language].imprintLink"
                        :label="t('imprint_link', 1)"
                    />

                    <tiny-mce
                        v-model:text="data[language].privacy"
                        :label="t('privacy', 1)"
                    />

                    <form-input
                        v-model:value="data[language].privacyLink"
                        :label="t('privacy_link', 1)"
                    />

                    <tiny-mce
                        v-model:text="data[language].surveySocialDescription"
                        :label="t('survey_social_description', 1)"
                    />
                </form>
            </template>

            <ul>
                <li>logo_image (asset)</li>
                <li>
                    icon_image (für favicon, etc.) - mind. 1024x1024 (asset)
                </li>
                <li>background_image (asset)</li>
            </ul>

            <div class="flex flex-row mt-8 mb-4">
                <button class="secondary mr-3">
                    {{ t('action_cancel') }}
                </button>
                <button
                    class="primary flex-1"
                    :disabled="validation.$invalid"
                    @click="saveUser"
                >
                    {{ t('action_save') }}
                </button>
            </div>
        </main>
    </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { useStore } from 'vuex'
import useVuelidate from '@vuelidate/core'
import { required, url } from '@vuelidate/validators'
import TinyMce from './Common/TinyMce.vue'
import FormInput from './Forms/FormInput.vue'

const config = {
    de: {
        imprint: '',
        imprintLink: '',
        privacy: '',
        privacyLink: '',
        logoImage: null,
        logoAsset: null,
        companyName: '',
        backgroundImage: null,
        surveySocialDescription: '',
    },
    en: {
        imprint: '',
        imprintLink: '',
        privacy: '',
        privacyLink: '',
        logoImage: null,
        logoAsset: null,
        companyName: '',
        backgroundImage: null,
        surveySocialDescription: '',
    },
}

export default {
    name: 'Login',
    components: { FormInput, TinyMce },
    setup() {
        const { t } = useI18n()
        const store = useStore()
        const data = ref({ ...config })
        const selectedLanguage = ref(store.state.languages.maintainLanguage)

        const rules = {}
        Object.keys(data).forEach(
            (language) =>
                (rules[language] = {
                    imprint: {
                        required,
                    },
                }),
        )
        console.log(rules)
        const validation = useVuelidate(rules, data.value)

        return { store, t, data, validation, selectedLanguage }
    },
}
</script>

<style scoped></style>

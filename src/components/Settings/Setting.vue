<template>
    <div class="flex flex-grow overflow-auto">
        <main v-if="setting" class="flex h-full w-full flex-col p-3">
            <div class="flex flex-row justify-between">
                <h1>
                    {{ t('survey_settings', 1) }}
                </h1>
                <div class="flex-1 flex flex-row justify-end"></div>
            </div>
            <!--            {{ validation }}-->
            <!--            invalid: {{ validation.$invalid }}-->

            <!--            {{ setting }}-->

            <form-input v-model:value="setting.name" name="name" />

            <hr class="mt-5 my-4" />
            <language-switch-small />

            <template
                v-for="language in Object.keys(setting.setting)"
                :key="language"
            >
                <form v-if="selectedLanguage.code === language" @submit.prevent>
                    <form-input
                        v-model:value="setting.setting[language].companyName"
                        class="mb-4"
                        :label="t('settings_company_name')"
                        name="companyName"
                    />
                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <tiny-mce
                                v-model:text="setting.setting[language].imprint"
                                :label="t('settings_imprint')"
                            />

                            <form-input
                                v-model:value="
                                    setting.setting[language].imprintLink
                                "
                                class="mt-4"
                                :label="t('settings_imprint_url')"
                                name="imprintLink"
                            />
                        </div>

                        <div>
                            <tiny-mce
                                v-model:text="setting.setting[language].privacy"
                                :label="t('settings_privacy')"
                            />

                            <form-input
                                v-model:value="
                                    setting.setting[language].privacyLink
                                "
                                class="mt-4"
                                :label="t('settings_privacy_url')"
                                name="privacyLink"
                            />
                        </div>
                    </div>
                    <tiny-mce
                        v-model:text="
                            setting.setting[language].surveySocialDescription
                        "
                        :label="t('settings_social_description')"
                    />
                </form>
            </template>

            <!--            <ul>
          <li>logo_image (asset)</li>
          <li>
              icon_image (für favicon, etc.) - mind. 1024x1024 (asset)
          </li>
          <li>background_image (asset)</li>
      </ul>-->

            <div class="flex flex-row mt-8 mb-4">
                <button class="secondary mr-3">
                    {{ t('action_cancel') }}
                </button>
                <button
                    class="primary flex-1"
                    :disabled="validation.$invalid"
                    @click="saveSetting"
                >
                    {{ t('action_save') }}
                </button>
            </div>
        </main>
        <aside class="text-xs">
            <pre>{{ setting }}</pre>
        </aside>
    </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import TinyMce from '../Common/TinyMce.vue'
import FormInput from '../Forms/FormInput.vue'
import { useRoute } from 'vue-router'
import settingsService from '../../services/settingsService'
import LanguageSwitchSmall from '../Languages/LanguageSwitchSmall.vue'

export default {
    name: 'Login',
    components: { LanguageSwitchSmall, FormInput, TinyMce },
    setup() {
        const { t } = useI18n()
        const store = useStore()
        const route = useRoute()

        const config = computed({
            get: () => {
                const configByLanguage = []
                store.state.languages.languages.forEach((language) => {
                    configByLanguage[language.code] = {
                        imprint: '',
                        imprintLink: '',
                        privacy: '',
                        privacyLink: '',
                        logoImage: null,
                        logoAsset: null,
                        companyName: '',
                        backgroundImage: null,
                        surveySocialDescription: '',
                    }
                })
                return configByLanguage
            },
        })

        const settingId = route.params.setting_id
        const setting = ref(null)

        const getSetting = async () => {
            if (settingId > 0) {
                setting.value = await settingsService.getSetting(settingId)
            } else {
                setting.value = { name: '', setting: { ...config.value } }
            }
        }

        getSetting()

        const selectedLanguage = computed({
            get: () => store.state.languages.maintainLanguage,
        })

        const rules = {}
        Object.keys(setting.value.setting).forEach(
            (language) =>
                (rules[language] = {
                    imprint: {
                        required,
                    },
                }),
        )
        // console.log(rules)
        const validation = useVuelidate(rules, setting.value.setting)

        const saveSetting = async () => {
            const savedSetting = await store.dispatch(
                'surveySettings/saveSetting',
                setting.value,
            )
            console.log(savedSetting)
        }

        return {
            store,
            t,
            validation,
            selectedLanguage,
            settingId,
            setting,
            saveSetting,
        }
    },
}
</script>

<style scoped></style>

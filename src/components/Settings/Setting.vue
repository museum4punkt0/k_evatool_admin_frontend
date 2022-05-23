<template>
    <div class="flex flex-grow overflow-auto">
        <main v-if="setting" class="flex w-full flex-col p-3">
            <div class="flex flex-row justify-between">
                <h1>
                    {{ t('survey_settings', 1) }}
                </h1>

                <div class="flex flex-row">
                    <button
                        class="secondary mr-3"
                        @click="$router.push('/settings')"
                    >
                        {{ t('action_cancel') }}
                    </button>
                    <button
                        class="primary flex-1"
                        :disabled="validation.$invalid || isSaving"
                        @click="saveSetting"
                    >
                        {{ t('action_save') }}
                    </button>
                </div>
            </div>

            <!--            {{ validation }}-->
            <!--            invalid: -{{ validation.$invalid }}- -->
            <!--            {{ language }}-->

            <form-input
                v-model:value="setting.name"
                class="mt-3"
                name="name"
                :label="t('names', 1)"
            />
            <template v-if="settingId > 0 && setting.setting">
                <hr class="mt-5 my-4" />
                <language-switch-small />

                <div
                    v-if="
                        setting.setting.companyName && setting.setting.pageTitle
                    "
                    class="grid grid-cols-2 gap-4 mb-4"
                >
                    <form-input
                        v-model:value="setting.setting.companyName[language]"
                        class="mb-4"
                        :label="t('settings_company_name')"
                        name="companyName"
                    />

                    <form-input
                        v-model:value="setting.setting.pageTitle[language]"
                        class="mb-4"
                        :label="t('settings_page_title')"
                        name="pageTitle"
                    />
                </div>

                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div v-if="setting.setting.imprint">
                        <tiny-mce
                            v-model:text="setting.setting.imprint[language]"
                            :label="t('settings_imprint')"
                        />

                        <form-input
                            v-model:value="setting.setting.imprintLink"
                            class="mt-4"
                            :label="t('settings_imprint_url')"
                            name="imprintLink"
                        />
                    </div>

                    <div v-if="setting.setting.privacy">
                        <tiny-mce
                            v-model:text="setting.setting.privacy[language]"
                            :label="t('settings_privacy')"
                        />

                        <form-input
                            v-model:value="setting.setting.privacyLink"
                            class="mt-4"
                            :label="t('settings_privacy_url')"
                            name="privacyLink"
                        />
                    </div>
                </div>

                <div class="grid grid-cols-3 gap-4 mb-4">
                    <div>
                        <h3>Logo</h3>
                        <template v-if="setting?.setting?.logoImageUrl">
                            <img :src="setting.setting.logoImageUrl" />
                            <button
                                class="btn-danger mt-2"
                                @click="removeImage('logo')"
                            >
                                {{ t('action_delete') }}
                            </button>
                        </template>
                        <uploader
                            v-else
                            type="settingAsset"
                            :meta="logoMetaPayload"
                            :endpoint="uploaderEndpoint"
                            :max-files="1"
                            :mime-type="['image/*']"
                            :min-width="100"
                            :max-width="400"
                            :min-height="100"
                            :max-height="400"
                            @success="refreshSetting"
                        />
                    </div>
                    <div>
                        <h3>Icon</h3>
                        <template v-if="setting?.setting?.iconImageUrl">
                            <img
                                v-if="setting?.setting?.iconImageUrl"
                                :src="setting.setting.iconImageUrl"
                            />
                            <button
                                class="btn-danger mt-2"
                                @click="removeImage('icon')"
                            >
                                {{ t('action_delete') }}
                            </button>
                        </template>
                        <uploader
                            v-else
                            type="settingAsset"
                            :meta="iconMetaPayload"
                            :endpoint="uploaderEndpoint"
                            :max-files="1"
                            :min-width="256"
                            :max-width="1024"
                            :min-height="256"
                            :max-height="1024"
                            :ratio="1"
                            :mime-type="['image/*']"
                            @success="refreshSetting"
                        />
                    </div>
                    <div>
                        <h3>Background</h3>
                        <template v-if="setting?.setting?.backgroundImageUrl">
                            <img
                                v-if="setting?.setting?.backgroundImageUrl"
                                :src="setting.setting.backgroundImageUrl"
                            />
                            <button
                                class="btn-danger mt-2"
                                @click="removeImage('background')"
                            >
                                {{ t('action_delete') }}
                            </button>
                        </template>
                        <uploader
                            v-else
                            type="settingAsset"
                            :meta="backgroundMetaPayload"
                            :endpoint="uploaderEndpoint"
                            :max-files="1"
                            :min-width="1920"
                            :max-width="3840"
                            :min-height="1080"
                            :max-height="2160"
                            :mime-type="['image/*']"
                            @success="refreshSetting"
                        />
                    </div>
                </div>
                <div
                    v-if="setting.setting.surveySocialDescription"
                    class="pb-5"
                >
                    <tiny-mce
                        v-model:text="
                            setting.setting.surveySocialDescription[language]
                        "
                        :label="t('settings_social_description')"
                    />
                </div>
            </template>
        </main>
        <aside class="text-xs">
            <pre
                v-if="store.state.users?.user?.role.includes('admin')"
                class="mt-6"
                >{{ savedSetting }}</pre
            >
        </aside>
    </div>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import useVuelidate from '@vuelidate/core'
import { minLength, maxLength, required } from '@vuelidate/validators'
import TinyMce from '../Common/TinyMce.vue'
import FormInput from '../Forms/FormInput.vue'
import { useRoute, useRouter } from 'vue-router'
import settingsService from '../../services/settingsService'
import LanguageSwitchSmall from '../Languages/LanguageSwitchSmall.vue'
import Uploader from '../Forms/Uploader.vue'
import _ from 'lodash'

export default {
    name: 'Setting',
    components: {
        Uploader,
        LanguageSwitchSmall,
        FormInput,
        TinyMce,
    },
    setup() {
        const { t } = useI18n()
        const store = useStore()
        const route = useRoute()
        const router = useRouter()

        const isSaving = ref(false)

        const settingId = ref(route.params.setting_id)
        const setting = ref(null)
        const savedSetting = ref(null)

        const languages = store.state.languages.languages
        const emptyLanguageObject = {}
        languages.map((lang) => {
            emptyLanguageObject[lang.code] = 'k:eva'
        })

        const getLanguageBasedKeys = () => {
            return {
                companyName: { ...emptyLanguageObject },
                pageTitle: { ...emptyLanguageObject },
                imprint: { ...emptyLanguageObject },
                privacy: { ...emptyLanguageObject },
                surveySocialDescription: { ...emptyLanguageObject },
            }
        }

        const getNeutralKeys = () => {
            return {
                imprintLink: '',
                privacyLink: '',
                logoImage: null,
                iconImage: null,
                backgroundImage: null,
            }
        }

        const rules = computed({
            get: () => {
                return {
                    name: {
                        required,
                        minLength: minLength(3),
                        maxLength: maxLength(50),
                        $autoDirty: true,
                    },
                }
            },
        })

        const getSetting = async () => {
            if (settingId.value > 0) {
                setting.value = await settingsService.getSetting(
                    settingId.value,
                )

                savedSetting.value = _.cloneDeep(setting.value)

                // set language based default values
                const languageBasedKeys = getLanguageBasedKeys()
                Object.keys(languageBasedKeys).forEach((key) => {
                    if (!setting.value.setting[key]) {
                        setting.value.setting[key] = languageBasedKeys[key]
                    }
                    languages.forEach((lang) => {
                        if (!setting.value.setting[key][lang.code]) {
                            setting.value.setting[key][lang.code] = ''
                        }
                    })
                })

                // set neutral default values
                const neutralKeys = getNeutralKeys()
                Object.keys(neutralKeys).forEach((key) => {
                    if (!setting.value.setting[key]) {
                        setting.value.setting[key] = neutralKeys[key]
                    }
                })
            } else {
                setting.value = {
                    name: '',
                }
            }
        }

        getSetting()

        const selectedLanguage = computed({
            get: () => store.state.languages.maintainLanguage,
        })

        const language = computed({
            get: () => store.state.languages.maintainLanguage.code,
        })

        const saveSetting = async () => {
            isSaving.value = true

            const savedSetting = await store.dispatch(
                'surveySettings/saveSetting',
                setting.value,
            )

            if (savedSetting.id && parseInt(settingId.value) === 0) {
                settingId.value = savedSetting.id
                await router.push('/settings/' + savedSetting.id)
            }

            await getSetting()

            isSaving.value = false
        }

        // refresh setting data after successful asset upload
        const refreshSetting = () => {
            getSetting()
        }

        const removeImage = (imageType) => {
            const confirmImageDelete = confirm(t('confirm_delete_image'))
            if (confirmImageDelete) {
                setting.value.setting[imageType + 'Image'] = null
                setting.value.setting[imageType + 'ImageUrl'] = null
                saveSetting()
            }
        }

        const validation = useVuelidate(rules, setting)

        const logoMetaPayload = { subType: 'logo' }
        const iconMetaPayload = { subType: 'icon' }
        const backgroundMetaPayload = { subType: 'background' }

        const uploaderEndpoint = computed(
            () =>
                import.meta.env.VITE_API_BASE_URL_API +
                '/evaluation-tool/settings/' +
                settingId.value +
                '/settings-asset',
        )

        return {
            store,
            t,
            validation,
            selectedLanguage,
            settingId,
            setting,
            saveSetting,
            language,
            isSaving,
            savedSetting,
            logoMetaPayload,
            iconMetaPayload,
            backgroundMetaPayload,
            uploaderEndpoint,
            refreshSetting,
            removeImage,
        }
    },
}
</script>

<style scoped></style>

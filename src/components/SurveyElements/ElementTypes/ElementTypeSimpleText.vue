<template>
    <tiny-mce
        v-for="language in store.state.languages.languages.filter(
            (item) => item.code === selectedLanguage.code,
        )"
        :key="'lang' + language.id"
        v-model:text="paramsLocal.text[language.code]"
        :label="t('texts', 1)"
        :invalid="!v$.text?.validateLanguageLabel?.$response[language.code]"
    />

    <div>
        <img
            class="rounded w-1/6 mr-3 mt-3"
            :src="selectedAssetUrl"
            @click="setAssetSelectorModalOpen(true)"
        />
        <button class="primary mt-3" @click="setAssetSelectorModalOpen(true)">
            {{ t('button_choose_asset') }}
        </button>
    </div>

    <form-input
        v-model:value="paramsLocal.url"
        name="url"
        class="mt-3"
        :label="t('qr_code_url')"
    />

    <asset-selector-modal
        :is-open="assetSelectorModalOpen"
        :multiple-select="false"
        :selected-assets="paramsLocal?.assetId"
        name="assetId"
        mime-type-filter-prefix="image"
        @update:is-open="setAssetSelectorModalOpen"
        @update:selected-assets="onAssetsSelected"
    ></asset-selector-modal>
</template>

<script>
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { useState } from '@/composables/state'
import useVuelidate from '@vuelidate/core'
import _ from 'lodash'

import AssetSelectorModal from '@/components/Assets/AssetSelectorModal.vue'
import FormInput from '@/components/Forms/FormInput.vue'
import TinyMce from '@/components/Common/TinyMce.vue'

export default {
    name: 'ElementTypeSimpleText',
    components: { TinyMce, AssetSelectorModal, FormInput },
    props: {
        params: {
            type: Object,
            default: () => null,
        },
    },
    emits: ['update:params', 'isValid'],
    setup(props, { emit }) {
        const store = useStore()
        const { t } = useI18n()
        const paramsLocal = computed({
            get: () => props.params,
            set: (val) => emit('update:params', val),
        })

        const [assetSelectorModalOpen, setAssetSelectorModalOpen] =
            useState(false)

        const selectedLanguage = ref(store.state.languages.maintainLanguage)
        watch(
            () => store.state.languages.maintainLanguage,
            (value) => {
                selectedLanguage.value = value
            },
        )

        const selectedAssetUrl = computed(() => {
            return store.state.assets.assets.find(
                (item) => item.id === paramsLocal.value?.assetId,
            )?.urls.original
        })
        const validateLanguageLabel = (object) => {
            const newObject = Object.assign({}, object)
            for (const [key, value] of Object.entries(object)) {
                newObject[key] = !!value && value.length < 1500
            }
            return newObject
        }

        const validations = computed({
            get: () => {
                return {
                    text: {
                        validateLanguageLabel,
                    },
                }
            },
            set: (val) => emit('update:params', val),
        })

        const paramsValidation = useVuelidate(validations, paramsLocal, {
            $scope: 'surveyElement',
        })

        watch(
            () => _.cloneDeep(paramsLocal.value),
            (currentValue) => {
                let singleLangIsValid = false
                const counterLangCount = 1
                store.state.languages.languages.forEach((lang) => {
                    let currentCount = 0
                    if (currentValue.text[lang.code] !== '') {
                        currentCount++
                    }
                    if (parseInt(currentCount) === parseInt(counterLangCount)) {
                        singleLangIsValid = true
                    }
                })
                const isValid =
                    singleLangIsValid && !paramsValidation.value.$invalid
                emit('isValid', isValid)
            },
            { immediate: true },
        )

        const onAssetsSelected = (assets) => {
            assets
                ? (paramsLocal.value.assetId = assets)
                : delete paramsLocal.value.assetId

            emit('update:params', paramsLocal.value)
        }

        return {
            selectedLanguage,
            paramsLocal,
            store,
            t,
            v$: paramsValidation,
            assetSelectorModalOpen,
            setAssetSelectorModalOpen,
            onAssetsSelected,
            selectedAssetUrl,
        }
    },
}
</script>

<style scoped>
button.language {
    padding: 2px 8px;
}
</style>

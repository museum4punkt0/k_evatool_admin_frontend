<template>
    <language-switch
        class="mt-6"
        :active-language="selectedLanguage"
        @select="setSelectedLanguage($event)"
    />

    <tip-tap
        v-for="language in store.state.languages.languages.filter(
            (item) => item.code === selectedLanguage.code,
        )"
        :key="'lang' + language.id"
        :value="paramsLocal.question[language.code]"
        @update:value="onTipTapUpdate(language, $event)"
    ></tip-tap>

    <div class="grid grid-cols-12 gap-4">
        <form-input
            v-for="language in store.state.languages.languages.filter(
                (item) => item.code === selectedLanguage.code,
            )"
            :key="'lang' + language.id"
            v-model:value="paramsLocal.trueLabel[language.code]"
            :name="'lang' + language.id"
            class="mt-3 col-span-6"
            :label="t('yaynay_positive_label') + ' (' + language.title + ')'"
        />
        <form-input
            v-for="language in store.state.languages.languages.filter(
                (item) => item.code === selectedLanguage.code,
            )"
            :key="'lang' + language.id"
            v-model:value="paramsLocal.falseLabel[language.code]"
            :name="'lang' + language.id"
            class="mt-3 col-span-6"
            :label="t('yaynay_negative_label') + ' (' + language.title + ')'"
        />
    </div>

    <div class="grid grid-cols-12 gap-4">
        <form-input
            v-model:value="paramsLocal.trueValue"
            class="mt-3 col-span-6"
            :label="t('yaynay_positive')"
            name="trueValue"
        />
        <form-input
            v-model:value="paramsLocal.falseValue"
            class="mt-3 col-span-6"
            :label="t('yaynay_negative')"
            name="falseValue"
        />
    </div>
    <div class="grid grid-cols-6 gap-4 my-3">
        <img
            v-for="asset in paramsLocal.assets"
            :key="`asset-${asset}`"
            class="rounded"
            :src="assets.find((item) => item.id === asset)?.urls.original"
            @click="setAssetSelectorModalOpen(true)"
        />
    </div>
    <button class="primary" @click="setAssetSelectorModalOpen(true)">
        {{ t('button_choose_assets') }}
    </button>
    <asset-selector-modal
        :is-open="assetSelectorModalOpen"
        :selected-assets="paramsLocal.assets"
        mime-type-filter-prefix="image"
        @update:is-open="setAssetSelectorModalOpen"
        @update:selected-assets="onAssetsSelected"
    ></asset-selector-modal>
</template>

<script>
import FormInput from '../../Forms/FormInput.vue'
import LanguageSwitch from '../../Languages/LanguageSwitch.vue'
import TipTap from '../../../components/Common/TipTap.vue'

import { computed, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import useVuelidate from '@vuelidate/core'
import { useState } from '../../../composables/state'
import AssetSelectorModal from '../../Assets/AssetSelectorModal.vue'

import { helpers, maxLength, minLength, required } from '@vuelidate/validators'
const systemValueValidation = helpers.regex(/^[a-z0-9_]*$/)

export default {
    name: 'ElementTypeYayNayQuestion',
    components: { FormInput, LanguageSwitch, AssetSelectorModal, TipTap },
    props: {
        params: {
            type: Object,
            default: () => null,
        },
    },
    emits: ['update:params', 'update:params-valid', 'isValid'],
    setup(props, { emit }) {
        const store = useStore()
        const { t } = useI18n()
        const [assetSelectorModalOpen, setAssetSelectorModalOpen] =
            useState(false)
        const [selectedLanguage, setSelectedLanguage] = useState(
            store.state.languages.defaultLanguage,
        )

        const paramsLocal = computed({
            get: () => props.params,
            set: (val) => emit('update:params', val),
        })

        const assets = computed({
            get: () => store.state.assets.assets,
        })

        const questionValidation = {}
        store.state.languages.languages.forEach((language) => {
            questionValidation[language.code] = {
                required,
                minLength: minLength(1),
            }
        })

        const labelValidation = {}
        store.state.languages.languages.forEach((language) => {
            labelValidation[language.code] = {
                required,
                minLength: minLength(1),
            }
        })

        const validations = computed({
            get: () => {
                return {
                    params: {
                        trueValue: {
                            required,
                            minLength: minLength(1),
                            maxLength: maxLength(20),
                            systemValueValidation,
                        },
                        falseValue: {
                            required,
                            minLength: minLength(1),
                            maxLength: maxLength(20),
                            systemValueValidation,
                        },
                        question: questionValidation,
                        trueLabel: labelValidation,
                        falseLabel: labelValidation,
                    },
                }
            },
            set: (val) => emit('update:params', val),
        })

        const validateParams = useVuelidate(
            validations.value.params,
            paramsLocal.value,
            { $scope: 'surveyElement' },
        )

        watch(
            () => validateParams.value.$invalid,
            (invalid) => {
                emit('isValid', !invalid)
            },
        )

        const onAssetsSelected = (assets) => {
            paramsLocal.value.assets = assets
            emit('update:params', paramsLocal.value)
        }

        const onTipTapUpdate = (language, value) => {
            paramsLocal.value.question[language.code] = value
            emit('update:params', paramsLocal.value)
        }

        return {
            validateParams,
            store,
            paramsLocal,
            t,
            selectedLanguage,
            setSelectedLanguage,
            assetSelectorModalOpen,
            setAssetSelectorModalOpen,
            onAssetsSelected,
            assets,
            onTipTapUpdate,
        }
    },
}
</script>

<style scoped></style>

<template>
    <tiny-mce
        v-for="language in store.state.languages.languages.filter(
            (item) => item.code === selectedLanguage.code,
        )"
        :key="'lang' + language.id"
        v-model:text="paramsLocal.question[language.code]"
        :invalid="!v$.question?.validateLanguageLabel?.$response[language.code]"
        :label="t('questions', 1)"
        class="my-3"
    />
    <draggable
        v-if="paramsLocal.assetIds.length > 0"
        v-model="paramsLocal.assetIds"
        class="flex flex-row mt-8 mb-3 overflow-x-auto"
    >
        <template #item="{ element }">
            <img
                :key="`asset-${element}`"
                class="rounded w-1/6 mr-3"
                :src="assets.find((item) => item.id === element)?.urls.original"
                @click="setAssetSelectorModalOpen(true)"
            />
        </template>
    </draggable>
    <button class="primary mt-3" @click="setAssetSelectorModalOpen(true)">
        {{ t('button_choose_assets') }}
    </button>
    <p class="text-xs mt-2">{{ t('notice_same_ratio_and_orientation') }}</p>

    <div class="grid grid-cols-12 gap-4 mt-8">
        <form-input
            v-for="language in store.state.languages.languages.filter(
                (item) => item.code === selectedLanguage.code,
            )"
            :key="'lang' + language.id"
            v-model:value="paramsLocal.trueLabel[language.code]"
            language-switch
            :name="'lang' + language.id"
            class="mt-3 col-span-6"
            :label="t('yaynay_positive_label') + ' (' + language.title + ')'"
            :invalid="
                !v$.trueLabel.validateLanguageLabel.$response[language.code]
            "
        />
        <form-input
            v-for="language in store.state.languages.languages.filter(
                (item) => item.code === selectedLanguage.code,
            )"
            :key="'lang' + language.id"
            v-model:value="paramsLocal.falseLabel[language.code]"
            language-switch
            :name="'lang' + language.id"
            class="mt-3 col-span-6"
            :label="t('yaynay_negative_label') + ' (' + language.title + ')'"
            :invalid="
                !v$.falseLabel.validateLanguageLabel.$response[language.code]
            "
        />
    </div>

    <div class="grid grid-cols-12 gap-4">
        <form-input
            v-model:value="paramsLocal.trueValue"
            class="mt-3 col-span-6"
            :label="t('yaynay_positive')"
            name="trueValue"
            :invalid="v$.trueValue.$invalid"
        />
        <form-input
            v-model:value="paramsLocal.falseValue"
            class="mt-3 col-span-6"
            :label="t('yaynay_negative')"
            name="falseValue"
            :invalid="v$.falseValue.$invalid"
        />
    </div>

    <asset-selector-modal
        :is-open="assetSelectorModalOpen"
        :selected-assets="paramsLocal.assetIds"
        mime-type-filter-prefix="image"
        @update:is-open="setAssetSelectorModalOpen"
        @update:selected-assets="onAssetsSelected"
    ></asset-selector-modal>
</template>

<script>
import FormInput from '../../Forms/FormInput.vue'
import LanguageSwitch from '../../Languages/LanguageSwitch.vue'
import TinyMce from '../../../components/Common/TinyMce.vue'

import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import useVuelidate from '@vuelidate/core'
import { useState } from '../../../composables/state'
import AssetSelectorModal from '../../Assets/AssetSelectorModal.vue'

import { helpers, maxLength, minLength, required } from '@vuelidate/validators'
import draggable from 'vuedraggable'
import _ from 'lodash'

const systemValueValidation = helpers.regex(/^[a-z0-9_]*$/)

export default {
    name: 'ElementTypeYayNayQuestion',
    components: {
        TinyMce,
        FormInput,
        LanguageSwitch,
        AssetSelectorModal,
        draggable,
    },
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

        const selectedLanguage = ref(store.state.languages.maintainLanguage)
        watch(
            () => store.state.languages.maintainLanguage,
            (value) => {
                selectedLanguage.value = value
            },
        )

        const paramsLocal = computed({
            get: () => props.params,
            set: (val) => emit('update:params', val),
        })

        const assets = computed({
            get: () => store.state.assets.assets,
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
                    params: {
                        assetIds: {
                            required,
                        },
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
                        question: { validateLanguageLabel },
                        trueLabel: { validateLanguageLabel },
                        falseLabel: { validateLanguageLabel },
                    },
                }
            },
            set: (val) => emit('update:params', val),
        })

        const paramsValidation = useVuelidate(
            validations.value.params,
            paramsLocal.value,
            { $scope: 'surveyElement' },
        )

        watch(
            () => _.cloneDeep(paramsLocal.value),
            (currentValue) => {
                let singleLangIsValid = false
                const counterLangCount = 3
                store.state.languages.languages.forEach((lang) => {
                    let currentCount = 0
                    if (currentValue.question[lang.code] !== '') {
                        currentCount++
                    }
                    if (currentValue.falseLabel[lang.code] !== '') {
                        currentCount++
                    }
                    if (currentValue.trueLabel[lang.code] !== '') {
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
            paramsLocal.value.assetIds = assets
            emit('update:params', paramsLocal.value)
        }

        return {
            v$: paramsValidation,
            store,
            paramsLocal,
            t,
            selectedLanguage,
            assetSelectorModalOpen,
            setAssetSelectorModalOpen,
            onAssetsSelected,
            assets,
        }
    },
}
</script>

<style scoped>
button.language {
    padding: 2px 8px;
}
</style>

<template>
    <language-switch
        class="mt-6"
        :active-language="selectedLanguage"
        @select="setSelectedLanguage($event)"
    />

    <button
        v-for="language in store.state.languages.data"
        :key="'lang' + language.id"
        class="primary"
        :class="{ active: selectedLanguage.code === language.code }"
        @click="setSelectedLanguage(language)"
    >
        {{ language.code }}
    </button>

    <form-input
        v-for="language in store.state.languages.languages.filter(
            (item) => item.code === selectedLanguage.code,
        )"
        :key="'lang' + language.id"
        v-model:value="paramsLocal.question[language.code]"
        :name="'lang' + language.id"
        class="mt-3"
        :label="t('questions', 1) + ' (' + language.title + ')'"
    />

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
    <div class="">
        <button type="button" class="mt-3 primary" @click="openAssetSelector()">
            Medien Auswahl
        </button>
        Selected: {{ selectedAssets }}
        <asset-selector-modal
            v-model:selected-assets="selectedAssets"
            v-model:is-open="selectorModalIsOpen"
        ></asset-selector-modal>
        <table>
            <tr v-for="(asset, i) in selectedAssetsObject" :key="asset.id">
                <td class="text-lg">
                    {{ i }}
                </td>
                <td class="text-lg">
                    {{ asset.id }}
                </td>
                <td class="m-0 p-0">
                    <img
                        v-if="asset.urls.thumbnail"
                        class="max-h-8 max-w-16"
                        :alt="asset.filename"
                        :src="asset.urls.thumbnail"
                    />
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
import FormInput from '../../Forms/FormInput.vue'
import LanguageSwitch from '../../Languages/LanguageSwitch.vue'
import AssetSelectorModal from '../../Assets/AssetSelectorModal.vue'
import { computed, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import useVuelidate from '@vuelidate/core'
import { useState } from '../../../composables/state'

import { helpers, maxLength, minLength, required } from '@vuelidate/validators'

const systemValueValidation = helpers.regex(/^[a-z0-9_]*$/)

export default {
    name: 'ElementTypeYayNayQuestion',
    components: { FormInput, LanguageSwitch, AssetSelectorModal },
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
        const [selectedLanguage, setSelectedLanguage] = useState(
            store.state.languages.defaultLanguage,
        )

        const selectedAssets = ref()
        const selectorModalIsOpen = ref(false)
        const selectedAssetsObject = ref()

        const paramsLocal = computed({
            get: () => props.params,
            set: (val) => emit('update:params', val),
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

        const openAssetSelector = () => {
            selectorModalIsOpen.value = true
        }

        const getSelectedAssets = () => {
            selectedAssetsObject.value = store.state.assets.assets.filter(
                (x) => selectedAssets.value.indexOf(x.id) > -1,
            )
            console.log(selectedAssetsObject)
        }

        const test = () => {
            alert('a')
        }

        watch(
            () => validateParams.value.$invalid,
            (invalid) => {
                emit('isValid', !invalid)
            },
        )

        watch(
            () => selectorModalIsOpen.value,
            (value) => {
                console.log(value)
                getSelectedAssets()
            },
        )

        onMounted(() => {
            selectedAssets.value = paramsLocal.value.assets
            getSelectedAssets()
        })

        return {
            validateParams,
            store,
            paramsLocal,
            t,
            selectedLanguage,
            setSelectedLanguage,
            selectedAssets,
            selectorModalIsOpen,
            openAssetSelector,
            getSelectedAssets,
            test,
            selectedAssetsObject,
        }
    },
}
</script>

<style scoped></style>

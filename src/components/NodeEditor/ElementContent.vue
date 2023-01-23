<template>
    <div v-if="element" class="bg-gray-100">
        <div class="text-center text-sm py-1">
            {{ element.name }}
            <p class="w-full text-xs text-gray-500">
                {{
                    store.getters['elementTypes/getDisplayNameForKey'](
                        element.surveyElementType,
                    )
                }}
            </p>
        </div>
        <div class="text-center italic text-sm">
            <div
                v-if="element.surveyElementType === 'video' && assets"
                class="p-2"
            >
                <video class="rounded" controls>
                    <source
                        :src="
                            asset(element?.params?.videoAssetId).urls.original
                        "
                        :type="asset(element?.params?.videoAssetId).mime"
                    />
                </video>
            </div>
            <div
                v-else-if="
                    element.surveyElementType === 'simpleText' &&
                    element?.params?.text
                "
                v-tippy="tippyContent(element.params?.text)"
                v-html="shortenQuestion(element.params.text)"
            />
            <div
                v-else-if="element.params?.question !== null"
                v-tippy="tippyContent(element.params?.question)"
                v-html="shortenQuestion(element.params.question)"
            />
        </div>
        <missing-languages
            v-if="element.missingLanguages"
            specific-survey
            :missing-languages="element.missingLanguages"
        />
    </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import FormInput from '../Forms/FormInput.vue'
import SurveyElement from '../Surveys/SurveyElement.vue'
import MissingLanguages from '@/components/Common/MissingLanguages.vue'

export default {
    name: 'ElementContent',
    components: { MissingLanguages, FormInput, SurveyElement },
    props: { element: { type: Object, required: true } },
    setup() {
        const store = useStore()

        const showToolTip = ref(false)

        const surveyElements = computed(
            () => store.state.surveyElements.surveyElements,
        )
        const surveyElementTypes = computed(
            () => store.state.elementTypes.elementTypes,
        )
        const defaultLanguage = computed(
            () => store.state.languages.defaultLanguage,
        )
        const { t } = useI18n()

        const assets = computed({
            get: () => store.state.assets.assets,
        })

        const asset = (assetId) => {
            return assets.value.filter((x) => x.id === assetId)[0]
        }

        function htmlDecode(input) {
            const doc = new DOMParser().parseFromString(input, 'text/html')
            return doc.documentElement.textContent
        }

        function shortenQuestion(text) {
            const maxStringLength = 50
            const newString = htmlDecode(i18n(text))
            if (newString.length > maxStringLength) {
                showToolTip.value = true
                return newString.substring(0, maxStringLength) + '...'
            }
            return newString
        }

        function tippyContent(text) {
            if (showToolTip.value) {
                return i18n(text)
            }
            return null
        }

        function i18n(text) {
            if (store.state?.languageCode && text?.[store.state.languageCode]) {
                return text[store.state.languageCode]
            }

            if (text?.[defaultLanguage.value.code]) {
                return text[defaultLanguage.value.code]
            }

            return false
        }

        return {
            asset,
            assets,
            store,
            shortenQuestion,
            t,
            tippyContent,
            surveyElements,
            defaultLanguage,
            surveyElementTypes,
        }
    },
}
</script>

<style></style>

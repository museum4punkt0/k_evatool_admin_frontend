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
                v-html="
                    element.params.text[store.state.languageCode]
                        ? element.params.text[store.state.languageCode]
                        : element.params.text[defaultLanguage.code]
                "
            ></div>
            <div
                v-else-if="element.params?.question !== null"
                v-html="
                    element.params.question[store.state.languageCode]
                        ? element.params.question[store.state.languageCode]
                        : element.params.question[defaultLanguage.code]
                "
            ></div>
            <pre>{{}}</pre>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import FormInput from '../Forms/FormInput.vue'
import SurveyElement from '../Surveys/SurveyElement.vue'
export default {
    name: 'ElementContent',
    components: { FormInput, SurveyElement },
    props: { element: { type: Object, required: true } },
    setup() {
        const store = useStore()
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

        return {
            asset,
            assets,
            store,
            t,
            surveyElements,
            defaultLanguage,
            surveyElementTypes,
        }
    },
}
</script>

<style></style>

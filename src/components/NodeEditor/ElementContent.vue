<template>
    <div v-if="element" class="bg-gray-100">
        <div class="text-center text-sm">
            {{ element.name }}
            <p class="w-full text-xs text-gray-500">
                {{ element.surveyElementType }}
            </p>
        </div>
        <div class="text-center italic text-sm">
            <div v-if="element.surveyElementType === 'video'">
                TODO: video preview
            </div>

            <div v-else-if="element.surveyElementType === 'simpleText'">
                {{ element.params.text[defaultLanguage.code] }}
            </div>
            <div v-else>
                {{ element.params.question[defaultLanguage.code] }}
            </div>
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
        const defaultLanguage = computed(
            () => store.state.languages.defaultLanguage,
        )
        const { t } = useI18n()

        return {
            store,
            t,
            surveyElements,
            defaultLanguage,
        }
    },
}
</script>

<style></style>

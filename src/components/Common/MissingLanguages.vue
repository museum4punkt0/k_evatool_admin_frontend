<template>
    <div v-if="hasMissingLanguage" class="pt-2 px-2">
        <ExclamationIcon class="text-red-600 h-4 w-4 float-left mr-1.5" />
        <p class="text-red-600 text-xs">{{ t('notice_missing_languages') }}:</p>
        <p
            v-for="(missing, key) in missingLanguages"
            :key="'missingKey_' + missing"
            class="text-xs"
        >
            <span
                v-if="missing.find((x) => x.surveyId == route.params.id)?.codes"
                :key="
                    'missingLangKey_' +
                    lang +
                    missing.find((x) => x.surveyId == route.params.id)?.codes
                "
            >
                {{ key }} :
                <span>
                    {{
                        missing.find((x) => x.surveyId == route.params.id).codes
                    }}
                </span>
            </span>
        </p>
    </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ExclamationIcon } from '@heroicons/vue/outline'

export default {
    name: 'MissingLanguages',
    components: { ExclamationIcon },
    props: { missingLanguages: { type: Object, required: true } },
    setup(props) {
        const hasMissingLanguage = ref(false)
        const route = useRoute()
        const { t } = useI18n()

        watch(
            () => props.missingLanguages,
            () => {
                hasMissingLanguage.value = false
                if (props.missingLanguages) {
                    Object.entries(props.missingLanguages).forEach((x) => {
                        if (
                            x['1'].length > 0 &&
                            x[1].find((x) => x.surveyId == route.params.id)
                        ) {
                            hasMissingLanguage.value = true
                        }
                    })
                }
            },
            { deep: true, immediate: true },
        )

        onMounted(() => {})

        return { hasMissingLanguage, route, t }
    },
}
</script>

<style scoped></style>

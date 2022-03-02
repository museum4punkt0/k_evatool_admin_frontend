<template>
    <div v-if="hasMissingLanguage" class="pt-2 px-2">
        <ExclamationIcon class="text-red-600 h-4 w-4 float-left mr-1.5" />
        <p class="text-red-600 text-xs">{{ t('notice_missing_languages') }}:</p>
        <p
            v-for="(missing, key) in missingLanguages"
            :key="'missing_key_' + missing"
            class="text-xs"
        >
            <template v-if="specificSurvey">
                <span
                    v-if="
                        missing.find((x) => x.surveyId == route.params.id)
                            ?.codes
                    "
                >
                    {{ key }} :
                    <span>
                        {{
                            missing.find((x) => x.surveyId == route.params.id)
                                .codes
                        }}
                    </span>
                </span>
            </template>
            <template v-else>
                <span v-if="missing.length > 0">
                    {{ key }}:
                    <span
                        v-for="missingInSurvey in missing"
                        :key="'missing_in_survey' + missingInSurvey"
                    >
                        {{ t('surveys') }}
                        {{ missingInSurvey.surveyId }} -
                        {{ missingInSurvey.codes }}
                    </span>
                </span>
            </template>
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
    props: {
        missingLanguages: {
            type: Object,
            required: true,
        },
        specificSurvey: {
            type: Boolean,
            default: false,
        },
    },
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
                            props.specificSurvey &&
                            x['1'].length > 0 &&
                            x[1].find((x) => x.surveyId == route.params.id)
                        ) {
                            hasMissingLanguage.value = true
                        } else if (
                            x['1'].length > 0 &&
                            x[1].find((x) => x.surveyId)
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

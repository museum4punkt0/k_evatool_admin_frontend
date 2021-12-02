<template>
    <div>
        <div v-if="results.analysis">
            <div class="rounded overflow-hidden flex flex-row mb-4">
                <button
                    v-for="languageCode in Object.keys(results.analysis)"
                    :key="languageCode"
                    class="text-white px-2 py-1 text-sm flex-auto pointer"
                    :class="{
                        primary: selectedLanguage === languageCode,
                        secondary: selectedLanguage !== languageCode,
                    }"
                    @click="setSelectedLanguage(languageCode)"
                >
                    {{ languageCode }}
                </button>
            </div>
            <div>
                <template
                    v-for="languageCode in Object.keys(results.analysis)"
                    :key="languageCode"
                >
                    <div v-if="languageCode === selectedLanguage">
                        <div :class="`results_${languageCode}`">
                            <div
                                v-for="entry in Object.entries(
                                    results.analysis[languageCode].phrases,
                                ).sort((a, b) => a[1] < b[1])"
                                :key="entry[0]"
                            >
                                {{ entry[0] }}: {{ entry[1] }}
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
        <div v-else>no analysis available</div>
    </div>
</template>

<script>
import WordCloud from '../WordCloud.vue'
import { useState } from '../../../composables/state'
export default {
    name: 'TextAnalysisResults',
    components: { WordCloud },
    props: {
        results: {
            type: Array,
            required: true,
        },
    },
    setup(props) {
        const [selectedLanguage, setSelectedLanguage] = useState(
            props.results.analysis &&
                Object.keys(props.results.analysis).length > 0
                ? Object.keys(props.results.analysis)[0]
                : null,
        )
        return {
            selectedLanguage,
            setSelectedLanguage,
        }
    },
}
</script>

<style scoped></style>

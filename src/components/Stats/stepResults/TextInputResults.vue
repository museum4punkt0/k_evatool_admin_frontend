<template>
    <div>
        <div
            v-for="languageCode in Object.keys(results.timespan.results.texts)"
            :key="languageCode"
        >
            {{ languageCode }}
        </div>
        {{ results.timespan.results.analysis }}
        <!-- {{ results.total.results.analysis.en.phrases }} -->
        <!-- <word-cloud :data="results.total.results.analysis.en.phrases"></word-cloud> -->
    </div>
</template>

<script>
import WordCloud from '../WordCloud.vue'
export default {
    name: 'TextInputResults',
    components: { WordCloud },
    props: {
        results: {
            type: Array,
            required: true,
        },
    },
    setup() {
        return {}
    },
}
</script>

<style scoped></style>

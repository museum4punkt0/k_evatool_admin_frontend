<template>
    <div>
        <pre>
            <!-- {{ results.total.results.analysis.en.phrases }} -->
            <word-cloud :data="results.total.results.analysis.en.phrases"></word-cloud>
 
        </pre>
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

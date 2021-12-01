<template>
    <div ref="wordCloudRef" class="wordCloud">content</div>
</template>

<script>
import { onMounted, ref } from 'vue'

export default {
    name: 'WordCloud',
    components: {},
    setup() {
        const wordCloudRef = ref(null)
        onMounted(() => {
            console.log(document.getElementsByClassName('wordCloud'))
        })

        var words = [
            'words',
            'are',
            'cool',
            'and',
            'so',
            'are',
            'you',
            'inconstituent',
            'funhouse!',
            'apart',
            'from',
            'Steve',
            'fish',
        ].map(function (word) {
            return {
                word: word,
                freq: Math.floor(Math.random() * 50) + 10,
            }
        })

        words.sort(function (a, b) {
            return -1 * (a.freq - b.freq)
        })
        console.log(words)

        return {
            wordCloudRef,
            config: {
                trace: false,
                spiralResolution: 1, //Lower = better resolution
                spiralLimit: 360 * 5,
                lineHeight: 0.8,
                xWordPadding: 0,
                yWordPadding: 3,
                font: 'sans-serif',
            },
        }
    },
}
</script>

<style scoped></style>

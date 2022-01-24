<template>
    <span
        v-tippy="{
            content: showToolTip ? content : '',
        }"
        class=""
        v-html="shortenQuestion()"
    />
    <!--    <span>{{ content }}</span>-->
</template>

<script>
import { ref } from 'vue'

export default {
    name: 'SurveyStatsCell',
    props: {
        content: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        const showToolTip = ref(false)

        function htmlDecode(input) {
            const doc = new DOMParser().parseFromString(input, 'text/html')
            return doc.documentElement.textContent
        }

        function shortenQuestion() {
            const maxStringLength = 24
            const newString = htmlDecode(props.content)

            if (newString.length > maxStringLength) {
                showToolTip.value = true
                return newString.substring(0, maxStringLength) + '...'
            }
            return newString
        }

        return {
            showToolTip,
            shortenQuestion,
        }
    },
}
</script>

<style lang="scss" scoped></style>

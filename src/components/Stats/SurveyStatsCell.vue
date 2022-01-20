<template>
    <span
        v-tippy="{
            content: showToolTip ? content : '',
        }"
        class=""
        v-html="shortenQuestion()"
    />
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

        function shortenQuestion() {
            const maxStringLength = 24
            const newString = props.content
                .replace(/(<p[^>]+?>|<p>|<\/p>|<br \/>)/g, '')
                .replace(/(&nbsp;)/g, ' ')

            if (newString.length > maxStringLength) {
                showToolTip.value = true
                return newString.substring(0, 24) + '...'
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

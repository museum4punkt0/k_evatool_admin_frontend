<template>
    <simple-text-result
        v-if="step.surveyElementType === 'simpleText'"
        :result="result"
    ></simple-text-result>
    <binary-result
        v-else-if="step.surveyElementType === 'binary'"
        :result="result"
    ></binary-result>
    <multiple-choice-result
        v-else-if="step.surveyElementType === 'multipleChoice'"
        :result="result"
    ></multiple-choice-result>
    <star-rating-result
        v-else-if="step.surveyElementType === 'starRating'"
        :result="result"
    ></star-rating-result>
    <emoji-result
        v-else-if="step.surveyElementType === 'emoji'"
        :result="result"
    ></emoji-result>
    <text-input-result
        v-else-if="step.surveyElementType === 'textInput'"
        :result="result"
    ></text-input-result>
    <voice-input-result
        v-else-if="step.surveyElementType === 'voiceInput'"
        :result="result"
    ></voice-input-result>
    <yay-nay-result
        v-else-if="step.surveyElementType === 'yayNay'"
        :result="result"
    ></yay-nay-result>
    <video-result
        v-else-if="step.surveyElementType === 'video'"
        :result="result"
    ></video-result>

    <template v-else>
        {{ result }}
    </template>
</template>

<script>
import SimpleTextResult from './SimpleTextResult.vue'
import BinaryResult from './BinaryResult.vue'
import MultipleChoiceResult from './MultipleChoiceResult.vue'
import StarRatingResult from './StarRatingResult.vue'
import EmojiResult from './EmojiResult.vue'
import TextInputResult from './TextInputResult.vue'
import VoiceInputResult from './VoiceInputResult.vue'
import YayNayResult from './YayNayResult.vue'
import VideoResult from './VideoResult.vue'

export default {
    name: 'StepResult',
    components: {
        SimpleTextResult,
        BinaryResult,
        MultipleChoiceResult,
        StarRatingResult,
        EmojiResult,
        TextInputResult,
        VoiceInputResult,
        YayNayResult,
        VideoResult,
    },
    props: {
        step: {
            type: Object,
            required: true,
        },
        result: {
            type: Object,
            required: true,
        },
    },
    setup() {
        return {}
    },
}
</script>

<style scoped></style>

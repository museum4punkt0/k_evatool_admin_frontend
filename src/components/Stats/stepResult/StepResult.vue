<template>
    <simple-text-result
        v-if="step.surveyElementType === 'simpleText'"
        :result="result"
    />
    <binary-result
        v-else-if="step.surveyElementType === 'binary'"
        :params="stepParams"
        :result="result"
    />
    <multiple-choice-result
        v-else-if="step.surveyElementType === 'multipleChoice'"
        :params="stepParams.options"
        :result="result"
    />
    <star-rating-result
        v-else-if="step.surveyElementType === 'starRating'"
        :result="result"
    />
    <emoji-result
        v-else-if="step.surveyElementType === 'emoji'"
        :params="stepParams.emojis"
        :result="result"
    />
    <text-input-result
        v-else-if="step.surveyElementType === 'textInput'"
        :result="result"
    />
    <voice-input-result
        v-else-if="step.surveyElementType === 'voiceInput'"
        :result="result"
    />
    <yay-nay-result
        v-else-if="step.surveyElementType === 'yayNay'"
        :params="stepParams"
        :result="result"
    />
    <video-result
        v-else-if="step.surveyElementType === 'video'"
        :result="result"
    />
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
        stepParams: {
            type: Object,
            default: () => {},
        },
    },
    setup() {
        return {}
    },
}
</script>

<style scoped></style>

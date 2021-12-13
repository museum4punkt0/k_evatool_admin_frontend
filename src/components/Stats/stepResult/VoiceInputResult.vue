<template>
    <div class="audio">
        <!--        <audio
            v-if="result?.value?.url"
            class="audio-player"
            preload="auto"
            :src="result?.value?.url"
            type="audio/wav"
            controls
        ></audio>-->
    </div>
</template>

<script>
export default {
    name: 'VoiceInputResult',
    props: {
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

<style>
.audio {
    z-index: 1;
    position: relative;
}

audio::-webkit-media-controls-play-button,
audio::-webkit-media-controls-panel {
    background-color: #e1effe;
    color: #1c64f2;
}
</style>

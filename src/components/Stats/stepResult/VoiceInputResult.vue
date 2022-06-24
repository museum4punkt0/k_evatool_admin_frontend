<template>
    <div class="audio">
        <button
            v-if="result?.value?.url"
            class="btn-primary"
            @click="setShowModal(true)"
        >
            {{ t('action_show_audio') }}

            <check-icon
                v-if="result.value.transcriptionStatus"
                class="ml-3 w-5 h-5"
            />
        </button>
        <template v-if="showModal">
            <TransitionRoot appear :show="isOpen" as="template">
                <Dialog as="div" @close="setShowModal(false)">
                    <DialogOverlay class="fixed inset-0 bg-black opacity-30" />
                    <div class="fixed inset-0 z-10 overflow-y-auto">
                        <div class="min-h-screen px-4 text-center">
                            <TransitionChild
                                as="template"
                                enter="duration-300 ease-out"
                                enter-from="opacity-0"
                                enter-to="opacity-100"
                                leave="duration-200 ease-in"
                                leave-from="opacity-100"
                                leave-to="opacity-0"
                            >
                                <DialogOverlay class="fixed inset-0 mx-4" />
                            </TransitionChild>

                            <span
                                class="inline-block h-screen align-middle"
                                aria-hidden="true"
                            >
                                &#8203;
                            </span>

                            <TransitionChild
                                as="template"
                                enter="duration-300 ease-out"
                                enter-from="opacity-0 scale-95"
                                enter-to="opacity-100 scale-100"
                                leave="duration-200 ease-in"
                                leave-from="opacity-100 scale-100"
                                leave-to="opacity-0 scale-95"
                            >
                                <div
                                    class="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
                                >
                                    <DialogTitle
                                        as="h3"
                                        class="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Audio
                                    </DialogTitle>
                                    <div class="mt-2">
                                        <audio
                                            v-if="result?.value?.url"
                                            class="audio-player"
                                            preload="auto"
                                            :src="result?.value?.url"
                                            type="audio/wav"
                                            controls
                                        ></audio>
                                    </div>

                                    <hr class="mt-4 mb-2" />
                                    <h4>{{ t('transcriptions', 1) }}</h4>

                                    <!-- <input
                                        v-model="manualTranscription"
                                        type="text"
                                    /> -->
                                    <textarea
                                        v-model="manualTranscription"
                                        rows="4"
                                        cols="50"
                                        class="w-full"
                                    ></textarea>

                                    <button
                                        :disabled="
                                            manualTranscription.length < 1 ||
                                            manualTranscription.length > 1000 ||
                                            savingManualTranscription
                                        "
                                        class="btn-primary small mt-3"
                                        @click="saveManualTranscription"
                                    >
                                        {{ t('action_save') }}
                                    </button>

                                    <template
                                        v-if="
                                            store.state.app
                                                .speechToTextServiceEnabled
                                        "
                                    >
                                        <hr class="mt-4 mb-2" />
                                        <h4>
                                            {{ t('speech_to_text_service') }}
                                            <small class="text-gray-600">
                                                Status:
                                                <strong>
                                                    {{
                                                        result.value
                                                            .transcriptionStatus ||
                                                        transcription?.status
                                                    }}
                                                </strong>
                                            </small>
                                        </h4>

                                        <div class="flex">
                                            {{
                                                result.value.apiTranscription ||
                                                transcription?.autoTranscription
                                            }}
                                        </div>

                                        <button
                                            v-if="result.value.resultAssetId"
                                            :disabled="requestingTranscription"
                                            class="btn-primary small mt-3"
                                            @click="requestTranscription"
                                        >
                                            {{
                                                t(
                                                    'action_request_transcription',
                                                )
                                            }}
                                        </button>

                                        <div class="mt-4 flex justify-end">
                                            <button
                                                type="button"
                                                class="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                                @click="setShowModal(false)"
                                            >
                                                {{ t('action_close') }}
                                            </button>
                                        </div>
                                    </template>
                                </div>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </TransitionRoot>
        </template>
    </div>
</template>

<script>
import { ref } from 'vue'

import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
    DialogTitle,
} from '@headlessui/vue'

import { CheckIcon } from '@heroicons/vue/outline'

import { useI18n } from 'vue-i18n'
import TRANSCRIPTION_SERVICE from '../../../services/transcriptionService'
import { useStore } from 'vuex'

import _ from 'lodash'

export default {
    name: 'VoiceInputResult',
    components: {
        Dialog,
        DialogOverlay,
        DialogTitle,
        TransitionRoot,
        TransitionChild,
        CheckIcon,
    },
    props: {
        result: {
            type: Object,
            required: true,
        },
    },
    setup(props) {
        const isOpen = ref(true)
        const store = useStore()
        const showModal = ref(false)
        const manualTranscription = ref('')
        const requestingTranscription = ref(false)
        const savingManualTranscription = ref(false)
        const transcription = ref(null)
        const { t } = useI18n()

        const setShowModal = (show) => {
            showModal.value = show
        }

        const requestTranscription = async () => {
            requestingTranscription.value = true
            transcription.value = await TRANSCRIPTION_SERVICE.getTranscription(
                props.result.value.resultAssetId,
            )

            requestingTranscription.value = false
        }

        if (props.result.value.manualTranscription) {
            manualTranscription.value = _.cloneDeep(
                props.result.value.manualTranscription,
            )
        }

        const saveManualTranscription = async () => {
            savingManualTranscription.value = true
            transcription.value =
                await TRANSCRIPTION_SERVICE.setManualTranscription(
                    props.result.value.resultAssetId,
                    manualTranscription.value,
                )
            savingManualTranscription.value = false
        }

        return {
            isOpen,
            showModal,
            setShowModal,
            t,
            manualTranscription,
            requestTranscription,
            transcription,
            saveManualTranscription,
            requestingTranscription,
            savingManualTranscription,
            store,
        }
    },
}
</script>

<style>
.audio {
    z-index: 1;
    position: relative;
}

/*audio::-webkit-media-controls-play-button,
audio::-webkit-media-controls-panel {
    background-color: #e1effe;
    color: #1c64f2;
}*/
</style>

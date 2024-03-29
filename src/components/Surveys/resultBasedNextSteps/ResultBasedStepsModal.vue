<template>
    <TransitionRoot appear :show="isOpen" as="template">
        <Dialog as="div" @close="closeModal">
            <DialogOverlay class="fixed inset-0 bg-black opacity-70 z-10" />
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
                            class="inline-block w-full max-w-xl p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
                        >
                            <div class="flex justify-between">
                                <DialogTitle
                                    as="h3"
                                    class="text-lg font-medium leading-6 text-gray-900 text-capitalize"
                                >
                                    {{ t('result_based_steps', 2) }}
                                </DialogTitle>
                                <x-icon
                                    class="h-6 w-6 pointer"
                                    @click="closeModal"
                                />
                            </div>

                            <div class="mt-2">
                                <binary-result-based-next-steps
                                    v-if="
                                        surveyStep.surveyElementType ===
                                        'binary'
                                    "
                                ></binary-result-based-next-steps>
                                <emoji-result-based-next-steps
                                    v-if="
                                        surveyStep.surveyElementType === 'emoji'
                                    "
                                ></emoji-result-based-next-steps>
                                <multiple-choice-result-based-next-steps
                                    v-if="
                                        surveyStep.surveyElementType ===
                                        'multipleChoice'
                                    "
                                ></multiple-choice-result-based-next-steps>
                                <star-rating-result-based-next-steps
                                    v-if="
                                        surveyStep.surveyElementType ===
                                        'starRating'
                                    "
                                ></star-rating-result-based-next-steps>
                            </div>
                        </div>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script>
import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
    DialogTitle,
} from '@headlessui/vue'

import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import FormToggle from '../../Forms/FormToggle.vue'
import { useI18n } from 'vue-i18n'
import FormInput from '../../Forms/FormInput.vue'
import FormSelect from '../../Forms/FormSelect.vue'

import { TrashIcon, StopIcon, XIcon } from '@heroicons/vue/outline'

import useVuelidate from '@vuelidate/core'

import BinaryResultBasedNextSteps from './BinaryResultBasedNextSteps.vue'
import EmojiResultBasedNextSteps from './EmojiResultBasedNextSteps.vue'
import MultipleChoiceResultBasedNextSteps from './MultipleChoiceResultBasedNextSteps.vue'
import StarRatingResultBasedNextSteps from './StarRatingResultBasedNextSteps.vue'

export default {
    name: 'ResultBasedStepsModal',
    components: {
        FormSelect,
        FormInput,
        FormToggle,
        TransitionRoot,
        TransitionChild,
        Dialog,
        DialogOverlay,
        DialogTitle,
        TrashIcon,
        StopIcon,
        XIcon,
        BinaryResultBasedNextSteps,
        EmojiResultBasedNextSteps,
        MultipleChoiceResultBasedNextSteps,
        StarRatingResultBasedNextSteps,
    },
    props: {
        isOpen: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update:is-open'],
    setup(props, { emit }) {
        const store = useStore()
        const { t } = useI18n()
        const savingResultBasedSteps = ref(false)

        const surveyStepId = store.state.surveys.surveyStepId
        const surveyStep = store.state.surveys.surveyStep
        const modalIsOpen = computed({
            get: () => props.isOpen,
            set: (val) => emit('update:is-open', val),
        })
        const language = store.state.languages.language
            ? store.state.languages.language
            : store.state.languages.languages.find(
                  (language) => language.default,
              )

        return {
            v$: useVuelidate(),
            modalIsOpen,
            store,
            t,
            closeModal() {
                modalIsOpen.value = false
            },
            surveyStep,
            surveyStepId,
            savingResultBasedSteps,
            language,
        }
    },
}
</script>

<style scoped></style>

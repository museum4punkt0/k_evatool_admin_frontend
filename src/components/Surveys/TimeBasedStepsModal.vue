<template>
    <TransitionRoot appear :show="isOpen" as="template">
        <Dialog as="div" @close="closeModal">
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
                        <DialogOverlay class="fixed inset-0" />
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
                            class="
                                inline-block
                                w-full
                                max-w-md
                                p-6
                                my-8
                                overflow-hidden
                                text-left
                                align-middle
                                transition-all
                                transform
                                bg-white
                                shadow-xl
                                rounded-2xl
                            "
                        >
                            <DialogTitle
                                as="h3"
                                class="
                                    text-lg
                                    font-medium
                                    leading-6
                                    text-gray-900
                                "
                            >
                                Title {{ surveyStepId }}
                            </DialogTitle>
                            <div class="mt-2">
                                <p class="text-sm text-gray-500">Text</p>
                            </div>

                            <div class="mt-4">
                                <button class="primary" @click="closeModal">
                                    Close
                                </button>
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
import { computed } from 'vue'

export default {
    name: 'TimeBasedStepsModal',
    components: {
        TransitionRoot,
        TransitionChild,
        Dialog,
        DialogOverlay,
        DialogTitle,
    },
    props: {
        isOpen: {
            type: Boolean,
            default: false,
        },
        surveyStepId: {
            type: Number,
            default: -1,
        },
    },
    emits: ['update:is-open'],
    setup(props, { emit }) {
        const modalIsOpen = computed({
            get: () => props.isOpen,
            set: (val) => emit('update:is-open', val),
        })

        return {
            modalIsOpen,
            closeModal() {
                modalIsOpen.value = false
            },
        }
    },
}
</script>

<style scoped></style>

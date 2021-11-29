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
                                max-w-xl
                                p-6
                                my-8
                                text-left
                                align-middle
                                transition-all
                                transform
                                bg-white
                                shadow-xl
                                rounded-2xl
                            "
                        >
                            <div class="flex justify-between">
                                <DialogTitle
                                    as="h3"
                                    class="
                                        text-lg
                                        font-medium
                                        leading-6
                                        text-gray-900 text-capitalize
                                    "
                                >
                                    modal title
                                </DialogTitle>
                                <x-icon
                                    class="h-6 w-6 pointer"
                                    @click="closeModal"
                                />
                            </div>

                            <div class="mt-2">
                                modal content
                                <ul>
                                    <li>
                                        {{ surveyStepId }}
                                    </li>
                                    <li>
                                        todo: get result data from store and
                                        render graph
                                    </li>
                                </ul>
                                <demo></demo>
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
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { StopIcon, TrashIcon, XIcon } from '@heroicons/vue/outline'
import Demo from './Demo.vue'

export default {
    name: 'AssetModal',
    components: {
        TransitionRoot,
        TransitionChild,
        Dialog,
        DialogOverlay,
        DialogTitle,
        TrashIcon,
        StopIcon,
        XIcon,
        Demo,
    },
    props: {
        surveyStepId: {
            type: Number,
            required: true,
        },
        isOpen: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update:is-open'],
    setup(props, { emit }) {
        const store = useStore()
        const { t } = useI18n()

        const modalIsOpen = computed({
            get: () => props.isOpen,
            set: (val) => emit('update:is-open', val),
        })

        return {
            modalIsOpen,
            store,
            t,
            closeModal() {
                modalIsOpen.value = false
            },
        }
    },
}
</script>

<style scoped></style>

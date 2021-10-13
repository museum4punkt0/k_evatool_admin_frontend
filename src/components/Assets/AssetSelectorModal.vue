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
                                max-w-2xl
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
                                    text-gray-900 text-capitalize
                                "
                            >
                                {{ t('assets', 2) }}
                            </DialogTitle>

                            <div class="mt-2">
                                <div
                                    v-for="asset in assets.filter((item) => {
                                        return item.mime.startsWith(
                                            mimeTypeFilterPrefix,
                                        )
                                    })"
                                    :key="'asset-' + asset.id"
                                    @click="selectAsset(asset.id)"
                                >
                                    <input
                                        type="checkbox"
                                        :checked="
                                            selectedAssets.includes(asset.id)
                                        "
                                    />
                                    {{ asset.id }} {{ asset.filename }}

                                    <img
                                        :src="asset.urls.url"
                                        alt=""
                                        class="w-1/4"
                                    />
                                </div>
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
import { useStore } from 'vuex'
import FormToggle from '../Forms/FormToggle.vue'
import { useI18n } from 'vue-i18n'
import FormInput from '../Forms/FormInput.vue'
import FormSelect from '../Forms/FormSelect.vue'

import { TrashIcon, StopIcon } from '@heroicons/vue/outline'

export default {
    name: 'AssetSelectorModal',
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
    },
    props: {
        isOpen: {
            type: Boolean,
            default: true,
        },
        selectedAssets: {
            type: [Array, Number],
            default: null,
        },
        multipleSelect: {
            type: Boolean,
            default: true,
        },
        autoClose: {
            type: Boolean,
            default: false,
        },
        mimeTypeFilterPrefix: {
            type: String,
            default: '',
        },
    },
    emits: ['update:is-open', 'update:selected-assets'],
    setup(props, { emit }) {
        const store = useStore()
        const { t } = useI18n()

        const modalIsOpen = computed({
            get: () => props.isOpen,
            set: (val) => emit('update:is-open', val),
        })

        const selectedAssetsLocal = computed({
            get: () => props.selectedAssets,
            set: (val) => emit('update:selected-assets', val),
        })

        const assets = computed({
            get: () => store.state.assets.assets,
        })
        const selectAsset = (assetId) => {
            if (props.multipleSelect) {
                if (!Array.isArray(selectedAssetsLocal.value)) {
                    selectedAssetsLocal.value = [assetId]
                } else {
                    const index = selectedAssetsLocal.value.indexOf(assetId)
                    if (index < 0) {
                        selectedAssetsLocal.value.push(assetId)
                    } else {
                        selectedAssetsLocal.value.splice(index, 1)
                    }
                }
            } else {
                selectedAssetsLocal.value = assetId
                if (props.autoClose) {
                    modalIsOpen.value = false
                }
            }
        }

        return {
            assets,
            selectAsset,
            modalIsOpen,
            selectedAssetsLocal,
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

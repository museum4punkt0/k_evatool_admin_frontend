<template>
    <button
        type="button"
        class="mt-3"
        :class="color"
        :disabled="disabled || executing"
        @click="emitExecute"
    >
        {{ actionText }}
        <slot v-if="!actionText"></slot>
    </button>
</template>

<script>
export default {
    name: 'ActionButton',
    props: {
        disabled: {
            type: Boolean,
            default: false,
        },
        executing: {
            type: Boolean,
            default: false,
        },
        color: {
            type: String,
            default: 'primary',
        },
        actionText: {
            type: String,
            default: '',
        },
    },
    emits: ['execute'],
    setup(props, { emit }) {
        const emitExecute = () => {
            emit('execute')
        }
        return { emitExecute }
    },
}
</script>

<style scoped></style>
